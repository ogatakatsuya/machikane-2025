"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosInformationCircleOutline } from "react-icons/io";

const Home = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/register`);
  };

  return (
    <div className="bg-[#272727] min-h-screen pt-8 p-10 flex flex-col items-center gap-8">
      <Image
        src="/nazotoki_icon.png"
        alt="謎解きアイコン"
        width={160}
        height={160}
        className="object-contain"
        priority
      />

      <div className="px-4 w-full flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={handleClick}
          className="w-full max-w-72 p-2 text-sm bg-[#2d287f] text-[#F8F8F8] hover:bg-[#fdd000] hover:text-[#333] active:bg-[#fdd000] active:text-[#333] transition-colors border border-white rounded-xs hover:cursor-pointer"
        >
          チーム名登録
        </button>
        {/* TODO: CLEに合わせてボタン追加．不要であれば削除 */}
        <button
          type="button"
          className="w-full max-w-72 p-2 text-sm bg-[#808080] text-[#F8F8F8] hover:bg-white hover:text-[#333] active:bg-white active:text-[#333] transition-colors border border-white rounded-xs hover:cursor-pointer"
        >
          何かのボタン
        </button>
      </div>
      <Link href="#" className="text-white text-xs">
        プライバシーポリシー / Privacy Policy
      </Link>

      <footer className="flex items-center gap-1 text-[#969696] text-xs mt-12">
        <IoIosInformationCircleOutline />
        2025 produced by i.maker
      </footer>
    </div>
  );
};

export default Home;
