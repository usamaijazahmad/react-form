import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SetTimer from "../common/SetTimer";

function Quiz({ myquizName, quizApiUrl, quizAnsApiUrl }) {
  const [quizData, setQuizData] = useState([]);
  const [quizAnsData, setQuizAnsData] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [isStart, setIsStart] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [showEnd, setShowEnd] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const navigate = useNavigate();

  let checkBoxes = [];
  let userAns = [];
  let navBar;

  useEffect(() => {
    setIsStart(false);
    setShowQuiz(false);
    setShowEnd(false);
    setShowStart(true);

    getQuizdata(quizApiUrl);
    getQuizAnsdata(quizAnsApiUrl);
    setQuizName(myquizName);
  }, []);

  const getQuizdata = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    setQuizData(data);
  };

  const getQuizAnsdata = async (url) => {
    let orgAns = [];

    const response = await fetch(url);
    const data = await response.json();

    data.forEach((item) => {
      const ansObj = { answer: item.answer, quesId: item.quesId };
      orgAns.push(ansObj);
    });
    setQuizAnsData(orgAns);
  };

  const handleStartQuiz = () => {
    setIsStart(true);
    setShowStart(false);
    setShowQuiz(true);
    setShowEnd(true);
    navBar = document.getElementById("myNav");
    navBar.style.display = "none";
  };

  const handleEndQuiz = () => {
    if (userAns.length === 10) {
      userAns.sort((a, b) => a.quesId - b.quesId);
      const result = calculateResult(userAns, quizAnsData);
      navBar = document.getElementById("myNav");
      navBar.style.display = "block";
      navigate("/result", { state: { score: result, qzName: myquizName } });
    } else {
      alert("You must attempt every question!");
    }
  };

  const handleOnchange = (event) => {
    const { id, value, checked, className } = event.target;
    const qId = Number(value);
    checkBoxes = document.getElementsByClassName(className);
    let ansObj = {};

    if (checked) {
      ansObj.answer = id;
      ansObj.quesId = qId;

      userAns.push(ansObj);

      for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].value == qId && checkBoxes[i].id !== id) {
          checkBoxes[i].disabled = true;
        }
      }
    } else {
      let ind = userAns.findIndex(
        (obj) => obj.answer === id && obj.quesId === qId
      );
      ansObj = {};
      userAns.splice(ind, 1);
      for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].value == qId && checkBoxes[i].id !== id) {
          checkBoxes[i].disabled = false;
        }
      }
    }
  };

  const handleExpire = () => {
    navBar = document.getElementById("myNav");
    navBar.style.display = "block";
    const result = calculateResult(userAns, quizAnsData);
    navigate("/result", { state: { score: result, qzName: myquizName } });
  };

  const calculateResult = (arr1, arr2) => {
    let result = 0;
    for (let i = 0; i < arr1.length; i++) {
      if (
        arr1[i].answer === arr2[i].answer &&
        arr1[i].quesId === arr2[i].quesId
      ) {
        result++;
      }
    }
    return result;
  };

  const handleOptClick = (opt, quesId) => {
    checkBoxes = document.getElementsByClassName("checkBoxes");

    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].value == quesId && checkBoxes[i].id === opt) {
        if (!checkBoxes[i].disabled) {
          checkBoxes[i].checked = !checkBoxes[i].checked;

          handleOnchange({
            target: {
              id: opt,
              value: quesId,
              checked: checkBoxes[i].checked,
              className: "checkBoxes",
            },
          });
        }
        break;
      }
    }
  };

  return (
    <>
      <div className="w-full flex flex-col justify-evenly items-center">
        <h1 className="text-center mt-3 text-4xl font-bold">{quizName}</h1>

        {showStart ? (
          <div className="w-full mt-4 flex items-center justify-center">
            {" "}
            <button
              onClick={handleStartQuiz}
              className="flex w-1/7 justify-center rounded-xl
         bg-indigo-600 px-10 py-4 text-lg font-semibold leading-6
         text-white shadow-sm
         hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2
        focus-visible:outline-indigo-600"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div></div>
        )}

        {isStart ? <SetTimer handleExpire={handleExpire} /> : <div></div>}

        {showQuiz ? (
          quizData.map((item) => (
            <div
              className="w-full text-lg mb-3 px-7 py-4 bg-slate-200"
              key={item.id}
            >
              <p className="mb-1">
                <b>
                  {item.id}- {item.question}
                </b>
              </p>
              {item.options.map((opt) => (
                <div key={opt}>
                  <input
                    className="checkBoxes"
                    id={opt}
                    onChange={handleOnchange}
                    value={item.id}
                    type="checkbox"
                  />{" "}
                  <span
                    onClick={() => handleOptClick(opt, item.id)}
                    className="ml-2.5 mb-1"
                  >
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div></div>
        )}
        {showEnd ? (
          <div className="w-full mt-4 flex items-center justify-center mb-5">
            {" "}
            <button
              onClick={handleEndQuiz}
              className="flex w-1/7 justify-center rounded-xl
         bg-indigo-600 px-10 py-4 text-lg font-semibold leading-6
         text-white shadow-sm
         hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2
        focus-visible:outline-indigo-600"
            >
              End Quiz
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default Quiz;
