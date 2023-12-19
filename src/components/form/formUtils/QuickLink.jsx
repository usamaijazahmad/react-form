import React from "react";
import { Link } from "react-router-dom";

function QuickLink(props) {
  return (
    <p className="mt-10 text-sm text-gray-500 w-full">
      {props.text}{" "}
      <Link
        to={props.link}
        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
      >
        {props.linkText}
      </Link>
    </p>
  );
}

export default QuickLink;
