import { API_BASE_URL } from "./constants";
import type {
  ApiErrorResponse,
  CreateGroupRequest,
  GroupResponse,
} from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errorDetail?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetail: string | undefined;

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      errorDetail = errorData.error;
      errorMessage = errorDetail || errorMessage;
    } catch {
      // JSON解析に失敗した場合はデフォルトのエラーメッセージを使用
    }

    throw new ApiError(response.status, errorMessage, errorDetail);
  }

  return response.json();
};

// Create Groups API
export const createGroup = async (
  data: CreateGroupRequest,
): Promise<GroupResponse> => {
  return apiRequest<GroupResponse>("/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
