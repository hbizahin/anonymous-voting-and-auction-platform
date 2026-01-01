
export enum UserRole {
  ADMIN = 'admin',
  VOTER = 'voter'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'upcoming';
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  votes?: number;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'closed' | 'upcoming';
  currentBid: number;
  highestBidder?: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: string;
}

export interface VoteReceipt {
  voteId: string;
  receiptCode: string;
  timestamp: string;
}
