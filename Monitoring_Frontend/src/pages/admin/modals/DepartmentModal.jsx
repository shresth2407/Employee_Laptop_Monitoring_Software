import { useEffect, useState } from "react";
import { Building2, FileText, Hash } from "lucide-react";

export default function DepartmentModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [show, setShow] = useState(false); // 🔥 controls animation mount

  useEffect(() => {
    if (open) {
      setShow(true);

      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
      setCode(initialData?.code || "");
      setIsActive(
        typeof initialData?.isActive === "boolean"
          ? initialData.isActive
          : true
      );
    } else {
      // delay unmount for exit animation
      setTimeout(() => setShow(false), 200);
    }
  }, [open, initialData]);

  if (!open && !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description, code, isActive });
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200); // match animation duration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* BACKDROP */}
      <div
        onClick={handleClose}
        className={`
          absolute inset-0 backdrop-blur-sm
          transition-all duration-200
          ${open ? "bg-black/40 opacity-100" : "opacity-0"}
        `}
      />

      {/* MODAL */}
      <form
        onSubmit={handleSubmit}
        className={`
          relative w-full max-w-md
          bg-white/80 backdrop-blur-xl
          shadow-[0_25px_70px_rgba(0,0,0,0.2)]
          border border-slate-200/60
          p-6
          transition-all duration-300

          ${open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"}
        `}
        style={{ borderRadius: "12px" }}
      >
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-slate-800">
          {initialData ? "Update Department" : "Create Department"}
        </h2>

        {/* FIELDS (STAGGERED) */}
        <div className="mt-5 space-y-4">

          {/* NAME */}
          <div className="animate-[fadeSlide_0.4s_ease]">
            <label className="text-xs text-slate-500">Department Name</label>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 border border-slate-200 focus-within:border-indigo-500 transition">
              <Building2 size={14} className="text-slate-400" />
              <input
                autoFocus
                className="w-full text-sm outline-none bg-transparent"
                placeholder="Enter department name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* CODE */}
          <div className="animate-[fadeSlide_0.45s_ease]">
            <label className="text-xs text-slate-500">Department Code</label>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 border border-slate-200 focus-within:border-indigo-500 transition">
              <Hash size={14} className="text-slate-400" />
              <input
                className="w-full text-sm outline-none bg-transparent"
                placeholder="Optional code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="animate-[fadeSlide_0.5s_ease]">
            <label className="text-xs text-slate-500">Description</label>
            <div className="mt-1 flex gap-2 px-3 py-2 border border-slate-200 focus-within:border-indigo-500 transition">
              <FileText size={14} className="text-slate-400 mt-1" />
              <textarea
                className="w-full text-sm outline-none bg-transparent resize-none"
                rows={3}
                placeholder="Write something..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* TOGGLE */}
        <div className="mt-5 flex items-center justify-between animate-[fadeSlide_0.55s_ease]">
          <span className="text-sm text-slate-600">Active Department</span>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`
              relative w-10 h-5 flex items-center
              rounded-full transition-all duration-300
              ${isActive ? "bg-indigo-600" : "bg-slate-300"}
            `}
          >
            <span
              className={`
                h-4 w-4 bg-white rounded-full shadow
                transform transition-all duration-300 ease-out
                ${isActive ? "translate-x-5" : "translate-x-1"}
              `}
            />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex justify-end gap-3 animate-[fadeSlide_0.6s_ease]">
          <button
            type="button"
            onClick={handleClose}
            className="
              px-4 py-2 text-sm
              bg-slate-100 text-slate-600
              hover:bg-slate-200
              active:scale-95
              transition
            "
            style={{ borderRadius: "10px" }}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="
              px-4 py-2 text-sm text-white
              bg-indigo-600
              hover:bg-indigo-700
              shadow-md hover:shadow-lg
              active:scale-95
              transition-all duration-200
            "
            style={{ borderRadius: "10px" }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* KEYFRAMES */}
      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}