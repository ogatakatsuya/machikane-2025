// API Types
export interface CreateGroupRequest {
  name: string;
  group_size: number;
}

export interface GroupResponse {
  id: string;
  name: string;
  group_size: number;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface RankingItem {
  id: string;
  group_id: string;
  group_name: string;
  score: number;
  rank: number;
  created_at: string;
}

export interface RankingResponse {
  rankings: RankingItem[];
}
