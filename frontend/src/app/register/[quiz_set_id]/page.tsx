import Register from "@/features/Register";

interface RegisterPageProps {
  params: {
    quiz_set_id: string;
  };
}

export default function RegisterPage({ params }: RegisterPageProps) {
  return <Register quiz_set_id={params.quiz_set_id} />;
}
