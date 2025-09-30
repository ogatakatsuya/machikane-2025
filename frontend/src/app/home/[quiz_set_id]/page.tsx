import Home from "@/features/Home";

interface HomePageProps {
  params: Promise<{
    quiz_set_id: string;
  }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { quiz_set_id } = await params;
  return <Home quiz_set_id={quiz_set_id} />;
};

export default HomePage;
