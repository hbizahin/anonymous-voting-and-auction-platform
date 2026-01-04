import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Election, User, VoteReceipt } from '../types';
import { CheckCircle, AlertTriangle, ShieldCheck, Fingerprint, Vote as VoteIcon } from 'lucide-react';

interface VoteProps {
  user: User;
}

const Vote: React.FC<VoteProps> = ({ user }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [receipt, setReceipt] = useState<VoteReceipt | null>(null);
  const [error, setError] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);

  // Fetch elections from the real backend on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await api.getElections();
        setElections(data);
      } catch (err) {
        console.error("Failed to load elections:", err);
      }
    };
    fetchElections();
  }, []);

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate) return;
    
    setIsVoting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Call the real API
      const result = await api.vote(
        { 
          election_id: selectedElection.id, 
          candidate_id: selectedCandidate 
        }, 
        token
      );
      
      // Construct the receipt object from API response
      const newReceipt: VoteReceipt = {
        voteId: result.voteId,
        receiptCode: result.receiptCode,
        timestamp: new Date().toISOString(),
        // Add other fields if your VoteReceipt type requires them, 
        // e.g., electionId: selectedElection.id, candidateId: selectedCandidate
      } as VoteReceipt; // Casting to fit the shared type definition if needed

      setReceipt(newReceipt);
      setSelectedElection(null);
      setSelectedCandidate('');
    } catch (err: any) {
      // Display error message from backend (e.g., "already voted")
      setError(err.message || 'Voting failed. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  if (receipt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Vote Successfully Cast!</h2>
          <p className="text-slate-600 mb-8">Your identity remains anonymous. Save your receipt code for verification.</p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 mb-8 font-mono text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-slate-500 text-sm">Receipt ID</span>
              <span className="font-bold text-slate-800">{receipt.voteId}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-slate-500 text-sm">Verification Hash</span>
              <span className="font-bold text-indigo-600 text-xs sm:text-sm">{receipt.receiptCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Timestamp</span>
              <span className="text-slate-700 text-sm">{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setReceipt(null)}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Return to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Election List */}
        <div className="md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> Active Elections
          </h2>
          {elections.length === 0 && (
             <p className="text-slate-500 italic">No active elections found.</p>
          )}
          {elections.map(election => (
            <button
              key={election.id}
              onClick={() => { setSelectedElection(election); setSelectedCandidate(''); setError(''); }}
              className={`w-full text-left p-6 rounded-2xl border transition-all ${
                selectedElection?.id === election.id 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-bold text-lg mb-1">{election.title}</h3>
              <p className={`text-sm ${selectedElection?.id === election.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                Ends {new Date(election.endTime).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* Voting Interface */}
        <div className="md:w-2/3">
          {selectedElection ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedElection.title}</h2>
                <p className="text-slate-600 leading-relaxed">{selectedElection.description}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
                  <AlertTriangle size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <p className="font-semibold text-slate-700 mb-2 uppercase tracking-wider text-sm">Select one candidate</p>
                {/* Ensure candidates exist before mapping to prevent crashes if backend data is incomplete */}
                {selectedElection.candidates && selectedElection.candidates.length > 0 ? (
                  selectedElection.candidates.map(candidate => (
                    <label 
                      key={candidate.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCandidate === candidate.id 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="candidate" 
                        className="hidden" 
                        value={candidate.id}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        selectedCandidate === candidate.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {selectedCandidate === candidate.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-bold text-slate-800 text-lg">{candidate.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
                    No candidates found for this election.
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200 flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Fingerprint className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Security Verification</h4>
                  <p className="text-sm text-slate-600">Your vote is protected by 256-bit encryption. Your unique voter signature will be detached from your personal profile upon submission.</p>
                </div>
              </div>

              <button
                disabled={!selectedCandidate || isVoting}
                onClick={handleVote}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                  selectedCandidate && !isVoting
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isVoting ? 'Processing Secure Vote...' : 'Cast Anonymous Vote'}
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 p-12 text-center">
              <VoteIcon size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">Select an election from the list to view candidates and cast your vote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vote;