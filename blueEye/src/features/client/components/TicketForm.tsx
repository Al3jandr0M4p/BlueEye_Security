import { useState, type ChangeEvent, type FormEvent } from "react";
import type { NewTicketInput } from "../types/client.types";

interface TicketFormProps {
  onSubmit: (input: NewTicketInput) => Promise<void>;
}

interface FormErrors {
  site?: string;
  equipment?: string;
  description?: string;
}

const initialState: NewTicketInput = {
  site: "",
  equipment: "",
  description: "",
};

const TicketForm = ({ onSubmit }: TicketFormProps) => {
  const [formData, setFormData] = useState<NewTicketInput>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.site.trim()) nextErrors.site = "El sitio es requerido.";
    if (!formData.equipment.trim()) nextErrors.equipment = "El equipo es requerido.";
    if (!formData.description.trim()) nextErrors.description = "La descripcion es requerida.";
    if (formData.description.length > 500) {
      nextErrors.description = "La descripcion debe tener maximo 500 caracteres.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData(initialState);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField =
    (field: keyof NewTicketInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Reportar falla</h2>

      <div>
        <label htmlFor="ticket-site" className="mb-1 block text-sm font-medium text-gray-700">
          Sitio
        </label>
        <input
          id="ticket-site"
          value={formData.site}
          onChange={updateField("site")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Ej. HQ Santo Domingo"
        />
        {errors.site && <p className="mt-1 text-xs text-red-600">{errors.site}</p>}
      </div>

      <div>
        <label htmlFor="ticket-equipment" className="mb-1 block text-sm font-medium text-gray-700">
          Equipo
        </label>
        <input
          id="ticket-equipment"
          value={formData.equipment}
          onChange={updateField("equipment")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Ej. Cam-03 Warehouse 1"
        />
        {errors.equipment && <p className="mt-1 text-xs text-red-600">{errors.equipment}</p>}
      </div>

      <div>
        <label htmlFor="ticket-description" className="mb-1 block text-sm font-medium text-gray-700">
          Descripcion
        </label>
        <textarea
          id="ticket-description"
          value={formData.description}
          onChange={updateField("description")}
          className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          placeholder="Describe el problema detectado."
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Crear ticket"}
      </button>
    </form>
  );
};

export default TicketForm;
