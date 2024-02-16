import React, { useState, useEffect } from "react";
import { registerApiUrl, verifyEmailApiUrl } from "../../../server/api";
import { useNavigate, useLocation } from "react-router-dom";
import { validateProperty } from "../../js/validationLogic";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserDataForLogin,
  setUserDataForSignup,
  setEmailIsValid,
  clearUserStateForSignup,
  selectUserDataForSignup,
  selectEmailIsValid,
} from "../../app/features/user/userSlice";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joi from "joi-browser";
import Button from "../form/formUtils/Button";
import QuickLink from "../form/formUtils/QuickLink";
import Input from "../form/formUtils/Input";
import axios from "axios";

function SignUpForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUserDataForSignup);
  const emailIsValid = useSelector(selectEmailIsValid);

  const clearData = location.state ? location.state.clearData : true;

  const [errors, setErrors] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [file, setFile] = useState(null);

  const schema = {
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(8).required(),
  };

  useEffect(() => {
    if (clearData === true) {
      dispatch(clearUserStateForSignup());
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setShowSpinner(true);
    document.getElementById("myBtn").style.display = "none";
    document.getElementById("myLink").style.display = "none";

    const result = Joi.validate(
      { name: user.name, email: user.email, password: user.password },
      schema,
      {
        abortEarly: false,
      }
    );

    const { error } = result;
    if (!error) {
      try {
        if (emailIsValid === false) {
          const headers = {};
          const response1 = await axios.post(
            verifyEmailApiUrl,
            { email: user.email, name: user.name },
            { headers }
          );

          if (response1.status === 200) {
            const otp = response1.data.otp;
            const userId = response1.data.id;
            const headerVal = response1.data.headerVal
              ? response1.data.headerVal
              : "";

            navigate("/verifyOtp", {
              state: { userId: userId, otp: otp, headerVal: headerVal },
            });
          }
        }

        if (emailIsValid === true) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", user.name);
          formData.append("email", user.email);
          formData.append("password", user.password);
          const response = await axios.post(registerApiUrl, formData);
          if (response.status === 200) {
            toast.success(response.data, {
              onClose: () => {
                dispatch(clearUserStateForSignup());
                dispatch(setEmailIsValid(false));
                dispatch(
                  setUserDataForLogin({ email: user.email, password: "" })
                );
                navigate("/logIn", { state: { cleardata: false } });
                return;
              },
            });
          }
        }
      } catch (err) {
        document.getElementById("myBtn").style.display = "flex";
        document.getElementById("myLink").style.display = "flex";
        console.log(err);
        if (err.response.status === 409) {
          const errorData = {
            email: err.response.data,
          };
          setErrors(errorData);
        }
      } finally {
        setShowSpinner(false);
      }
    } else {
      document.getElementById("myBtn").style.display = "flex";
      document.getElementById("myLink").style.display = "flex";
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }

      setErrors(errorData);
      setShowSpinner(false);
      return errorData;
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnChange = (event) => {
    dispatch(setEmailIsValid(false));
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

    dispatch(setUserDataForSignup(userData));
    setErrors(errorData);
  };

  return (
    <>
      <div
        className="
      bg-white px-10 py-5 md:w-1/3 
      mx-auto mt-10 
      rounded-lg flex flex-col 
      items-center justify-evenly con"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>
        <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
          <Input
            label="Name"
            id="nameInp"
            name="name"
            value={user.name}
            onChange={handleOnChange}
            errorMessage={errors.name}
            type="text"
            placeholder="Enter your name here"
          />
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
          <Input
            label="Upload Profile Picture"
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
          />

          <Button id="myBtn" text="Sign Up" onClick={handleSubmit} />
          <QuickLink
            id="myLink"
            text="Already have an account?"
            linkText="Sign In"
            link="/logIn"
          />
        </form>
        <TailSpin
          visible={showSpinner}
          height="60"
          width="60"
          color="blue"
          ariaLabel="tail-spin-loading"
          radius="2"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
      <ToastContainer
        hideProgressBar="true"
        position="top-center"
        autoClose={1000}
        theme="dark"
      />
    </>
  );
}

export default SignUpForm;
