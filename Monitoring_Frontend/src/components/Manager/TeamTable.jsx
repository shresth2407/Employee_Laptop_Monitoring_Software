import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  MoreHorizontal, 
  Clock, 
  Fingerprint, 
  Mail,
  ArrowRight,
  User
} from "lucide-react";

const TeamTable = ({ team = [] }) => {
  const navigate = useNavigate();

  // Helper to format the Last Login date beautifully
  const formatLastActive = (dateString) => {
    if (!dateString) return "Never logged in";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to safely extract avatar image
  const getAvatar = (emp) => {
    return emp.profilePhoto?.url || emp.profilePhotoUrl || null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* ================= TABLE HEADER ================= */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Personnel Fleet
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Active directory overview
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-white text-slate-600 rounded-md border border-slate-200 shadow-sm">
          {team.length} Members
        </span>
      </div>

      {/* ================= TABLE CONTENT ================= */}
      <div className="w-full overflow-x-auto flex-1">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-white text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Identity (ID)</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.length > 0 ? (
              team.map((emp) => (
                <tr 
                  key={emp._id} 
                  onClick={() => navigate(`/manager/employee/${emp._id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  
                  {/* Avatar & Name/Email Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-emerald-200 transition-colors">
                        {getAvatar(emp) ? (
                          <img 
                            src={getAvatar(emp)} 
                            alt={emp.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <span className="text-slate-500 font-bold text-xs group-hover:text-emerald-600 transition-colors">
                            {emp.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {emp.name}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={10} className="text-slate-400" />
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      <Fingerprint size={12} className="text-slate-400" />
                      {emp.employeeId}
                    </div>
                  </td>

                  {/* Last Login Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <Clock size={14} className="text-slate-400" />
                      {formatLastActive(emp.lastLoginAt)}
                    </div>
                  </td>

                  {/* Status Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {emp.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> 
                        Inactive
                      </span>
                    )}
                  </td>
</tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users size={32} className="text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-600">No personnel found</p>
                    <p className="text-xs text-slate-400 mt-1">Your team directory is currently empty.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTable;