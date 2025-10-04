"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";

interface RegisterFormProps {
  quiz_set_id: string;
}

const RegisterForm = ({ quiz_set_id }: RegisterFormProps) => {
  const { register, onSubmit, errors } = useRegisterForm(quiz_set_id);

  return (
    <form onSubmit={onSubmit} className="flex flex-col p-3">
      <div>
        <label className="flex flex-col items-center justify-center">
          <p className="text-2xl">チーム名 :</p>
          <input
            id="name"
            {...register("name")}
            className={`w-full border rounded-xs px-1 py-1 focus:outline-none focus:ring-2 focus:ring-black ${
              errors.name ? "border-red-500" : "border-gray-500"
            }`}
          />
        </label>
        {errors.name && (
          <p className="text-red-500 text-sm text-end mt-1 mb-3">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex flex-col items-center justify-center">
          <p className="text-2xl">メンバー数 :</p>
          <input
            id="memberNum"
            type="number"
            {...register("memberNum", { valueAsNumber: true })}
            className={`w-full border rounded-xs px-1 py-1 focus:outline-none focus:ring-2 focus:ring-black ${
              errors.memberNum ? "border-red-500" : "border-gray-500"
            }`}
          />
        </label>
        {errors.memberNum && (
          <p className="text-red-500 text-sm text-end mt-1 mb-3">
            {errors.memberNum.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="py-px px-5 mt-6 text-2xl mx-auto bg-gray-200 hover:bg-gray-300 border"
      >
        登録
      </button>
    </form>
  );
};

export default RegisterForm;
