import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const ToastComponent = ({ errors, messages }) => {
  useEffect(() => {
    if ((errors && errors.length > 0) || (messages && messages.length > 0))
      showToast();
  }, [errors, messages]);

  const showToast = () => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
    }

    if (messages.length > 0) {
      messages.forEach((message) => {
        toast.success(message);
      });
    }
  };
  return null;
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
});

export default connect(mapStateToProps)(ToastComponent);
