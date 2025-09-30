import RegisterForm from "@/components/RegisterForm";

interface RegisterProps {
  quiz_set_id: string;
}

const Register = ({ quiz_set_id }: RegisterProps) => {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col">
        <div className="bg-blue-100 text-left h-10 flex items-center justify-start text-xl">
          <p className="text-blue-800 pl-4 font-medium">ニックネーム登録</p>
        </div>

        <div className="flex flex-col items-center space-y-6 p-6">
          <RegisterForm quiz_set_id={quiz_set_id} />

          <p className="text-sm text-center underline">
            登録にお困りの場合は
            <br />
            TAに相談の上
            <br />
            自分で頑張ってください
          </p>

          <p className="text-sm text-center">
            ＜お知らせ＞
            <br />
            大学のポータルサイトCLEとは異なります。
            <br />
            謎解きの解答のみがこのサイトで可能です。
          </p>

          <p className="text-sm text-center">
            The website differs from the university portal, CLE.
            <br />
            It is exclusively for submitting answers
            <br />
            to the puzzle challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
