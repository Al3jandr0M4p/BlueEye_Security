export function useSuperAdminSettings() {
  return {
    available: [
      "GET /api/super/admin/dashboard",
      "GET /api/super/admin/dashboard/kpis",
      "GET /api/super/admin/dashboard/growth",
      "GET /api/super/admin/companies",
      "GET /api/super/admin/companies/:id",
      "PATCH /api/super/admin/companies/:id/suspend",
      "GET /api/super/admin/audit",
    ],
    missing: [
      "GET /api/super/admin/plans",
      "PATCH /api/super/admin/plans/:id",
      "GET /api/super/admin/users",
      "GET /api/super/admin/support",
      "GET /api/super/admin/settings",
      "PATCH /api/super/admin/settings",
    ],
  };
}
