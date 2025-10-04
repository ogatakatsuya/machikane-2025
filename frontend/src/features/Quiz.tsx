"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HamburgerIcon from "/public/hamburger.svg";

interface QuizProps {
  quiz_set_id: string;
}

const Quiz = ({ quiz_set_id }: QuizProps) => {
  const router = useRouter();

  const warningList = [
    "テストは静かな場所で受けてください。",
    "他の人の答案を見ないでください。",
    "時間を守り、途中退出はできません。",
    "試験用紙は丁寧に扱ってください。",
    "不明な点があれば、試験監督に質問してください。",
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="bg-[#2c2880] h-10 flex items-center justify-center fixed top-0 left-0 right-0 text-white">
          <button
            className="absolute left-2 hover:cursor-pointer"
            type="button"
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>
          <p className="font-bold">謎解き概論I</p>
        </div>

        <div className="flex justify-center items-center py-6 mb-6 mt-10 bg-gradient-to-b from-[#2c2880] via-[#2c2880] via-70% to-black">
          <Image
            src="/nazotoki_icon.png"
            alt="謎解きアイコン"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        <div className="p-4">
          <div>
            <h2 className="text-lg">注意事項</h2>
            <div className="border border-gray-300 p-4 pl-8 my-2">
              <ol className="list-disc pr-1 space-y-2">
                <li>
                  <p className="text-sm">
                    問題を開始したら、
                    <span className="text-red-600 font-bold">
                      終了するまで絶対にページをリロードしたり、他のページに遷移しないでください。
                    </span>
                  </p>
                </li>
                {warningList.map((warning) => (
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
                <li>
                  <p className="text-sm">
                    {/* TODO: 重要なお知らせを取得orハードコーディング */}
                    重要なお知らせはここに表示されます。
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              router.push(`/question/${quiz_set_id}`);
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

export default Quiz;
