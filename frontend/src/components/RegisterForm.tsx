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
            className="w-[320px] h-[30px] text-[18px] [appearance:revert] [border:revert] [padding:revert] [margin:revert] [background:revert] [color:revert] [border-radius:revert]"
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
            className="w-[320px] h-[30px] text-[18px] [appearance:revert] [border:revert] [padding:revert] [margin:revert] [background:revert] [color:revert] [border-radius:revert]"
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

      <div className="flex justify-center pt-7">
        <input
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="w-[150px] h-[40px] text-[24px] [appearance:revert] [border:revert] [padding:revert] [margin:revert] [background:revert] [color:revert] [border-radius:revert]"
          value={isLoading ? "登録中..." : "登録"}
        />
      </div>
    </form>
  );
};

export default RegisterForm;
