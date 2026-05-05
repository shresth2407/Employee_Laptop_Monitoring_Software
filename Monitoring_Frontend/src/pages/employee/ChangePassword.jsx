import { useState, useMemo } from "react";
import { changePassword } from "../../services/employeeService";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  KeyRound,
  Fingerprint,
  XCircle,
  Activity
} from "lucide-react";

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= DYNAMIC VALIDATION LOGIC =================
  const validations = useMemo(() => {
    const pw = form.newPassword;
    return {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
  }, [form.newPassword]);

  const strengthScore = Object.values(validations).filter(Boolean).length;
  
  // Dynamic labels and colors for the left panel
  let strengthLabel = "Awaiting Input";
  let strengthColor = "bg-zinc-200";
  let textColor = "text-zinc-400";

  if (form.newPassword.length > 0) {
    if (strengthScore <= 1) {
      strengthLabel = "Weak";
      strengthColor = "bg-rose-500";
      textColor = "text-rose-500";
    } else if (strengthScore === 2) {
      strengthLabel = "Fair";
      strengthColor = "bg-amber-400";
      textColor = "text-amber-500";
    } else if (strengthScore === 3) {
      strengthLabel = "Good";
      strengthColor = "bg-blue-500";
      textColor = "text-blue-500";
    } else if (strengthScore === 4) {
      strengthLabel = "Strong";
      strengthColor = "bg-emerald-500";
      textColor = "text-emerald-500";
    }
  }

  const isFormValid = strengthScore === 4 && form.oldPassword.length > 0;

  // ================= SUBMIT HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setSuccess(false);
    setError("");
    
    try {
      await changePassword(form);
      setSuccess(true);
      setForm({ oldPassword: "", newPassword: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
      
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch">
        
        {/* ================= LEFT SIDE: STATIC INTEL & LIVE ANALYSIS ================= */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between p-10 bg-zinc-50 border border-zinc-200/60 rounded-[3rem] relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Terminal</span>
            </div>

            <h2 className="text-3xl font-black tracking-tighter uppercase mb-4 text-zinc-900 leading-tight">
              Password <br /> <span className="text-emerald-500">Protection</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
              Regularly updating your security key prevents unauthorized access to your system identity.
            </p>

            {/* LIVE ANALYSIS DASHBOARD */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm space-y-5">
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity size={14} className={form.newPassword.length > 0 ? "text-emerald-500 animate-pulse" : "text-zinc-400"} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Analysis</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${textColor}`}>
                  {strengthLabel}
                </span>
              </div>

              {/* Visual Strength Meter */}
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      form.newPassword.length > 0 && strengthScore >= level 
                        ? strengthColor 
                        : 'bg-zinc-100'
                    }`} 
                  />
                ))}
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-50">
                <div className="flex items-center gap-3">
                  {validations.length ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-zinc-300" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${validations.length ? 'text-zinc-800' : 'text-zinc-400'}`}>8+ Characters</span>
                </div>
                <div className="flex items-center gap-3">
                  {validations.uppercase ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-zinc-300" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${validations.uppercase ? 'text-zinc-800' : 'text-zinc-400'}`}>Uppercase Letter</span>
                </div>
                <div className="flex items-center gap-3">
                  {validations.number ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-zinc-300" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${validations.number ? 'text-zinc-800' : 'text-zinc-400'}`}>Numeric Digit</span>
                </div>
                <div className="flex items-center gap-3">
                  {validations.special ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-zinc-300" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${validations.special ? 'text-zinc-800' : 'text-zinc-400'}`}>Special Character</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 opacity-60">
            <Fingerprint size={24} className="text-zinc-400" />
            <p className="text-[8px] font-mono text-zinc-500 uppercase leading-tight">
              Hardware Bound <br /> Identity Verified
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: THE FORM ================= */}
        <div className="col-span-1 lg:col-span-6 bg-white rounded-[3rem] border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden flex flex-col relative z-10">
          
          {/* Status Banners */}
          {success && (
            <div className="bg-emerald-500 px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-500">
              <CheckCircle2 size={16} className="text-white" />
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Key Updated Successfully</p>
            </div>
          )}
          {error && (
            <div className="bg-rose-500 px-8 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-300 text-white">
              <ShieldAlert size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="p-8 md:p-14 flex-1">
            <div className="mb-10 text-center lg:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 mx-auto lg:mx-0 shadow-sm">
                <KeyRound size={24} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Rotate Credentials</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Update your system access key</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto lg:mx-0">
              
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Current Key</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-xs font-bold text-zinc-700 placeholder:text-zinc-300"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500"
                  >
                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">New Key</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors">
                    <Zap size={16} />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-xs font-bold text-zinc-700 placeholder:text-zinc-300"
                    placeholder="Create new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Mobile-only fallback message just in case the left panel is hidden */}
                <div className="lg:hidden mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between px-1">
                  <span>Strength: {strengthLabel}</span>
                  <span className={textColor}>
                    {strengthScore}/4 Met
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`group w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 ${
                  loading || !isFormValid
                    ? "bg-zinc-300 cursor-not-allowed shadow-none" 
                    : "bg-zinc-900 hover:bg-emerald-600 shadow-lg shadow-zinc-900/10 hover:shadow-emerald-500/20"
                }`}
              >
                {loading ? "Syncing..." : (
                  <>
                    Confirm Rotation <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;