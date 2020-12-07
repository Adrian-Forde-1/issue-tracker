import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

//Actions
import { clearErrors, clearMessages } from "../../redux/actions/userActions";

const ToastComponent = ({ errors, messages, clearErrors, clearMessages }) => {
  useEffect(() => {
    if ((errors && errors.length > 0) || (messages && messages.length > 0))
      showToast();
  }, [errors, messages]);

  const showToast = () => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
      clearErrors();
    }

    if (messages.length > 0) {
      messages.forEach((message) => {
        toast.success(message);
      });
      clearMessages();
    }
  };
  return null;
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
});

const mapDispatchToProps = {
  clearErrors,
  clearMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToastComponent);
