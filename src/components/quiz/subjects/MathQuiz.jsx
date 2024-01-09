import React from "react";
import Quiz from "../Quiz";
import { quizApiUrl } from "../../../../server/api";

function MathQuiz() {
  return (
    <>
      <Quiz myquizName="Math Quiz" quizApiUrl={quizApiUrl + "/math"} />
    </>
  );
}

export default MathQuiz;
