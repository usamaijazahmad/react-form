import React from "react";
import Quiz from "./Quiz";
import { physicsQuizUrl, physicsQuizAnswersUrl } from "../../../server/api";

function PhysicsQuiz() {
  return (
    <>
      <Quiz
        myquizName="Physics Quiz"
        quizApiUrl={physicsQuizUrl}
        quizAnsApiUrl={physicsQuizAnswersUrl}
      />
    </>
  );
}

export default PhysicsQuiz;
