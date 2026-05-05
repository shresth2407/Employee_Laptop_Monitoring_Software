import { useEffect, useState } from "react";
import { User, Mail, Lock, BadgeCheck, Building2, IdCard, Camera, X, Loader2 } from "lucide-react";

export default function EmployeeModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
  departments = [],
}) {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    department: "",
    profilePhotoUrl: "",
  });

  useEffect(() => {
    if (open) {
      setShow(true);
      if (initialData) {
        setForm({
          employeeId: initialData?.employeeId || "",
          name: initialData?.name || "",
          email: initialData?.email || "",
          password: "",
          role: initialData?.role || "EMPLOYEE",
          department: initialData?.department?._id || "",
          profilePhotoUrl: initialData?.profilePhoto?.url || "",
        });
      } else {
        setForm({
          employeeId: "",
          name: "",
          email: "",
          password: "",
          role: "EMPLOYEE",
          department: "",
          profilePhotoUrl: "",
        });
      }
    } else {
      setTimeout(() => setShow(false), 200);
    }
  }, [open, initialData]);

  if (!open && !show) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePhotoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!initialData) {
      formData.append("employeeId", form.employeeId);
      formData.append("email", form.email);
      formData.append("password", form.password);
    }
    formData.append("name", form.name);
    formData.append("role", form.role.toUpperCase());
    formData.append("department", form.department || "");
    if (selectedFile) formData.append("profilePhoto", selectedFile);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* MODAL */}
      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? "Edit Profile" : "New Employee"}
            </h2>
            <p className="text-sm text-slate-500">Fill in the details to manage workforce.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            {/* PHOTO UPLOAD SECTION */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
                  {form.profilePhotoUrl ? (
                    <img src={form.profilePhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                <label className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all group-hover:scale-110 shadow-lg">
                  <Camera size={18} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Profile Photo</p>
            </div>

            {/* FORM FIELDS */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {!initialData && (
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   {/* EMPLOYEE ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">Employee ID</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                        placeholder="EMP-001"
                        required
                      />
                    </div>
                  </div>
                  {/* EMAIL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NAME */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {!initialData && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">Temporary Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {/* ROLE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1">Access Role</label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              {/* DEPARTMENT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none"
                    required
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Save Employee"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}