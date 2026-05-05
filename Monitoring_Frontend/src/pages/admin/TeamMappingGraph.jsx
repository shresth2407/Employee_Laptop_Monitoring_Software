import React, { useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { useLocation } from "react-router-dom";

/* 🔥 CUSTOM NODE */
const EmployeeNode = ({ data }) => {
  return (
    <div className="group relative w-52 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-3">
      {/* TOP BADGE */}
      <div className="absolute -top-2 left-3 px-2 py-0.5 text-[10px] rounded bg-indigo-600 text-white font-semibold tracking-wide">
        {data.type}
      </div>

      {/* AVATAR */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner">
          {data.name?.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800 truncate" title={data.name}>
            {data.name}
          </p>
          <p className="text-xs font-medium text-slate-500">
            {data.employeeId}
          </p>
        </div>
      </div>

      {/* ACTION */}
      {data.onRemove && (
        <button
          onClick={data.onRemove}
          className="mt-3 w-full rounded-md py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-100"
        >
          Remove Member
        </button>
      )}

      {/* CONNECTION HANDLES */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-indigo-400 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-indigo-400 !border-white" />
    </div>
  );
};

const nodeTypes = {
  employeeNode: EmployeeNode,
};

export default function TeamMappingGraph({
  teamLead,
  mappings,
  onRemove,
}) {
  const location = useLocation();

  // ✅ true if URL contains /manager
  const isManagerView = location.pathname.startsWith("/manager");

  const { nodes, edges } = useMemo(() => {
    if (!teamLead) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    // 🔥 TEAM LEAD NODE (CENTERED)
    nodes.push({
      id: teamLead._id,
      type: "employeeNode",
      position: { x: 300, y: 0 },
      data: {
        name: teamLead.name,
        employeeId: teamLead.employeeId,
        type: "TEAM LEAD",
      },
    });

    // 🔥 EMPLOYEES
    mappings.forEach((m, i) => {
      const emp = m.employee;

      nodes.push({
        id: emp._id,
        type: "employeeNode",
        position: {
          x: i * 260,
          y: 160,
        },
        data: {
          name: emp.name,
          employeeId: emp.employeeId,
          type: "EMPLOYEE",
          // ✅ only allow remove if NOT manager
          onRemove: !isManagerView ? () => onRemove(m._id) : null,
        },
      });

      edges.push({
        id: `${teamLead._id}-${emp._id}`,
        source: teamLead._id,
        target: emp._id,
        type: "smoothstep",
        animated: true,
        style: {
          strokeWidth: 2,
          stroke: "#cbd5e1", // Subtle slate color for edges
        },
      });
    });

    return { nodes, edges };
  }, [teamLead, mappings, onRemove, isManagerView]);

  return (
    <div className="h-full min-h-[420px] w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }} // Adds a bit of padding so nodes don't touch edges
      >
        {/* 🔥 COMPACT MINIMAP */}
        <MiniMap
          nodeColor={() => "#818cf8"} // Lighter indigo for minimap nodes
          maskColor="rgba(248, 250, 252, 0.7)" // Slate-50 with opacity
          style={{ width: 120, height: 80 }} // Made it much smaller
          className="!rounded-lg !border !border-slate-200 !shadow-sm !overflow-hidden !m-4"
        />

        {/* 🔥 CONTROLS */}
        <Controls 
          className="!bg-white !border-slate-200 !rounded-lg !shadow-sm !m-4 flex flex-col overflow-hidden" 
          showInteractive={false} // Hides the lock icon which is rarely used
        />

        {/* 🔥 GRID BACKGROUND */}
        <Background gap={20} size={1} color="#e2e8f0" />
      </ReactFlow>
    </div>
  );
}