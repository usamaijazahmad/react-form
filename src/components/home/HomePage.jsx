import React from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../app/features/user/userSlice";

function HomePage() {
  const userData = useSelector(selectUserData);

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold text-violet-900 text-center mt-3">
          Welcome to Home Page {userData.email}!
        </h1>
      </div>
    </>
  );
}

export default HomePage;
