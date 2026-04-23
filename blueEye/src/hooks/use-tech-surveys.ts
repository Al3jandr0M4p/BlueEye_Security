import { useCallback, useEffect, useMemo, useState } from "react";
import { sileo } from "sileo";
import {
  createTechSurveyRequirementService,
  createTechSurveyPointService,
  createTechSurveyService,
  createTechSurveyUpdateService,
  fetchTechCatalogProductsService,
  fetchTechSitesService,
  fetchTechSurveyByIdService,
  fetchTechSurveyPointsService,
  fetchTechSurveyRequirementsService,
  fetchTechSurveysService,
  fetchTechSurveyUpdatesService,
  fetchTechTicketsService,
  updateTechSurveyService,
  uploadTechSurveyPhotoService,
} from "../service/service";
import type {
  TechCatalogProduct,
  TechSurveyRequirement,
  TechSite,
  TechSurvey,
  TechSurveyPoint,
  TechSurveyStatus,
  TechSurveyUpdate,
  TechTicket,
} from "../types/tech.types";

export function useTechSurveys() {
  const [sites, setSites] = useState<TechSite[]>([]);
  const [surveys, setSurveys] = useState<TechSurvey[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<TechTicket[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<TechCatalogProduct[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [survey, setSurvey] = useState<TechSurvey | null>(null);
  const [points, setPoints] = useState<TechSurveyPoint[]>([]);
  const [updates, setUpdates] = useState<TechSurveyUpdate[]>([]);
  const [requirements, setRequirements] = useState<TechSurveyRequirement[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSites = useCallback(async () => {
    const data = await fetchTechSitesService();
    const normalized = (data as TechSite[]).map((site) => ({
      ...site,
      id: String(site.id),
    }));
    setSites(normalized);
    if (!selectedSiteId && normalized[0]?.id) {
      setSelectedSiteId(normalized[0].id);
    }
  }, [selectedSiteId]);

  const loadAssignedTickets = useCallback(async () => {
    const data = await fetchTechTicketsService({ planningStatus: "planned" });
    setAssignedTickets(
      (data as TechTicket[]).map((ticket) => ({ ...ticket, id: String(ticket.id) })),
    );
  }, []);

  const loadCatalogProducts = useCallback(async () => {
    const data = await fetchTechCatalogProductsService();
    setCatalogProducts(
      (data as TechCatalogProduct[]).map((product) => ({
        ...product,
        id: String(product.id),
        price: Number(product.price ?? 0),
        stock: Number(product.stock ?? 0),
      })),
    );
  }, []);

  const loadSurveys = useCallback(async (siteId?: string) => {
    const data = await fetchTechSurveysService(siteId ? { siteId } : undefined);
    const normalized = (data as TechSurvey[]).map((item) => ({
      ...item,
      id: String(item.id),
    }));
    setSurveys(normalized);
    if (!selectedSurveyId && normalized[0]?.id) {
      setSelectedSurveyId(normalized[0].id);
    }
  }, [selectedSurveyId]);

  const loadSurvey = useCallback(async (surveyId: string) => {
    const data = await fetchTechSurveyByIdService(surveyId);
    setSurvey({ ...(data as TechSurvey), id: String((data as TechSurvey).id) });
  }, []);

  const loadPoints = useCallback(async (surveyId: string) => {
    const data = await fetchTechSurveyPointsService(surveyId);
    setPoints(
      (data as TechSurveyPoint[]).map((point) => ({ ...point, id: String(point.id) })),
    );
  }, []);

  const loadUpdates = useCallback(async (surveyId: string) => {
    const data = await fetchTechSurveyUpdatesService(surveyId);
    setUpdates(
      (data as TechSurveyUpdate[]).map((entry) => ({ ...entry, id: String(entry.id) })),
    );
  }, []);

  const loadRequirements = useCallback(async (surveyId: string) => {
    const data = await fetchTechSurveyRequirementsService(surveyId);
    setRequirements(
      (data as TechSurveyRequirement[]).map((entry) => ({
        ...entry,
        id: String(entry.id),
      })),
    );
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadSites(), loadAssignedTickets(), loadCatalogProducts()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los sitios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadAssignedTickets, loadCatalogProducts, loadSites]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!selectedSiteId) return;
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        await loadSurveys(selectedSiteId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar los levantamientos.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loadSurveys, selectedSiteId]);

  useEffect(() => {
    if (!selectedSurveyId) {
      setSurvey(null);
      setPoints([]);
      setUpdates([]);
      setRequirements([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        await Promise.all([
          loadSurvey(selectedSurveyId),
          loadPoints(selectedSurveyId),
          loadUpdates(selectedSurveyId),
          loadRequirements(selectedSurveyId),
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el levantamiento.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loadPoints, loadRequirements, loadSurvey, loadUpdates, selectedSurveyId]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) ?? null,
    [selectedSiteId, sites],
  );

  const createSurvey = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await createTechSurveyService({
        siteId: selectedSiteId || undefined,
      });
      const id = String((created as TechSurvey).id);
      await loadSurveys(selectedSiteId || undefined);
      setSelectedSurveyId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el levantamiento.");
    } finally {
      setIsLoading(false);
    }
  }, [loadSurveys, selectedSiteId]);

  const startSurveyFromTicket = useCallback(
    async (ticket: TechTicket) => {
      const normalizedTicketSite = String(ticket.site ?? "")
        .trim()
        .toLowerCase();

      const matchedSite =
        sites.find((site) => String(site.id) === String(ticket.site_id ?? "")) ??
        sites.find(
          (site) => String(site.name ?? "").trim().toLowerCase() === normalizedTicketSite,
        ) ??
        null;

      setIsLoading(true);
      setError(null);
      try {
        if (matchedSite?.id) {
          setSelectedSiteId(matchedSite.id);

          const existingSurveys = await fetchTechSurveysService({ siteId: matchedSite.id });
          const normalizedSurveys = (existingSurveys as TechSurvey[]).map((item) => ({
            ...item,
            id: String(item.id),
          }));

          setSurveys(normalizedSurveys);

          const linkedSurvey = normalizedSurveys.find(
            (survey) => String(survey.ticket_id ?? "") === String(ticket.id),
          );

          if (linkedSurvey?.id) {
            setSelectedSurveyId(linkedSurvey.id);
            return;
          }
        } else {
          const existingSurveys = await fetchTechSurveysService();
          const normalizedSurveys = (existingSurveys as TechSurvey[]).map((item) => ({
            ...item,
            id: String(item.id),
          }));

          setSurveys(normalizedSurveys);

          const linkedSurvey = normalizedSurveys.find(
            (survey) => String(survey.ticket_id ?? "") === String(ticket.id),
          );

          if (linkedSurvey?.id) {
            setSelectedSurveyId(linkedSurvey.id);
            return;
          }
        }

        const created = await createTechSurveyService({
          siteId: matchedSite?.id,
          ticketId: ticket.id,
          title:
            ticket.site?.trim() ||
            ticket.equipment?.trim() ||
            "Levantamiento tecnico",
        });

        const createdId = String((created as TechSurvey).id);
        if (matchedSite?.id) {
          await loadSurveys(matchedSite.id);
        } else {
          setSurveys((prev) => [{ ...(created as TechSurvey), id: createdId }, ...prev]);
        }
        setSelectedSurveyId(createdId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo iniciar el levantamiento desde el ticket.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [loadSurveys, sites],
  );

  const saveSurvey = useCallback(
    async (payload: {
      clientId?: string;
      siteId?: string;
      ticketId?: string;
      title?: string;
      status?: TechSurveyStatus;
      objectives?: string;
      risks?: string;
      powerStatus?: string;
      networkStatus?: string;
      notes?: string;
    }) => {
      if (!selectedSurveyId) return;
      setIsLoading(true);
      setError(null);
      try {
        const updatedSurvey = await updateTechSurveyService(selectedSurveyId, payload);
        await loadSurvey(selectedSurveyId);
        await loadRequirements(selectedSurveyId);
        await loadSurveys(selectedSiteId || undefined);

        if (payload.status === "submitted") {
          sileo.success({
            title: "Levantamiento terminado",
            description: "El levantamiento se marco como finalizado correctamente.",
          });
        } else {
          sileo.success({
            title: "Levantamiento guardado",
            description: "Los cambios del levantamiento fueron actualizados.",
          });
        }

        return updatedSurvey;
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar el levantamiento.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadRequirements, loadSurvey, loadSurveys, selectedSiteId, selectedSurveyId],
  );

  const addPoint = useCallback(
    async (payload: {
      zone: string;
      height?: string;
      angle?: string;
      cameraSuggestion?: string;
      notes?: string;
    }) => {
      if (!selectedSurveyId) return;
      setIsLoading(true);
      setError(null);
      try {
        await createTechSurveyPointService(selectedSurveyId, payload);
        await loadPoints(selectedSurveyId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar el punto.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadPoints, selectedSurveyId],
  );

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!selectedSurveyId) return;
      setIsLoading(true);
      setError(null);
      try {
        await uploadTechSurveyPhotoService(selectedSurveyId, file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSurveyId],
  );

  const addUpdate = useCallback(
    async (payload: {
      status?: string;
      title: string;
      details?: string;
    }) => {
      if (!selectedSurveyId) return;
      setIsLoading(true);
      setError(null);
      try {
        await createTechSurveyUpdateService(selectedSurveyId, payload);
        await loadUpdates(selectedSurveyId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo registrar el avance.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadUpdates, selectedSurveyId],
  );

  const addRequirement = useCallback(
    async (payload: {
      category?: string;
      itemName: string;
      quantity?: number;
      unitPrice?: number;
      installArea?: string;
      notes?: string;
    }) => {
      if (!selectedSurveyId) return;
      setIsLoading(true);
      setError(null);
      try {
        await createTechSurveyRequirementService(selectedSurveyId, payload);
        await loadRequirements(selectedSurveyId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo registrar el equipo.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadRequirements, selectedSurveyId],
  );

  return {
    addRequirement,
    addPoint,
    addUpdate,
    assignedTickets,
    catalogProducts,
    createSurvey,
    error,
    isLoading,
    points,
    requirements,
    saveSurvey,
    selectedSite,
    selectedSiteId,
    selectedSurveyId,
    setSelectedSiteId,
    setSelectedSurveyId,
    sites,
    startSurveyFromTicket,
    survey,
    surveys,
    uploadPhoto,
    updates,
  };
}

