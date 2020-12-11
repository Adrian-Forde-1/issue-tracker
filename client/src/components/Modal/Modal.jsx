import React from "react";
import ReactDOM from "react-dom";

const Modal = (props) => {
  return ReactDOM.createPortal(
    <div className="modal__overlay">{props.children}</div>,
    document.querySelector("#modal-root")
  );
};

export default Modal;
