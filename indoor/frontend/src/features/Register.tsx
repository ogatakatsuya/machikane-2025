import Image from "next/image";
import { IoIosInformationCircleOutline } from "react-icons/io";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div className="w-full min-h-screen px-6 flex justify-center">
      <div className="max-w-96 flex flex-col">
        <h2 className="text-center text-xl my-4">i.maker 謎解き支援システム</h2>
        <div className="flex justify-end">
          <Image
            src="/imaker_logo.webp"
            alt="謎解きアイコン"
            width={125}
            height={39}
            className="object-contain"
            priority
          />
        </div>
        <div className="bg-blue-100 text-left flex items-center justify-start text-2xl">
          <p className="text-blue-900 my-px pl-3 font-medium">チーム名登録</p>
        </div>

        <div className="space-y-6">
          <RegisterForm />

          <p className="text-blue-700 hover:text-blue-800 underline">
            ポータルサイト
          </p>

          <div className="">
            <p>
              <span>登録にお困りの場合は</span>
              <span className="text-blue-700 hover:text-blue-800 underline">
                TAに相談
              </span>
              <span>の上、</span>
            </p>
            <p className="text-red-500 hover:text-red-600 underline">
              自分で頑張ってください
            </p>
          </div>

          <div className="mb-10">
            <p className="font-bold">＜お知らせ＞</p>
            <p className="mb-4">
              大学のポータルサイトCLEとは異なります。
              <br />
              謎解きの解答のみがこのサイトで可能です。
            </p>
            <p>
              The website differs from the university portal, CLE. It is
              exclusively for submitting answers to the puzzle challenges.
            </p>
          </div>
        </div>
        <footer className="flex items-center justify-center text-xs gap-1 text-gray-600">
          <IoIosInformationCircleOutline />
          2025 produced by i.maker
        </footer>
      </div>
    </div>
  );
};

export default Register;
