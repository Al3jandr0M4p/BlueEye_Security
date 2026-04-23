import { useCallback, useEffect, useState } from "react";
import { fetchTechSitesService } from "../service/service";
import type { TechSite } from "../types/tech.types";

export function useTechSites() {
  const [sites, setSites] = useState<TechSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTechSitesService();
      setSites(
        (data as TechSite[]).map((site) => ({
          ...site,
          id: String(site.id),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los sitios.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { error, isLoading, load, sites };
}

