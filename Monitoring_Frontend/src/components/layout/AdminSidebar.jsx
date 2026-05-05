import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  LayoutDashboard,
  Users,
  Monitor,
  Image as ImageIcon,
  FileText,
  Building2,
  Network,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast"; // Optional: for feedback

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Employees", path: "/admin/employees", icon: Users },
  { label: "Monitoring", path: "/admin/monitoring", icon: Monitor },
  { label: "Screenshots", path: "/admin/screenshots", icon: ImageIcon },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Departments", path: "/admin/departments", icon: Building2 },
  { label: "Team Mappings", path: "/admin/team-mappings", icon: Network },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      // 1. Trigger the logout from context (clears state/localStorage)
      await logout(); 
      
      // 2. Clear any lingering session items manually if needed
      localStorage.clear(); 
      sessionStorage.clear();

      // 3. Show success message
      toast.success("Logged out successfully");

      // 4. Redirect to login and replace history so they can't go back
      navigate("/login", { replace: true }); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Error logging out");
    }
  };

  const getLinkStyles = (isActive) => {
    const base = "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out";
    const active = "bg-slate-900 text-white shadow-lg shadow-slate-200";
    const inactive = "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1";
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <>
      {/* MOBILE TRIGGER */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex h-24 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-inner">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Admin Panel</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Monitoring</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-900 lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* NAV SECTION */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
          <ul className="space-y-1.5">
            {navItems.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => getLinkStyles(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="absolute left-0 h-5 w-1 rounded-r-full bg-white transition-all" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* FOOTER / USER SECTION */}
        <div className="border-t border-slate-100 p-4 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {user?.name || "Administrator"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "admin@system.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout} // Changed to handleLogout
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}