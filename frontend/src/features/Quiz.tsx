"use client";

import { useRouter } from "next/navigation";
import { IoMdCheckboxOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

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
      <div className="flex flex-col">
        <div className="bg-gray-600 text-left h-10 flex items-center justify-start text-xl">
          <p className="text-white font-bold pl-4">謎解き概論I</p>
        </div>

        <div className="text-left pl-4 space-y-4">
          <h1 className="text-2xl font-bold pb-4">詳細＆情報</h1>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-10 grid-rows-2 w-full">
            <div className="col-span-1 row-span-2 pt-1 px-2">
              <SlCalender className="w-9 h-9" />
            </div>
            <div className="col-span-8">
              <p className="font-bold">アセスメントの期限</p>
            </div>
            <div className="col-start-2 col-end-10 row-start-2 row-end-2">
              <p>テスト開始より10分</p>
            </div>
          </div>

          <hr className="border-gray-300" />

          <div className="grid grid-cols-10 grid-rows-2 w-full">
            <div className="col-span-1 row-span-2 pt-1 px-2">
              <IoMdCheckboxOutline className="w-9 h-9" />
            </div>
            <div className="col-span-8">
              <p className="font-bold">答案</p>
            </div>
            <div className="col-start-2 col-end-10 row-start-2 row-end-2">
              <p className="font-bold">未提出</p>
            </div>
          </div>

          <hr className="border-gray-300" />

          <h2 className="text-xl font-bold py-4">注意事項</h2>

          <ol className="list-decimal pr-1 space-y-2">
            <li>
              <p className="text-red-500 text-sm">
                問題を開始したら、終了するまで絶対にページをリロードしたり、他のページに遷移しないでください。
              </p>
            </li>
            {warningList.map((warning) => (
              <li key={warning}>
                <p className="text-sm">{warning}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-5 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              router.push(`/question/${quiz_set_id}`);
            }}
            className="bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-900 transition-colors"
          >
            答案1を開始
          </button>
          <p className="text-sm text-red-500 pt-1">
            合図があるまでこのボタンは押さないでください
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
