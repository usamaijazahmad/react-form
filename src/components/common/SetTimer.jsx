import React, { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

function SetTimer({ handleExpire }) {
  const [timerVisibility, setTimerVisibility] = useState(true);

  const { seconds, minutes, hours, days, restart } = useTimer({
    onExpire: () => {
      setTimerVisibility(false);
      handleExpire();
    },
  });

  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 120);
    restart(time);
  }, []);

  return (
    <>
      {timerVisibility ? (
        <div className="bg-gray-300 px-3 py-2 mt-4 mb-7 rounded-lg">
          <div style={{ fontSize: "50px" }}>
            <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
            <span>{seconds}</span>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default SetTimer;
