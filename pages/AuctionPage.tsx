import React, { useState, useEffect } from 'react';
import { api } from '../services/api'; // Use real API
import { Auction, User } from '../types';
import { Gavel, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface AuctionPageProps {
  user: User;
}

const AuctionPage: React.FC<AuctionPageProps> = ({ user }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch real auctions from database
  const fetchAuctions = async () => {
    try {
      const data = await api.getAuctions();
      setAuctions(data);
    } catch (err) {
      console.error("Failed to load auctions", err);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (auctionId: string) => {
    const bidValue = bidAmounts[auctionId];
    if (!bidValue) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Please login to bid");

      await api.placeBid(auctionId, bidValue, token);

      setMessage({ type: 'success', text: `Successfully placed a bid of $${bidValue}!` });
      fetchAuctions(); // Refresh data
      setBidAmounts({ ...bidAmounts, [auctionId]: 0 });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Bid failed' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Live Auctions</h1>
          <p className="text-slate-600">Secure bidding platform.</p>
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <TrendingUp /> : <AlertCircle />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {auctions.map(auction => (
          <div key={auction.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 relative">
              <img 
                src={`https://picsum.photos/seed/${auction.id}/400/500`} 
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} /> Live Auction
              </div>
            </div>
            
            <div className="md:w-3/5 p-8 flex flex-col">
              <div className="mb-6 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{auction.title}</h3>
                <p className="text-slate-600 line-clamp-3 leading-relaxed">{auction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Current Bid</p>
                  <p className="text-2xl font-black text-indigo-600">${Number(auction.currentBid || 0).toLocaleString()}</p>
                </div>
                {/* Note: Real backend might not return highest bidder name for privacy, check your API response */}
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmounts[auction.id] || ''}
                    onChange={(e) => setBidAmounts({ ...bidAmounts, [auction.id]: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-bold"
                  />
                </div>
                <button
                  onClick={() => handlePlaceBid(auction.id)}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <Gavel size={20} /> Place Proxy Bid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionPage;