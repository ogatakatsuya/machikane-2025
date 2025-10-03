import Result from "@/features/Result";

interface ResultPageProps {
  params: Promise<{
    quiz_set_id: string;
  }>;
}

const ResultPage = async ({ params }: ResultPageProps) => {
  const { quiz_set_id } = await params;
  return <Result quiz_set_id={quiz_set_id} />;
};

export default ResultPage;
