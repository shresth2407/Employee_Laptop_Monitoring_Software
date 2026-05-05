import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  Camera, 
  Clock, 
  Activity, 
  Save, 
  Settings as SettingsIcon,
  ShieldCheck 
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import LoadingCard from "../../components/ui/LoadingCard";
import { getSettings, updateSettings } from "../../services/settingsService";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    screenshotIntervalMinutes: 5,
    idleThresholdMinutes: 5,
    heartbeatIntervalSeconds: 30,
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      const data = res?.data?.data || res?.data || {};

      setForm({
        screenshotIntervalMinutes: data?.screenshotIntervalMinutes ?? 5,
        idleThresholdMinutes: data?.idleThresholdMinutes ?? 5,
        heartbeatIntervalSeconds: data?.heartbeatIntervalSeconds ?? 30,
      });
    } catch (err) {
      console.error("Settings fetch failed:", err);
      toast.error(err?.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        screenshotIntervalMinutes: Number(form.screenshotIntervalMinutes),
        idleThresholdMinutes: Number(form.idleThresholdMinutes),
        heartbeatIntervalSeconds: Number(form.heartbeatIntervalSeconds),
      };

      const res = await updateSettings(payload);
      if (!res?.data?.success && !res?.success) throw new Error("Update failed");

      toast.success("Settings updated successfully");
      await fetchSettings();
    } catch (err) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Settings" subtitle="Configure system-wide monitoring behavior" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
          {[1, 2, 3].map((i) => <LoadingCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <PageHeader 
        title="Settings" 
        subtitle="Manage global application parameters and agent behavior."
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Main Configuration Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800">Monitoring Core</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Field 1 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Camera className="h-4 w-4 text-slate-400" />
                  Screenshot Interval
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    name="screenshotIntervalMinutes"
                    value={form.screenshotIntervalMinutes}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">min</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">Frequency of visual activity captures.</p>
              </div>

              {/* Field 2 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Idle Threshold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    name="idleThresholdMinutes"
                    value={form.idleThresholdMinutes}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">min</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">Inactivity time before tagging as Idle.</p>
              </div>

              {/* Field 3 */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Activity className="h-4 w-4 text-slate-400" />
                  Heartbeat Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    name="heartbeatIntervalSeconds"
                    value={form.heartbeatIntervalSeconds}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">sec</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">Sync frequency between agent and server.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-4 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100">
          <ShieldCheck className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-indigo-900">Current Live Policy</h3>
            <p className="mt-1 text-sm text-indigo-700/80">
              The agent will capture a screenshot every <span className="font-bold">{form.screenshotIntervalMinutes}m</span> and 
              verify connectivity every <span className="font-bold">{form.heartbeatIntervalSeconds}s</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500 italic">Changes will apply to all active agents on their next heartbeat.</p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving Changes..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}