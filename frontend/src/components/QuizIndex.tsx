"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface QuizSet {
  id: number;
  sub_id: string;
  title: string;
  description: string;
}

const QuizIndex = () => {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   const response = await getQuizSets();
    //   if (response.data?.quiz_sets) {
    //     setQuizSets(response.data.quiz_sets);
    //   }
    // };
    // fetchData();

    // Mock data for now
    setQuizSets([
      {
        id: 1,
        sub_id: "sample1",
        title: "サンプルクイズ1",
        description: "これはサンプルのクイズセットです。",
      },
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">問題セット一覧</h1>
      <div className="space-y-4">
        {quizSets.map((quizSet) => (
          <div
            key={quizSet.id}
            className="p-4 border border-gray-300 rounded-md"
          >
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/home/${quizSet.sub_id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {quizSet.title}
              </Link>
            </h2>
            <p className="text-gray-600">{quizSet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizIndex;
