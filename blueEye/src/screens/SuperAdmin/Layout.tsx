import type React from "react";
import { Outlet } from "react-router-dom";
import {
  SuperAdminSidebar,
  SuperAdminTopbar,
} from "./components/shared";
import { useSuperAdminLayout } from "./hooks/useSuperAdminLayout";

export default function SuperAdminLayout(): React.ReactElement {
  const { navItems, page, time } = useSuperAdminLayout();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #ffffff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.35); border-radius: 99px; }
        .nav-item { cursor: pointer; transition: background-color 0.18s, border-color 0.18s, color 0.18s; text-decoration: none; }
        .nav-item:hover { background: rgba(14,165,233,0.08) !important; }
        .row-hover:hover { background: rgba(14,165,233,0.06) !important; cursor: pointer; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#ffffff" }}>
        <SuperAdminSidebar navItems={navItems} />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <SuperAdminTopbar title={page.title} subtitle={page.subtitle} time={time} />
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
