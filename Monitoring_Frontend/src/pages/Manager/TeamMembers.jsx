import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Network,
  Loader2,
  Briefcase,
  Fingerprint
} from "lucide-react";

import { getMappingsByTeamLead } from "../../services/teamMappingService";
import TeamMappingGraph from "../admin/TeamMappingGraph";
import { useAuth } from "../../context/AuthContext";

const TeamMembers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [teamLead, setTeamLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TEAM ================= */
  useEffect(() => {
    if (!user?._id) return;
    fetchTeam();
  }, [user]);

  const fetchTeam = async () => {
    try {
      setLoading(true);

      const res = await getMappingsByTeamLead(user._id);
      const data = res.data?.data || [];

      // ✅ Extract employees for table
      const employees = data.map((item) => item.employee);
      setTeam(employees);

      // ✅ Full mappings for graph
      setMappings(data);

      // ✅ Team Lead from API
      setTeamLead(
        data[0]?.teamLead || {
          _id: user._id,
          name: user.name,
          employeeId: user.employeeId,
        }
      );

    } catch (err) {
      console.error("❌ Failed to fetch team:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const filteredTeam = team.filter((emp) =>
    emp?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMappings = mappings.filter((m) =>
    m.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Network size={14} /> Organization Chart
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Team Structure
          </h1>
        </div>

        <div className="relative group">
          <Search 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
            size={16} 
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 w-full sm:w-64 shadow-sm transition-all"
          />
        </div>
      </header>

      {/* ================= GRAPH ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Visual Hierarchy
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Interactive Map
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 shadow-sm">
            {filteredMappings.length} Nodes Found
          </span>
        </div>

        <div className="relative bg-[#fafafa]">
          {loading && team.length === 0 ? (
            <div className="h-[450px] flex flex-col items-center justify-center space-y-4">
              <Loader2 size={32} className="text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-500 animate-pulse">
                Mapping team structure...
              </p>
            </div>
          ) : mappings.length === 0 ? (
            <div className="h-[450px] flex flex-col items-center justify-center space-y-3">
              <Users size={28} className="text-slate-400" />
              <p className="text-base font-bold text-slate-700">
                No Team Members Found
              </p>
            </div>
          ) : filteredMappings.length === 0 ? (
            <div className="h-[450px] flex flex-col items-center justify-center space-y-3">
              <Search size={28} className="text-slate-400" />
              <p className="text-base font-bold text-slate-700">
                No Matches Found
              </p>
            </div>
          ) : (
            <div className="h-[450px] w-full p-2 animate-in fade-in duration-500">
              <TeamMappingGraph
                teamLead={teamLead}
                mappings={filteredMappings}
                onRemove={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            Team Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Click a member to view full analytics
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <tbody className="divide-y divide-slate-100">
              {loading && team.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Loading directory...
                  </td>
                </tr>
              ) : filteredTeam.map((emp) => (
                <tr
                  key={emp._id}
                  onClick={() => navigate(`/manager/employee/${emp._id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                        {emp.profilePhotoUrl || emp.profilePhoto?.url ? (
                          <img
                            src={emp.profilePhotoUrl || emp.profilePhoto?.url}
                            alt={emp.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-indigo-600 font-bold text-xs">
                            {emp.name?.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <Fingerprint size={14} />
                      {emp.employeeId}
                    </span>
                  </td>

                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} />
                      {emp.department?.name || "Unassigned"}
                    </span>
                  </td>

                  <td className="px-6 py-3.5">
                    <span className="px-2 py-1 text-xs bg-slate-100 rounded">
                      {emp.role}
                    </span>
                  </td>

                  <td className="px-6 py-3.5 text-right">
                    {emp.isActive !== false ? (
                      <span className="text-emerald-600 font-bold text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold text-xs">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;