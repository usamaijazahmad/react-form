import React, { useState, useEffect } from "react";
import { validateProperty } from "../../js/validationLogic.js";
import { verifyEmailApiUrl } from "../../../server/api.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import {
  clearUserStateForVerifyEmail,
  selectUserDataForVerifyEmail,
  setUserDataForVerifyEmail,
} from "../../app/features/user/userSlice.js";
import Input from "../form/formUtils/Input";
import Button from "../form/formUtils/Button";
import Joi from "joi-browser";
import axios from "axios";

function VerifyEmail() {
  const [errors, setErrors] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUserDataForVerifyEmail);
  const forget = location.state ? location.state.forget : "";

  const schema = {
    email: Joi.string().email().required(),
  };

  useEffect(() => {
    dispatch(clearUserStateForVerifyEmail());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setShowSpinner(true);
    document.getElementById("myBtn").style.display = "none";

    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      try {
        const headers = forget ? { forget: forget } : {};

        const response = await axios.post(
          verifyEmailApiUrl,
          {
            email: user.email,
          },
          { headers }
        );

        if (response.status === 200) {
          const otp = response.data.otp;
          const userId = response.data.id;
          const headerVal = response.data.headerVal
            ? response.data.headerVal
            : "";

          navigate("/verifyOtp", {
            state: { userId: userId, otp: otp, headerVal: headerVal },
          });

          dispatch(clearUserStateForVerifyEmail());
        }
      } catch (err) {
        document.getElementById("myBtn").style.display = "flex";
        const errorData = {
          email: err.response.data,
        };
        setErrors(errorData);
      } finally {
        setShowSpinner(false);
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
      setShowSpinner(false);
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
    dispatch(setUserDataForVerifyEmail(userData));
    setErrors(errorData);
  };

  return (
    <div
      className="
  bg-white px-10 
  py-5 md:w-1/3 h-2/3 
  mx-auto mt-10 rounded-lg 
  flex flex-col items-center 
  justify-evenly
  "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify Your Email
        </h2>
      </div>
      <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email here"
          onChange={handleOnChange}
          value={user.email}
          errorMessage={errors.email}
        />
        <Button id="myBtn" text="Verify" onClick={handleSubmit} />
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
  );
}

export default VerifyEmail;
