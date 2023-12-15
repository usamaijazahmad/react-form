import React from "react";
import Quiz from "./Quiz";
import { mathQuizUrl, mathQuizAnswersUrl } from "../../../server/api";

function MathQuiz() {
  return (
    <>
      <Quiz
        myquizName="Math Quiz"
        quizApiUrl={mathQuizUrl}
        quizAnsApiUrl={mathQuizAnswersUrl}
      />
    </>
  );
}

export default MathQuiz;
