"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosInformationCircleOutline } from "react-icons/io";

interface HomeProps {
  quiz_set_id: string;
}

const Home = ({ quiz_set_id }: HomeProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/register/${quiz_set_id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-10">
        <div className="w-full max-w-md">
          <Image
            src="/nazotoki_icon.png"
            alt="謎解きアイコン"
            width={512}
            height={512}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="py-3 px-6 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-colors"
        >
          ニックネーム登録
        </button>

        <Link href="#" className="text-blue-600 hover:text-blue-800 underline">
          プライバシーポリシー / Privacy Policy
        </Link>

        <footer className="flex items-center gap-1 text-gray-600">
          <IoIosInformationCircleOutline />
          2025 produced by i.maker
        </footer>
      </div>
    </div>
  );
};

export default Home;
