import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";


export default function AdminLayout() {

  return (
    <div className="min-h-screen bg-slate-50">
      
      <AdminSidebar />
      <div className="flex flex-col min-h-screen transition-all duration-300 lg:ml-72">
        {/* SCROLLABLE AREA */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}