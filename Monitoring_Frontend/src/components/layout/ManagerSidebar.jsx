import { useState, useEffect } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart2, LogOut, ShieldCheck,
  KeyRound, UserCircle, BarChart3, Menu, X, Activity
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ManagerSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  // Mobile sidebar close on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, user]);

  const managerMenu = [
    { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Team Members", path: "/manager/team", icon: Users },
    { name: "Reports", path: "/manager/reports", icon: BarChart2 },
  ];

  const employeeMenu = [
    { name: "My Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "Work Session", path: "/employee/session", icon: Activity },
    { name: "Statistics", path: "/employee/stats", icon: BarChart3 },
    { name: "Profile", path: "/employee/profile", icon: UserCircle },
    { name: "Security", path: "/employee/change-password", icon: KeyRound},
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const renderMenu = (menu) =>
    menu.map((item) => {
      const Icon = item.icon;
      // Exact match for dashboard to prevent highlighting multiple items, startsWith for others
      const isActive = item.path === "/manager/dashboard" || item.path === "/employee/dashboard" 
        ? pathname === item.path 
        : pathname.startsWith(item.path);

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsOpen(false)}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isActive 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
          }`}
        >
          <Icon 
            size={18} 
            className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`} 
          />
          <span className="text-sm font-medium">{item.name}</span>
        </Link>
      );
    });

  // Fallback if Context is slow
  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      {/* ================= MOBILE TOGGLE BUTTON ================= */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[90] p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={20} />
      </button>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-slate-950 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out
        md:sticky md:top-0 md:h-screen md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      `}>

        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-inner shadow-white/20">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Intelligence
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          
          {currentUser?.role === "MANAGER" && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                Manager Tools
              </p>
              <div className="space-y-1">{renderMenu(managerMenu)}</div>
            </div>
          )}

          {currentUser && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                Personal Workspace
              </p>
              <div className="space-y-1">{renderMenu(employeeMenu)}</div>
            </div>
          )}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-slate-800/60 shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {currentUser?.name || 'Command Center'}
              </p>
              <p className="text-xs font-medium text-slate-400 truncate capitalize">
                {currentUser?.role?.toLowerCase() || 'System'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Optional: Custom scrollbar styles for the sidebar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #475569; }
      `}} />
    </>
  );
};

export default ManagerSidebar;