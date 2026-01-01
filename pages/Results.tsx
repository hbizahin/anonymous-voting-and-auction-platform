import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { mockBackend } from "../services/mockBackend";
import { Election, Candidate } from "../types";
import { BarChart3, AlertCircle } from "lucide-react";

const COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#f97316", "#10b981"];

const Results: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");
  const [results, setResults] = useState<Candidate[]>([]);

  useEffect(() => {
    const data = mockBackend.getElections();
    setElections(data);
    if (data.length > 0) {
      setSelectedElectionId(data[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      const res = mockBackend.getResults(selectedElectionId);
      setResults(res);
    }
  }, [selectedElectionId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Live Election Results
        </h1>
        <p className="text-slate-600 text-lg">
          Real-time vote tallies from verified secure polling stations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Selector & Stats */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Select Election
            </label>
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 mb-8"
            >
              {elections.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>

            <div className="space-y-6">
              <h3 className="font-bold text-xl text-slate-900 border-b border-slate-100 pb-2">
                Summary
              </h3>
              {results.map((r, idx) => (
                <div key={r.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                    <span className="font-semibold text-slate-700">
                      {r.name}
                    </span>
                  </div>
                  <span className="font-black text-slate-900">
                    {r.votes} votes
                  </span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between">
                <span className="text-slate-500 font-bold">Total Cast</span>
                <span className="text-slate-900 font-bold">
                  {results.reduce((acc, curr) => acc + (curr.votes || 0), 0)}
                </span>
              </div>
            </div>

            <button
              disabled
              className="w-full mt-10 bg-slate-200 text-slate-500 py-4 rounded-2xl font-bold"
            >
              AI analysis disabled
            </button>
          </div>
        </div>

        {/* Right Panel: Visualization & AI Insights */}
        <div className="lg:w-2/3 space-y-8">
          {/* Chart Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" /> Voting Distribution
              </h2>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                    {results.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-400">
              AI analysis is disabled in this build.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
