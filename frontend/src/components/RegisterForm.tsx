"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";

const RegisterForm = () => {
  const { register, onSubmit, errors, isLoading, apiError } = useRegisterForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col p-4 pt-8">
      <div>
        <label className="flex flex-col items-center justify-center">
          <p className="text-2xl mt-1">チーム名 :</p>
          <input
            id="name"
            {...register("name")}
            className={`w-full border rounded-sm px-1 py-1 focus:outline-none focus:ring-2 focus:ring-black ${
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
          <p className="text-2xl mt-1">メンバー数 :</p>
          <input
            id="memberNum"
            type="number"
            {...register("memberNum", { valueAsNumber: true })}
            className={`w-full border rounded-sm px-1 py-1 focus:outline-none focus:ring-2 focus:ring-black ${
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

      {apiError && (
        <div className="text-red-500 text-sm text-center mt-4 p-3 bg-red-50 rounded border border-red-200">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`py-px px-5 mt-7 rounded-sm text-2xl mx-auto border ${
          isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {isLoading ? "登録中..." : "登録"}
      </button>
    </form>
  );
};

export default RegisterForm;
