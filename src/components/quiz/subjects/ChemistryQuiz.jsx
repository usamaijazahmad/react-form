import React from "react";
import Quiz from "../Quiz";
import { quizApiUrl } from "../../../../server/api";

function ChemistryQuiz() {
  return (
    <>
      <Quiz
        myquizName="Chemistry Quiz"
        quizApiUrl={quizApiUrl + "/chemistry"}
      />
    </>
  );
}

export default ChemistryQuiz;
