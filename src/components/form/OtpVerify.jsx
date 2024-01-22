import React, { useState, useEffect } from "react";
import { validateProperty } from "../../js/validationLogic.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearUserStateForOtpVerify,
  selectUserDataForOtpVerify,
  setUserDataForLogin,
  setUserDataForOtpVerify,
} from "../../app/features/user/userSlice.js";
import Input from "../form/formUtils/Input";
import Button from "../form/formUtils/Button";
import Joi from "joi-browser";
import axios from "axios";
import { usersApiUrl } from "../../../server/api.js";

function OtpVerify() {
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUserDataForOtpVerify);

  const userId = location.state ? location.state.userId : "";
  const otp = location.state ? location.state.otp : "";

  const schema = {
    otp: Joi.number().integer().min(1000).max(9999).required(),
  };

  useEffect(() => {
    dispatch(clearUserStateForOtpVerify());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      if (otp === Number(user.otp)) {
        alert("Your email has been successfuly verified!");

        const response = await axios.put(usersApiUrl + `/${userId}`, {
          emailIsValid: true,
        });

        const ourUser = response.data;

        dispatch(setUserDataForLogin({ email: ourUser.email, password: "" }));

        navigate("/logIn");

        dispatch(clearUserStateForOtpVerify());
      } else {
        const errorData = {
          otp: "Invalid otp!",
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
    dispatch(setUserDataForOtpVerify(userData));
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
          We have sent you a four digit OTP on your email
        </h2>
      </div>
      <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
        <Input
          label="Four-digit OTP"
          id="otp"
          name="otp"
          type="text"
          placeholder="Enter your four-digit otp here"
          onChange={handleOnChange}
          value={user.otp}
          errorMessage={errors.otp}
        />
        <Button text="Verify" onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default OtpVerify;
