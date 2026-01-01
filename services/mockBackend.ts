
import { Election, Auction, User, VoteReceipt, Candidate } from '../types';

const INITIAL_ELECTIONS: Election[] = [
  {
    id: 'e1',
    title: 'Executive Board Election 2024',
    description: 'Electing the new steering committee for the regional development project.',
    startTime: '2024-01-01T00:00:00Z',
    endTime: '2024-12-31T23:59:59Z',
    status: 'active',
    candidates: [
      { id: 'c1', name: 'Dr. Sarah Jenkins' },
      { id: 'c2', name: 'Mark Thompson' },
      { id: 'c3', name: 'Elena Rodriguez' }
    ]
  },
  {
    id: 'e2',
    title: 'Technology Stack Selection',
    description: 'Cast your vote for the primary frontend framework for next year.',
    startTime: '2024-02-01T00:00:00Z',
    endTime: '2024-12-15T23:59:59Z',
    status: 'active',
    candidates: [
      { id: 'c4', name: 'React (with Tailwind)' },
      { id: 'c5', name: 'Vue.js' },
      { id: 'c6', name: 'Svelte' }
    ]
  }
];

const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'a1',
    title: 'Rare Vintage Camera (1954)',
    description: 'A museum-quality collectors item with original lens and case.',
    startTime: '2024-05-01T00:00:00Z',
    endTime: '2024-12-01T00:00:00Z',
    status: 'active',
    currentBid: 2450
  }
];

export const mockBackend = {
  getElections: (): Election[] => {
    const data = localStorage.getItem('electra_elections');
    if (!data) {
      localStorage.setItem('electra_elections', JSON.stringify(INITIAL_ELECTIONS));
      return INITIAL_ELECTIONS;
    }
    return JSON.parse(data);
  },

  createElection: (title: string, description: string, candidateNames: string[]): Election => {
    const elections = mockBackend.getElections();
    const newElection: Election = {
      id: 'e' + Date.now(),
      title,
      description,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      candidates: candidateNames.map((name, i) => ({ id: `c_${Date.now()}_${i}`, name }))
    };
    const updated = [...elections, newElection];
    localStorage.setItem('electra_elections', JSON.stringify(updated));
    return newElection;
  },

  deleteElection: (id: string): void => {
    const elections = mockBackend.getElections().filter(e => e.id !== id);
    localStorage.setItem('electra_elections', JSON.stringify(elections));
    localStorage.removeItem(`electra_votes_${id}`);
  },

  getAuctions: (): Auction[] => {
    const data = localStorage.getItem('electra_auctions');
    if (!data) {
      localStorage.setItem('electra_auctions', JSON.stringify(INITIAL_AUCTIONS));
      return INITIAL_AUCTIONS;
    }
    return JSON.parse(data);
  },

  createAuction: (title: string, description: string, startingBid: number): Auction => {
    const auctions = mockBackend.getAuctions();
    const newAuction: Auction = {
      id: 'a' + Date.now(),
      title,
      description,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      currentBid: startingBid
    };
    const updated = [...auctions, newAuction];
    localStorage.setItem('electra_auctions', JSON.stringify(updated));
    return newAuction;
  },

  deleteAuction: (id: string): void => {
    const auctions = mockBackend.getAuctions().filter(a => a.id !== id);
    localStorage.setItem('electra_auctions', JSON.stringify(auctions));
  },

  resetDatabase: () => {
    localStorage.removeItem('electra_elections');
    localStorage.removeItem('electra_auctions');
    // Clear all vote data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('electra_votes_')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  },

  submitVote: (electionId: string, candidateId: string, userId: string): VoteReceipt | null => {
    const votesKey = `electra_votes_${electionId}`;
    const votes = JSON.parse(localStorage.getItem(votesKey) || '[]');
    if (votes.some((v: any) => v.userId === userId)) {
      return null;
    }
    const receipt: VoteReceipt = {
      voteId: Math.random().toString(36).substr(2, 9),
      receiptCode: `VOTE-${Math.random().toString(36).toUpperCase().substr(2, 12)}`,
      timestamp: new Date().toISOString()
    };
    votes.push({ userId, candidateId, receiptCode: receipt.receiptCode });
    localStorage.setItem(votesKey, JSON.stringify(votes));
    return receipt;
  },

  placeBid: (auctionId: string, amount: number, user: User): boolean => {
    const auctions = mockBackend.getAuctions();
    const auctionIdx = auctions.findIndex(a => a.id === auctionId);
    if (auctionIdx === -1) return false;
    if (amount <= auctions[auctionIdx].currentBid) return false;
    auctions[auctionIdx].currentBid = amount;
    auctions[auctionIdx].highestBidder = user.name;
    localStorage.setItem('electra_auctions', JSON.stringify(auctions));
    return true;
  },

  getResults: (electionId: string): Candidate[] => {
    const elections = mockBackend.getElections();
    const election = elections.find(e => e.id === electionId);
    if (!election) return [];
    const votes = JSON.parse(localStorage.getItem(`electra_votes_${electionId}`) || '[]');
    return election.candidates.map(c => ({
      ...c,
      votes: votes.filter((v: any) => v.candidateId === c.id).length
    }));
  }
};
