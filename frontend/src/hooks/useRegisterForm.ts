import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError, createGroup } from "@/lib/api";
import type { CreateGroupRequest } from "@/lib/types";

const RANGE = { min: 1, max: 3 } as const;

export const registerFormSchema = z.object({
  name: z.string().min(1, {
    message: "ニックネームは必須です",
  }),
  memberNum: z
    .number({ message: "数値で入力してください" })
    .int({ message: "整数で入力してください" })
    .min(RANGE.min, { message: `${RANGE.min}以上を入力してください` })
    .max(RANGE.max, { message: `${RANGE.max}以下を入力してください` }),
});

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

export const useRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormSchemaType) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const request: CreateGroupRequest = {
        name: data.name,
        group_size: data.memberNum,
      };

      const response = await createGroup(request);

      if (response.id) {
        sessionStorage.setItem("groupId", response.id);
        router.push("/quiz");
      }
    } catch (error) {
      console.error("Failed to create group:", error);

      if (error instanceof ApiError) {
        setApiError(error.errorDetail || error.message);
      } else {
        setApiError("グループの登録に失敗しました。もう一度お試しください。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    onSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    apiError,
  };
};
