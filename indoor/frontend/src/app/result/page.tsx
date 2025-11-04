import { Suspense } from "react";
import LoadingPage from "@/components/LoadingPage";
import Result from "@/features/Result";

const ResultPage = () => {
  return (
    <Suspense fallback={<LoadingPage text="結果を読み込み中..." />}>
      <Result />
    </Suspense>
  );
};

export default ResultPage;
