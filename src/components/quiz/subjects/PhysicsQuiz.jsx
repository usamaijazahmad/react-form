import React from "react";
import Quiz from "../Quiz";
import { quizApiUrl } from "../../../../server/api";

function PhysicsQuiz() {
  return (
    <>
      <Quiz myquizName="Physics Quiz" quizApiUrl={quizApiUrl + "/physics"} />
    </>
  );
}

export default PhysicsQuiz;
