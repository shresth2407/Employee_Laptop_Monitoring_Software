import { useEffect, useState } from "react";
import ProfileForm from "../../components/employee/ProfileForm";
import { getProfile } from "../../services/employeeService";
import api from "../../services/api";
import {
  User, Camera, ShieldCheck, Mail, Briefcase,
  Globe, Zap, CheckCircle2, Building2, Hash, Loader2,
  Activity, ShieldAlert, Award, Calendar, Fingerprint
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await api.put("/employee/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data) setUser(res.data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-[3px] border-zinc-100 border-t-emerald-500 rounded-full animate-spin" />
            <Fingerprint className="absolute text-emerald-500 animate-pulse" size={28} />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-1">Authenticating</p>
            <div className="h-1 w-24 bg-zinc-100 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-emerald-500 w-1/2 animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Actual API Data Mapping
  const profileImage = user?.profilePhoto?.url || user?.avatar;
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : "N/A";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-700">

      {/* --- Header Section --- */}
      <header className="relative mb-6 group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-[2rem] -z-10 transition-opacity group-hover:opacity-100" />

        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 p-1">
          {/* Avatar Container */}
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-xl shadow-emerald-900/5 ring-1 ring-zinc-200 overflow-hidden transition-all duration-500 group-hover/avatar:rounded-[1.5rem] group-hover/avatar:ring-emerald-500">
              <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-zinc-50 relative group-hover/avatar:rounded-[1.2rem] transition-all duration-500">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <User size={48} strokeWidth={1} />
                  </div>
                )}

                <label htmlFor="avatarUpload" className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300">
                  {uploading ? <Loader2 size={18} className="animate-spin mb-1" /> : <Camera size={18} className="mb-1" />}
                  <span className="text-[8px] font-black uppercase tracking-tighter">Modify</span>
                </label>
                <input id="avatarUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
            {/* Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 p-2 rounded-xl shadow-lg ring-2 ring-white ${user?.isActive ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
              <ShieldCheck size={16} />
            </div>
          </div>

          {/* User Bio Brief */}
          <div className="flex-1 text-center lg:text-left pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full mb-3">
              <span className={`flex h-1.5 w-1.5 rounded-full ${user?.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
              <span className="text-[9px] font-bold text-zinc-100 uppercase tracking-widest leading-none">
                Status: {user?.isActive ? 'Operational' : 'Offline'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase mb-1">
              {user?.name || "Node_Alpha"}
            </h1>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-zinc-500">
              <div className="flex items-center gap-1.5 group/item cursor-default">
                <Briefcase size={14} className="group-hover/item:text-emerald-500 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-tight text-zinc-800">{user?.role || "Employee"}</span>
              </div>
              <div className="flex items-center gap-1.5 group/item cursor-default">
                <Building2 size={14} className="group-hover/item:text-emerald-500 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-tight text-zinc-800">{user?.department?.name || "Unassigned"}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden xl:flex gap-3 pb-2">
            <div className="px-4 py-2 rounded-2xl bg-white border border-zinc-100 shadow-sm text-center">
              <p className="text-[8px] font-black text-zinc-400 uppercase mb-0.5 tracking-widest">Dept Code</p>
              <p className="text-lg font-black text-zinc-900">{user?.department?.code || "---"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Metadata & Security Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[2rem] p-6 border border-zinc-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Activity size={80} />
            </div>

            <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ShieldAlert size={14} className="text-emerald-500" />
              Security Clearance
            </h3>

            <div className="space-y-4">
              {[
                { label: "Neural Mail", val: user?.email, icon: <Mail size={12} /> },
                { label: "Employee ID", val: user?.employeeId, icon: <Hash size={12} /> },
                { label: "Access Tier", val: user?.role === "ADMIN" ? "Level 5 Admin" : "Level 1 Employee", icon: <Award size={12} /> },
                { label: "Member Since", val: joinDate, icon: <Calendar size={12} /> }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-xs font-black text-zinc-800 truncate">{item.val || "NOT_SET"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-900 uppercase">Identity Verified</span>
              </div>
              <div className="w-full bg-emerald-200/50 h-1 rounded-full overflow-hidden">
                <div className="w-full bg-emerald-500 h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Main Form Content */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30 overflow-hidden h-full flex flex-col group">


            {/* Form Content Area */}
            <div className="p-6 md:p-8 flex-1 bg-gradient-to-b from-white to-zinc-50/50">
              <div className="relative bg-white p-5 md:p-6 rounded-2xl border border-zinc-100 shadow-sm transition-all duration-500 group-hover:border-emerald-500/10">
                <ProfileForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;