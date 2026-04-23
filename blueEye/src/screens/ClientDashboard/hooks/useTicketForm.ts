import {
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import type { NewTicketInput } from "../../../types/client.types";

const initialState: NewTicketInput = {
  description: "",
  equipment: "",
  site: "",
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

interface FormErrors {
  description?: string;
  equipment?: string;
  photo?: string;
  site?: string;
}

export function useTicketForm(
  onSubmit: (input: NewTicketInput, photo?: File) => Promise<void>,
) {
  const [formData, setFormData] = useState<NewTicketInput>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const applyFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Formato no soportado. Usa JPG, PNG, WEBP o GIF.",
      }));
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: `La imagen no puede superar ${MAX_SIZE_MB} MB.`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: undefined }));
    setPhoto(file);

    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return url;
    });
  };

  const removePhoto = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(null);
    setPreview(null);
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.site.trim()) {
      nextErrors.site = "El sitio es requerido.";
    }

    if (!formData.equipment.trim()) {
      nextErrors.equipment = "El equipo es requerido.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "La descripcion es requerida.";
    }

    if (formData.description.length > 500) {
      nextErrors.description = "Maximo 500 caracteres.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData, photo ?? undefined);
      setFormData(initialState);
      setErrors({});
      removePhoto();
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField =
    (field: keyof NewTicketInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      applyFile(file);
    }
  };

  return {
    applyFile,
    descriptionLength: formData.description.length,
    dragging,
    errors,
    formData,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    isSubmitting,
    maxSizeMb: MAX_SIZE_MB,
    photo,
    preview,
    removePhoto,
    updateField,
  };
}
