import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export const useRegisterForm = (quiz_set_id: string) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormSchemaType) => {
    // TODO: Replace with actual API call
    // const request: CreateGroupRequest = {
    //   name: data.name,
    //   member_num: data.memberNum,
    // };
    // const response = await registerGroupWithSubId({
    //   body: request,
    //   path: { quiz_set_sub_id: quiz_set_id },
    // });
    // if (response.status === 400) {
    //   alert(response.error?.detail);
    // }
    // if (response.data?.id) {
    //   sessionStorage.setItem("groupId", String(response.data.id));
    //   router.push(`/quiz/${quiz_set_id}`);
    // }

    // Mock submission for now
    console.log("Registering:", data);
    sessionStorage.setItem("groupId", "mock-group-id");
    router.push(`/quiz/${quiz_set_id}`);
  };

  return {
    register,
    onSubmit: handleSubmit(onSubmit),
    errors,
  };
};
