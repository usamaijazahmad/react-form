import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const qzName = location.state?.qzName || "";

  let quizRoute;

  useEffect(() => {
    if (qzName === "Physics Quiz") {
      quizRoute = "/physicsQuiz";
    }
    if (qzName === "Math Quiz") {
      quizRoute = "/mathQuiz";
    }
    if (qzName === "Chemistry Quiz") {
      quizRoute = "/chemistryQuiz";
    }
  }, []);

  const handleAttemptAgain = (route) => {
    navigate(route);
  };

  return (
    <div className="w-full flex flex-col items-center justify-evenly mt-44">
      <h1 className="font-bold text-5xl">Result:</h1>
      <p className="text-3xl mt-2">
        Your score is: <b>{score}</b>
      </p>
      <button
        onClick={() => handleAttemptAgain(quizRoute)}
        className="mt-4 flex w-1/7 justify-center rounded-xl
         bg-indigo-600 px-10 py-4 text-lg font-semibold leading-6
         text-white shadow-sm
         hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2
        focus-visible:outline-indigo-600"
      >
        Attempt again
      </button>
    </div>
  );
}

export default ResultPage;
