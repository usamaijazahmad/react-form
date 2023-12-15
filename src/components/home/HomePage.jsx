import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function HomePage(props) {
  const location = useLocation();
  const myEmailid = location.state?.myEmailId || "";
  const [myEmail, setMyEmail] = useState(myEmailid);

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold text-violet-900 text-center mt-3">
          Welcome to Home Page {myEmail}!
        </h1>
      </div>
    </>
  );
}

export default HomePage;
