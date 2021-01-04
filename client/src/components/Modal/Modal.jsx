import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = (props) => {
  const { showModal, setShowModal, children } = props;

  useEffect(() => {
    if (showModal) {
      window.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          setShowModal(false);
        }
      });
    }
  }, [showModal]);

  return ReactDOM.createPortal(
    <div
      className="modal__overlay"
      onClick={(e) => {
        e.stopPropagation();
        if (setShowModal) {
          setShowModal(false);
        }
      }}
    >
      {children}
    </div>,
    document.querySelector("#modal-root")
  );
};

export default Modal;
