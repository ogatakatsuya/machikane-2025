import Register from "@/features/Register";

interface RegisterPageProps {
  params: Promise<{
    quiz_set_id: string;
  }>;
}

const RegisterPage = async ({ params }: RegisterPageProps) => {
  const { quiz_set_id } = await params;
  return <Register quiz_set_id={quiz_set_id} />;
};

export default RegisterPage;
