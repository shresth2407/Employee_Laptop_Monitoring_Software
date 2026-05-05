import ManagerSidebar from "./ManagerSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManagerLayout = () => {
  const { user } = useAuth();

  return (
    // Synced background to slate-50 and added custom text selection color
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-900">
      
      {/* Sidebar handles its own mobile/desktop states */}
      <ManagerSidebar key={user?._id || user?.id || 'guest'} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Added pt-20 on mobile to prevent content from hiding under the fixed hamburger menu */}
        <main className="p-4 pt-20 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto flex-1">
          
          {/* Unified page transition wrapper */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <Outlet />
          </div>
          
        </main>
      </div>

      {/* Optional: Add the same custom scrollbar for the main window if you haven't defined it globally */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
};

export default ManagerLayout;