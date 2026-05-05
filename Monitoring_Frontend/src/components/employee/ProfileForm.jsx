import { useState, useEffect } from "react";
import api from "../../services/api";
import { User, Mail, Building2, Save, Loader2, CheckCircle2 } from "lucide-react";

const ProfileForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "" // Isme sirf string (Name) rakhenge
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/profile");
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        // 🔥 FIX: Check if department is object (populated) or just an ID string
        department: res.data.department?.name || (typeof res.data.department === 'string' ? "Loading..." : "Not Assigned")
      });
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      // ✅ Update only editable fields (Name & Email)
      await api.put("/employee/profile", { 
        name: form.name, 
        email: form.email 
      });
      setStatus('success');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("Profile Update Error:", error);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Accessing Profile Data</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        
        {/* Full Name */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Legal Identity</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
              <User size={16} strokeWidth={2} />
            </div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-sm font-medium text-zinc-900"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Corporate Node</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
              <Mail size={16} strokeWidth={2} />
            </div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none transition-all text-sm font-medium text-zinc-900"
              required
            />
          </div>
        </div>

        {/* ✅ Organizational Sector (Fixed Display) */}
        <div className="space-y-3 md:col-span-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Organizational Sector</label>
          <div className="relative group opacity-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300">
              <Building2 size={16} strokeWidth={2} />
            </div>
            <input
              name="department"
              value={form.department}
              readOnly // Fixed value as per company records
              className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-2xl outline-none text-sm font-bold text-zinc-500 cursor-not-allowed"
              placeholder="Department Name"
            />
          </div>
          <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider ml-1 mt-2">
            * Information managed by Administrative Protocol.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Profile Synchronized</span>
            </div>
          )}
          {status === 'error' && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Update Failed</span>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-3 px-10 py-4 bg-zinc-900 text-white rounded-2xl text-[11px] font-bold uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-zinc-400"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Commit Changes</>}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;