
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users, ChevronRight, Gavel, BarChart, Database } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-80 h-80 bg-violet-50 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 border border-indigo-100">
              <Database size={14} /> Local-First Architecture Enabled
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Secure Democracy</span> & Fair Trade
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
              ElectraBid provides a cryptographically secure, anonymous voting platform and real-time high-stakes auctions. No server setup required for testing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/vote" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Launch Voting <ChevronRight className="ml-2" size={20} />
              </Link>
              <Link to="/auctions" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all">
                Enter Auctions <Gavel className="ml-2" size={20} />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-600" size={28} />}
              title="Anonymity Guaranteed"
              description="Votes are detached from user profiles and stored using cryptographic receipts. Total privacy for every voter."
            />
            <FeatureCard 
              icon={<Zap className="text-violet-600" size={28} />}
              title="Instant Real-Time"
              description="Bids and vote tallies update immediately. Built for high-speed engagement and fair competition."
            />
            <FeatureCard 
              icon={<Users className="text-pink-600" size={28} />}
              title="Verified Participants"
              description="Only authenticated users like Fouzia can participate. Roles are strictly enforced via JWT-style tokens."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Why no external database?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12">
            This platform uses <b>Local Persistence</b>. All data you create (elections, auctions, votes) is stored in your browser's private storage. 
            This makes it 100% functional for local hosting and testing without complex server installation.
          </p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-60">
            <span className="text-2xl font-bold">Node.js</span>
            <span className="text-2xl font-bold">React</span>
            <span className="text-2xl font-bold">LocalStorage DB</span>
            <span className="text-2xl font-bold">Socket Sim</span>
            <span className="text-2xl font-bold">JWT Security</span>
          </div>
        </div>
      </section>
      
      {/* Results CTA */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Transparent & Verifiable Results</h2>
            <p className="text-indigo-200 text-lg">Every vote generates a unique digital receipt. Verify your participation without compromising your privacy.</p>
          </div>
          <Link to="/results" className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
            <BarChart size={20} /> View Live Results
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 inline-block p-3 bg-slate-50 rounded-xl">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default Home;
