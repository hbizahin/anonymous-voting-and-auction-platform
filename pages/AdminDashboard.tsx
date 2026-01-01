
import React, { useState, useEffect } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Election, Auction } from '../types';
import { Settings, Plus, List, Database, ShieldAlert, Trash2, X, Info, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activeTab, setActiveTab] = useState<'elections' | 'auctions' | 'logs'>('elections');
  const [showElectionForm, setShowElectionForm] = useState(false);
  const [showAuctionForm, setShowAuctionForm] = useState(false);
  
  // Notification states
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [electionTitle, setElectionTitle] = useState('');
  const [electionDesc, setElectionDesc] = useState('');
  const [candidates, setCandidates] = useState(['', '']);

  const [auctionTitle, setAuctionTitle] = useState('');
  const [auctionDesc, setAuctionDesc] = useState('');
  const [startingBid, setStartingBid] = useState(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setElections(mockBackend.getElections());
    setAuctions(mockBackend.getAuctions());
  };

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredCandidates = candidates.filter(c => c.trim() !== '');
    
    if (!electionTitle || !electionDesc) {
      showStatus('Please provide a title and description.', 'error');
      return;
    }

    if (filteredCandidates.length < 2) {
      showStatus('At least 2 candidates are required to start a vote.', 'error');
      return;
    }

    try {
      mockBackend.createElection(electionTitle, electionDesc, filteredCandidates);
      refreshData();
      setShowElectionForm(false);
      setElectionTitle('');
      setElectionDesc('');
      setCandidates(['', '']);
      showStatus('Election launched successfully! Data saved to local DB.');
    } catch (err) {
      showStatus('Failed to launch election.', 'error');
    }
  };

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    if (auctionTitle && auctionDesc && startingBid > 0) {
      mockBackend.createAuction(auctionTitle, auctionDesc, startingBid);
      refreshData();
      setShowAuctionForm(false);
      setAuctionTitle('');
      setAuctionDesc('');
      setStartingBid(0);
      showStatus('Auction item listed! Bidding is now open.');
    } else {
      showStatus('Please fill all auction details correctly.', 'error');
    }
  };

  const handleDeleteElection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this election? All votes will be lost.')) {
      mockBackend.deleteElection(id);
      refreshData();
      showStatus('Election deleted.');
    }
  };

  const handleDeleteAuction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      mockBackend.deleteAuction(id);
      refreshData();
      showStatus('Auction deleted.');
    }
  };

  const handleResetDB = () => {
    if (window.confirm('Wipe all local data and reset to test defaults? This cannot be undone.')) {
      mockBackend.resetDatabase();
    }
  };

  const updateCandidate = (index: number, value: string) => {
    const newCands = [...candidates];
    newCands[index] = value;
    setCandidates(newCands);
  };

  const removeCandidateInput = (index: number) => {
    if (candidates.length > 2) {
      const newCands = candidates.filter((_, i) => i !== index);
      setCandidates(newCands);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Toast Notification */}
      {statusMsg && (
        <div className={`fixed top-20 right-8 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 ${
          statusMsg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span className="font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-200">
            <Settings size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Terminal</h1>
            <p className="text-slate-500 font-semibold flex items-center gap-2 mt-1">
              <span className="text-indigo-600">Authorized:</span> Hamza Bin Islam
            </p>
          </div>
        </div>
        <button 
          onClick={handleResetDB}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl transition-all font-bold text-sm"
        >
          <RefreshCw size={16} /> Reset Database
        </button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <TabButton 
          active={activeTab === 'elections'} 
          onClick={() => setActiveTab('elections')}
          icon={<List size={18} />}
          label="Polls & Voting"
        />
        <TabButton 
          active={activeTab === 'auctions'} 
          onClick={() => setActiveTab('auctions')}
          icon={<Database size={18} />}
          label="Market Auctions"
        />
        <TabButton 
          active={activeTab === 'logs'} 
          onClick={() => setActiveTab('logs')}
          icon={<ShieldAlert size={18} />}
          label="Audit Logs"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {activeTab === 'elections' && (
          <div className="p-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Election Suite</h2>
                <p className="text-slate-500 mt-1">Configure secure candidates and poll durations.</p>
              </div>
              {!showElectionForm && (
                <button 
                  onClick={() => setShowElectionForm(true)}
                  className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-0.5"
                >
                  <Plus size={20} /> Create New Election
                </button>
              )}
            </div>

            {showElectionForm && (
              <div className="mb-10 p-8 bg-slate-50 border border-slate-200 rounded-[1.5rem] relative animate-in slide-in-from-top-4">
                <button onClick={() => setShowElectionForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
                   <Info size={20}/> Election Definition Form
                </h3>
                <form onSubmit={handleCreateElection} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                      <input 
                        className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium" 
                        placeholder="Election Title (e.g. 2024 Tech Lead)" 
                        value={electionTitle}
                        onChange={e => setElectionTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                      <textarea 
                        className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 h-40 bg-white font-medium" 
                        placeholder="Detailed description for voters..." 
                        value={electionDesc}
                        onChange={e => setElectionDesc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nominated Candidates (Min 2)</p>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                      {candidates.map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            className="flex-grow p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
                            placeholder={`Candidate Name ${i + 1}`} 
                            value={c}
                            onChange={e => updateCandidate(i, e.target.value)}
                            required
                          />
                          {candidates.length > 2 && (
                            <button 
                              type="button"
                              onClick={() => removeCandidateInput(i)}
                              className="p-3 text-slate-300 hover:text-red-500"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setCandidates([...candidates, ''])}
                      className="text-sm text-indigo-600 font-black hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      + ADD ANOTHER NOMINEE
                    </button>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4">
                      LAUNCH SECURE POLL
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-widest">Active & Completed Polls</h3>
              {elections.map(election => (
                <div key={election.id} className="p-8 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all group">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{election.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Candidates: {election.candidates.length} • Status: <span className="text-green-600 font-bold uppercase tracking-tighter">{election.status}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDeleteElection(election.id)}
                      className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      title="Delete Election"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              ))}
              {elections.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold">No elections currently active. Launch one above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'auctions' && (
          <div className="p-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Marketplace Control</h2>
                <p className="text-slate-500 mt-1">List premium items and monitor global bidding.</p>
              </div>
              {!showAuctionForm && (
                <button 
                  onClick={() => setShowAuctionForm(true)}
                  className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5"
                >
                  <Plus size={20} /> Add New Asset
                </button>
              )}
            </div>

            {showAuctionForm && (
              <div className="mb-10 p-8 bg-slate-50 border border-slate-200 rounded-[1.5rem] relative animate-in slide-in-from-top-4">
                <button onClick={() => setShowAuctionForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
                <h3 className="text-xl font-bold mb-6 text-slate-800">New Auction Listing</h3>
                <form onSubmit={handleCreateAuction} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Item Name</label>
                      <input 
                        className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-500 bg-white" 
                        placeholder="Asset Title (e.g. 1954 Vintage Watch)" 
                        value={auctionTitle}
                        onChange={e => setAuctionTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Starting Bid</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input 
                          type="number"
                          className="w-full pl-8 pr-4 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-500 bg-white" 
                          placeholder="Floor Price" 
                          value={startingBid || ''}
                          onChange={e => setStartingBid(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Item Details</label>
                    <textarea 
                      className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-500 h-32 bg-white" 
                      placeholder="Full item condition and provenance details..." 
                      value={auctionDesc}
                      onChange={e => setAuctionDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-black transition-all">
                    LIST ASSET FOR LIVE BIDDING
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctions.map(auction => (
                <div key={auction.id} className="p-8 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{auction.title}</h3>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Auction Ref: {auction.id}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAuction(auction.id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase">Current Valuation</p>
                      <p className="text-3xl font-black text-indigo-600">${auction.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase">Deadline</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(auction.endTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-10">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Audit Integrity Log</h2>
            <div className="space-y-4 font-mono text-sm">
              <LogEntry time={new Date().toLocaleTimeString()} action="DATABASE" msg="Using Browser LocalStorage (No external MySQL server needed for this host)." />
              <LogEntry time={new Date().toLocaleTimeString()} action="SYNC" msg="Successfully mapped mock relational tables to local key-value pairs." />
              <LogEntry time={new Date().toLocaleTimeString()} action="AUTH_HAMZA" msg="SuperAdmin session established for Hamza Bin Islam." />
              <LogEntry time={new Date().toLocaleTimeString()} action="SECURITY" msg="Ready for local hosting and viva demonstration." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-[1.25rem] font-black transition-all whitespace-nowrap ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

const LogEntry: React.FC<{ time: string, action: string, msg: string }> = ({ time, action, msg }) => (
  <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl flex gap-6 overflow-x-auto border border-slate-800">
    <span className="text-slate-500 shrink-0 font-bold">{time}</span>
    <span className="text-indigo-400 font-black shrink-0">[{action}]</span>
    <span className="text-slate-100 min-w-[300px]">{msg}</span>
  </div>
);

export default AdminDashboard;
