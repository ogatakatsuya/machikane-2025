"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMPORTANT_NOTICE, WARNING_LIST } from "@/lib/constants";

const QuizHome = () => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="bg-[#2c2880] h-10 flex items-center justify-center fixed top-0 left-0 right-0 text-white">
          <p className="font-bold">教育機関のページ</p>
        </div>

        <div className="flex justify-center items-center py-7 mb-6 mt-10 bg-gradient-to-b from-[#2c2880] via-[#2c2880] via-70% to-black">
          <Image
            src="/nazotoki_icon.png"
            alt="謎解きアイコン"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        <div className="p-4">
          <div>
            <h2 className="text-lg">注意事項</h2>
            <div className="border border-gray-300 p-4 pl-8 my-2">
              <ol className="list-disc pr-1 space-y-2">
                {WARNING_LIST.map((warning) => (
                  <li key={warning}>
                    <p className="text-sm">{warning}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div>
            <h2 className="text-lg">重要なお知らせ</h2>
            <div className="border border-gray-300 p-4 pl-8 my-2">
              <ol className="list-disc pr-1 space-y-2">
                {IMPORTANT_NOTICE.map((notice) => (
                  <li key={notice}>
                    <p className="text-sm">{notice}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              router.push(`/quiz`);
            }}
            className="text-xl font-bold text-white bg-blue-800 py-3 px-6 rounded-md hover:bg-blue-900 transition-colors hover:cursor-pointer"
          >
            問題を開始
          </button>
          <p className="text-sm text-red-500 pt-2">
            合図があるまでこのボタンは押さないでください
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizHome;
