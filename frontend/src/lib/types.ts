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
