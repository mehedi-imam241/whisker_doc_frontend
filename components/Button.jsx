import React from "react";

function ButtonCustom(props) {
  return (
    <button
      className={`
        bg-primary text-white text-xl md:text-2xl py-2 px-8 rounded-[100px] hover:bg-primary-dark hover:scale-110 transition-all ${
          props.className ? props.className : ""
        }
      `}
      type={!!props.type ? props.type : "button"}
    >
      {props.children}
    </button>
  );
}

export default ButtonCustom;
