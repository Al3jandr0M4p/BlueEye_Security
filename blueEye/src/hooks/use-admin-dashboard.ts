import { useEffect, useState } from "react";
import {
  fetchAdminBusinessOverview,
  fetchAdminCatalogOverview,
  fetchAdminClientsOverview,
  fetchAdminInventoryOverview,
  fetchAdminPreProjectOverview,
  fetchAdminProjectOverview,
  fetchAdminReportsOverview,
} from "../service/service";

type Loader<T> = () => Promise<T>;

type UseAdminSectionResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const useAdminSection = <T,>(loader: Loader<T>): UseAdminSectionResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const loadSection = async (mountedRef?: { current: boolean }) => {
    try {
      setLoading(true);
      const result = await loader();
      if (mountedRef && !mountedRef.current) return;
      setData(result);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      if (mountedRef && !mountedRef.current) return;
      setError("No se pudo cargar la informacion");
    } finally {
      if (mountedRef && !mountedRef.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    const mountedRef = { current: true };

    void loadSection(mountedRef);

    return () => {
      mountedRef.current = false;
    };
  }, [loader, reloadToken]);

  return {
    data,
    loading,
    error,
    reload: async () => {
      setReloadToken((current) => current + 1);
    },
  };
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
