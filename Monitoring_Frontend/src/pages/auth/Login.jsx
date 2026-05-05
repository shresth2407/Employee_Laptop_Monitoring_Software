import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe,
  Cpu,
  Fingerprint
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const { accessToken, user } = res.data?.data || {};
      if (!accessToken || !user) throw new Error("Invalid response");

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      const routes = {
        EMPLOYEE: "/employee/dashboard",
        MANAGER: "/manager/dashboard",
        ADMIN: "/admin/dashboard",
      };

      navigate(routes[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Protocol Denied: Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed to min-h-screen to prevent mobile keyboard layout breakage
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      
      {/* Background Subtle Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Card - Reduced max-width and border-radius for compactness */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/50 relative z-10 overflow-hidden">

        {/* --- Left Side: Brand & Security Intel --- */}
        <div className="hidden md:flex md:col-span-2 bg-slate-50 p-8 lg:p-10 flex-col justify-between relative border-r border-slate-100">

          {/* Animated Scanning Line Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-0.5 bg-emerald-500 absolute top-0 animate-[scan_3s_linear_infinite]" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-900/20 mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Shield size={24} strokeWidth={2} />
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-8">
              Secure <span className="text-emerald-500">Access</span>
            </h1>

            <div className="space-y-3">
              {[
                { label: "Global Network", val: "Verified Connection", icon: <Globe size={16} /> },
                { label: "Identity Hash", val: "Hardware Key", icon: <Fingerprint size={16} /> },
                { label: "Core Protocol", val: "v4.0.2 Stable", icon: <Cpu size={16} /> }
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-slate-700">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Systems Operational
              </p>
            </div>
          </div>
        </div>

        {/* --- Right Side: Login Form --- */}
        <div className="col-span-1 md:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative">
          <div className="max-w-sm w-full mx-auto animate-in fade-in slide-in-from-right-4 duration-500">

            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Authentication</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                <p className="text-slate-500 text-xs font-medium">Personnel verification required</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 animate-in slide-in-from-top-2">
                  <div className="w-1.5 h-1.5 mt-1.5 bg-rose-500 rounded-full animate-pulse shrink-0" />
                  <p className="text-xs font-semibold text-rose-700 leading-tight">
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-slate-600 ml-1 transition-colors group-focus-within:text-emerald-600">Email Identifier</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="user@enterprise.sh"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-slate-600 ml-1 transition-colors group-focus-within:text-emerald-600">Security Key</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed bg-slate-900 hover:bg-emerald-600 shadow-md shadow-slate-900/20 hover:shadow-emerald-500/30 group"
              >
                {loading ? (
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  </div>
                ) : (
                  <>
                    Grant Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Identity Shield
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                ISO-27001
              </span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default Login;