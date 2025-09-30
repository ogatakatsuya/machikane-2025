"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";

interface RegisterFormProps {
  quiz_set_id: string;
}

const RegisterForm = ({ quiz_set_id }: RegisterFormProps) => {
  const { register, onSubmit, errors } = useRegisterForm(quiz_set_id);

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4 p-4">
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium">
          チーム名
        </label>
        <input
          id="name"
          {...register("name")}
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="memberNum" className="mb-1 font-medium">
          チームのメンバー数
        </label>
        <input
          id="memberNum"
          type="number"
          {...register("memberNum", { valueAsNumber: true })}
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.memberNum ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.memberNum && (
          <span className="text-red-500 text-sm mt-1">
            {errors.memberNum.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors self-start"
      >
        登録
      </button>
    </form>
  );
};

export default RegisterForm;
