import { useEffect, useState } from "react";
import { QuestionStatus } from "@/lib/quiz-types";

interface QuestionComponentProps {
  questionId: number;
  questionText: string;
  questionAnswer: string[];
  questionState: {
    status: QuestionStatus;
    answer?: string;
  };
  onAnswer: (
    questionId: number,
    status: QuestionStatus,
    answer: string,
  ) => void;
}

const QuestionComponent = ({
  questionId,
  questionText,
  questionAnswer,
  questionState,
  onAnswer,
}: QuestionComponentProps) => {
  const [userAnswer, setUserAnswer] = useState(questionState.answer || "");

  useEffect(() => {
    setUserAnswer(questionState.answer || "");
  }, [questionState.answer]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const isCorrect = questionAnswer.includes(userAnswer.trim());
    const status = isCorrect
      ? QuestionStatus.CORRECT
      : QuestionStatus.INCORRECT;

    onAnswer(questionId, status, userAnswer);
  };

  const getStatusColor = () => {
    switch (questionState.status) {
      case QuestionStatus.CORRECT:
        return "text-green-600 bg-green-100";
      case QuestionStatus.INCORRECT:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = () => {
    switch (questionState.status) {
      case QuestionStatus.CORRECT:
        return "✓ 正解";
      case QuestionStatus.INCORRECT:
        return "✗ 不正解";
      default:
        return "未回答";
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">問題 {questionId}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      <p className="mb-4 text-gray-700">{questionText}</p>

      <div className="space-y-3">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="回答を入力してください..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          disabled={questionState.status === QuestionStatus.CORRECT}
        />

        {questionState.status !== QuestionStatus.CORRECT && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            回答を送信
          </button>
        )}

        {questionState.answer && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <strong>あなたの回答:</strong> {questionState.answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionComponent;
