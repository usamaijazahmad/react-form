import React, { useEffect, useState } from "react";
import {
  selectUserDataForLogin,
  setUserDataForLogin,
  authenticateUser,
  clearUserStateForLogin,
  fetchUserData,
  setUserData,
} from "../../app/features/user/userSlice.js";
import { validateProperty } from "../../js/validationLogic.js";
import { loginApiUrl } from "../../../server/api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import Button from "../form/formUtils/Button";
import QuickLink from "../form/formUtils/QuickLink";
import Input from "../form/formUtils/Input";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUserDataForLogin);

  const [errors, setErrors] = useState({});

  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(8).required(),
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      document.getElementById("Log In").style.display = "none";
      document.getElementById("Sign Up").style.display = "none";
    } else {
      document.getElementById("Home").style.display = "none";
      document.getElementById("Math Quiz").style.display = "none";
      document.getElementById("Physics Quiz").style.display = "none";
      document.getElementById("Chemistry Quiz").style.display = "none";
    }

    axios.defaults.headers.common["authorization"] = token;

    dispatch(authenticateUser());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      try {
        const response = await axios.post(loginApiUrl, {
          email: user.email,
          password: user.password,
        });
        if (response.status === 200) {
          alert("You successfuly logged in!");

          document.getElementById("Log In").style.display = "none";
          document.getElementById("Sign Up").style.display = "none";
          document.getElementById("Home").style.display = "flex";
          document.getElementById("Math Quiz").style.display = "flex";
          document.getElementById("Physics Quiz").style.display = "flex";
          document.getElementById("Chemistry Quiz").style.display = "flex";

          const loggedInUser = response.data.user;
          localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

          const token = response.data.accessToken;
          localStorage.setItem("accessToken", token);

          dispatch(authenticateUser());

          dispatch(clearUserStateForLogin());
          dispatch(fetchUserData(loggedInUser.email));
          dispatch(setUserData());

          navigate("/homePage");

          setErrors({});
        }
      } catch (err) {
        const errorData = {
          password: err.response.data,
        };
        setErrors(errorData);
      }
      return;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }

      setErrors(errorData);
      return errorData;
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    let errorData = { ...errors };
    const errorMessage = validateProperty(event, schema);
    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }
    let userData = { ...user };
    userData[name] = value;
    dispatch(setUserDataForLogin(userData));
    setErrors(errorData);
  };

  return (
    <>
      <div
        className="
      bg-white px-10 
      py-5 md:w-1/3 h-full 
      mx-auto mt-10 rounded-lg 
      flex flex-col items-center 
      justify-evenly
      "
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
          </h2>
        </div>
        <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleOnChange}
            errorMessage={errors.email}
            placeholder="Enter your email here"
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleOnChange}
            errorMessage={errors.password}
            placeholder="Enter your password here"
          />
          <Button text="Sign In" onClick={handleSubmit} />
          <QuickLink
            text="Not a member?"
            linkText="Create Account"
            link="/signUp"
          />
        </form>
      </div>
    </>
  );
}

export default LoginForm;
