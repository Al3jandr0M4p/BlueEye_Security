import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTechSurveyPointService,
  createTechSurveyService,
  fetchTechSitesService,
  fetchTechSurveyByIdService,
  fetchTechSurveyPointsService,
  fetchTechSurveysService,
  updateTechSurveyService,
  uploadTechSurveyPhotoService,
} from "../service/service";
import type {
  TechSite,
  TechSurvey,
  TechSurveyPoint,
  TechSurveyStatus,
} from "../types/tech.types";

export function useTechSurveys() {
  const [sites, setSites] = useState<TechSite[]>([]);
  const [surveys, setSurveys] = useState<TechSurvey[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [survey, setSurvey] = useState<TechSurvey | null>(null);
  const [points, setPoints] = useState<TechSurveyPoint[]>([]);

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

  const loadSurveys = useCallback(async (siteId: string) => {
    const data = await fetchTechSurveysService({ siteId });
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

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loadSites();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los sitios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadSites]);

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
      return;
    }

    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        await Promise.all([loadSurvey(selectedSurveyId), loadPoints(selectedSurveyId)]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el levantamiento.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loadPoints, loadSurvey, selectedSurveyId]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) ?? null,
    [selectedSiteId, sites],
  );

  const createSurvey = useCallback(async () => {
    if (!selectedSiteId) return;
    setIsLoading(true);
    setError(null);
    try {
      const created = await createTechSurveyService({ siteId: selectedSiteId });
      const id = String((created as TechSurvey).id);
      await loadSurveys(selectedSiteId);
      setSelectedSurveyId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el levantamiento.");
    } finally {
      setIsLoading(false);
    }
  }, [loadSurveys, selectedSiteId]);

  const saveSurvey = useCallback(
    async (payload: {
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
        await updateTechSurveyService(selectedSurveyId, payload);
        await loadSurvey(selectedSurveyId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar el levantamiento.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadSurvey, selectedSurveyId],
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

  return {
    addPoint,
    createSurvey,
    error,
    isLoading,
    points,
    saveSurvey,
    selectedSite,
    selectedSiteId,
    selectedSurveyId,
    setSelectedSiteId,
    setSelectedSurveyId,
    sites,
    survey,
    surveys,
    uploadPhoto,
  };
}

