import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";

import { connect } from "react-redux";
import { toast } from "react-toastify";

//Actions
import { clearErrors, clearMessages } from "../../redux/actions/userActions";

//Components
import ToastNotification from "./ToastNotification";

const Toast = ({
  errors,
  messages,
  clearErrors,
  clearMessages,
  toastPosition = "bottom-right",
}) => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (
      (errors && Array.isArray(errors) && errors.length > 0) ||
      (messages && Array.isArray(messages) && messages.length > 0)
    ) {
      setToasts([...errors, ...messages]);
    }
    showMessages();
  }, [errors, messages]);

  const showErrors = () => {
    let errorToast = [];
    errors.map((error, index) => {
      errorToast.push(
        <div key={uuidv4()} className="toast toast--error">
          <div className="toast__icon"></div>
          <div>
            <p className="toast__message">{error}</p>
          </div>
        </div>
      );
    });
    // clearErrors();

    return errorToast;
  };

  const showMessages = () => {};

  const showToast = () => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error, {
          position: "top-center",
        });
      });
      //   clearErrors();
    }

    if (messages.length > 0) {
      messages.forEach((message) => {
        toast.success(message, {
          position: "top-center",
        });
      });
      clearMessages();
    }
  };
  return ReactDOM.createPortal(
    <div className={`toast__wrapper toast__wrapper--${toastPosition}`}>
      {toasts &&
        toasts.length > 0 &&
        toasts.map((toast, index) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            toastType={toast.type}
            id={toast.id}
            index={index}
            toastPosition={toastPosition || "top-right"}
          />
        ))}
    </div>,
    document.querySelector("#toast-root")
  );
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
});

const mapDispatchToProps = {
  clearErrors,
  clearMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
