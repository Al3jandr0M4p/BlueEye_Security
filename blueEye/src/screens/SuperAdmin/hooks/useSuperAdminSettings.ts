import { useEffect, useState } from "react";
import { fetchSuperAdminSettings } from "../../../service/service";
import type {
  SuperAdminSettingsFeature,
  SuperAdminSettingsRoute,
} from "../../../types/superAdmin.types";

export function useSuperAdminSettings() {
  const [features, setFeatures] = useState<SuperAdminSettingsFeature[]>([]);
  const [routes, setRoutes] = useState<SuperAdminSettingsRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuperAdminSettings();
        if (!mounted) return;

        setFeatures(data.features);
        setRoutes(data.routes);
        setError(null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar la configuracion real del modulo.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    error,
    features,
    isLoading,
    routes,
  };
}
