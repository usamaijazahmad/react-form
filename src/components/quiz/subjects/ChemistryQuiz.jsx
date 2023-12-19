import React from "react";
import Quiz from "../Quiz";
import {
  chemistryQuizUrl,
  chemistryQuizAnswersUrl,
} from "../../../../server/api";

function ChemistryQuiz() {
  return (
    <>
      <Quiz
        myquizName="Chemistry Quiz"
        quizApiUrl={chemistryQuizUrl}
        quizAnsApiUrl={chemistryQuizAnswersUrl}
      />
    </>
  );
}

export default ChemistryQuiz;
