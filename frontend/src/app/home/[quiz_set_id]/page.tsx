import Home from "@/features/Home";

interface HomePageProps {
  params: {
    quiz_set_id: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  return <Home quiz_set_id={params.quiz_set_id} />;
}
