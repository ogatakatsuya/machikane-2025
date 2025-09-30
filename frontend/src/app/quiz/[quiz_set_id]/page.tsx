import Quiz from "@/features/Quiz";

interface QuizPageProps {
  params: {
    quiz_set_id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return <Quiz quiz_set_id={params.quiz_set_id} />;
}
