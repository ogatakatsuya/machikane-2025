import { API_BASE_URL } from "./constants";
import type { QuizSubmissionData, SerializedQuizResultResponse } from "./quiz-types";
import type { SerializedQuizContext } from "./quiz-types";
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

// Quiz Results API
export const submitQuizResults = async (data: QuizSubmissionData): Promise<void> => {
  const groupId = data.context?.groupId;
  if (!groupId) throw new Error("groupId is required for results API");

  const url = `${API_BASE_URL}/results/${groupId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const err = (await response.json()) as { error?: string };
      if (err?.error) message = err.error;
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(response.status, message);
  }
};

// Get Quiz Results API
export const getQuizResults = async (
  groupId: string,
): Promise<SerializedQuizResultResponse> => {
  if (!groupId) throw new Error("groupId is required for get results API");
  return apiRequest<SerializedQuizResultResponse>(`/results/${groupId}`, {
    method: "GET",
  });
};
