import { useEffect, useState } from "react";
import {
  fetchAdminBusinessOverview,
  fetchAdminCatalogOverview,
  fetchAdminClientsOverview,
  fetchAdminInventoryOverview,
  fetchAdminPreProjectOverview,
  fetchAdminProjectOverview,
  fetchAdminReportsOverview,
} from "../service/adminServices";

type Loader<T> = () => Promise<T>;

type UseAdminSectionResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const useAdminSection = <T,>(loader: Loader<T>): UseAdminSectionResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSection = async () => {
      try {
        setLoading(true);
        const result = await loader();
        if (!mounted) return;
        setData(result);
        setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (!mounted) return;
        setError("No se pudo cargar la informacion");
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadSection();

    return () => {
      mounted = false;
    };
  }, [loader]);

  return { data, loading, error };
};

export const useAdminClientsOverview = () =>
  useAdminSection(fetchAdminClientsOverview);

export const useAdminBusinessOverview = () =>
  useAdminSection(fetchAdminBusinessOverview);

export const useAdminProjectOverview = () =>
  useAdminSection(fetchAdminProjectOverview);

export const useAdminPreProjectOverview = () =>
  useAdminSection(fetchAdminPreProjectOverview);

export const useAdminCatalogOverview = () =>
  useAdminSection(fetchAdminCatalogOverview);

export const useAdminInventoryOverview = () =>
  useAdminSection(fetchAdminInventoryOverview);

export const useAdminReportsOverview = () =>
  useAdminSection(fetchAdminReportsOverview);
