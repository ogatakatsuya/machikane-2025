import Quiz from "@/features/Quiz";

interface QuizPageProps {
  params: Promise<{
    quiz_set_id: string;
  }>;
}

const QuizPage = async ({ params }: QuizPageProps) => {
  const { quiz_set_id } = await params;
  return <Quiz quiz_set_id={quiz_set_id} />;
};

export default QuizPage;
