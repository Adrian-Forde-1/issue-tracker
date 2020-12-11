import React from "react";
import ReactDOM from "react-dom";

const Modal = (props) => {
  return ReactDOM.createPortal(
    <div
      className="modal__overlay"
      onClick={(e) => {
        e.stopPropagation();
        if (props.setShowModal) {
          props.setShowModal(false);
        }
      }}
    >
      {props.children}
    </div>,
    document.querySelector("#modal-root")
  );
};

export default Modal;
