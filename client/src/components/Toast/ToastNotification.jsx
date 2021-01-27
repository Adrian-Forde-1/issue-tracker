import React, { useEffect, useRef } from "react";
import gsap, { CSSPlugin } from "gsap";

//Redux
import { connect } from "react-redux";

//Actions
import { removeError, removeMessage } from "../../redux/actions/userActions";

//SVG
import DangerSVG from "../SVG/DangerSVG.jsx";
import TickSVG from "../SVG/TickSVG.jsx";

gsap.registerPlugin(CSSPlugin);

const ToastNotification = ({
  message,
  toastType,
  id,
  toastPosition,
  index,
  removeError,
  removeMessage,
}) => {
  let toastElement = useRef(null);
  let toastTimer = useRef(null);
  const waitBeforeRemove = 500;

  useEffect(() => {
    if (toastElement !== null && toastTimer !== null) {
      let tl = gsap.timeline({
        onComplete: () => {
          removeToast(id);
        },
      });
      if (toastPosition === "bottom-right" || toastPosition === "top-right") {
        tl.to(toastElement.current, { duration: 0, x: 0, ease: "none" });
      }
      tl.to(toastTimer.current, { duration: 5, width: 0, ease: "none" });
    }

    // switch (toastPosition) {
    //   case "bottom-right":
    //   case "top-right":
    //     console.log("moving");
    //     gsap.to(toastElement.current, { xPercent: 100 });
    //     // gsap.fromTo(toastElement.current, { xPercent: 100 }, { xPercent: 0 });
    //     break;
    //   default:
    //     break;
    // }
  }, [toastElement, toastTimer]);

  const removeToast = (id) => {
    const animateRemove = (cb) => {
      let tl = gsap.timeline({
        onComplete: () => {
          console.log("Removing");
          cb(id);
        },
      });
      tl.to(toastElement.current, {
        x: 700,
        duration: 0.3,
        ease: "none",
      });
    };
    switch (toastType) {
      case "error":
        animateRemove(removeError);
        break;
      case "success":
        animateRemove(removeMessage);
        break;
      default:
        break;
    }
  };
  return (
    <div
      key={id}
      ref={toastElement}
      id={`toast-${id}`}
      style={{ zIndex: `${1000 - index}` }}
      className={`toast__container toast__container--${toastPosition} ${
        toastType === "error"
          ? "toast__container--error"
          : toastType === "success" && "toast__container--success"
      }`}
    >
      <div className="toast__icon">
        {toastType === "error" ? (
          <DangerSVG />
        ) : (
          toastType === "success" && <TickSVG />
        )}
      </div>
      <div className="toast__content">
        <p className="toast__title">
          {toastType === "success" ? "Success" : "Error"}
        </p>
        <p className="toast__message">{message}</p>
      </div>
      <div className="toast__timer" ref={toastTimer}></div>
      <button
        className="toast__close"
        onClick={() => {
          removeToast(id);
        }}
      >
        &times;
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
});

const mapDispatchToProps = {
  removeError,
  removeMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToastNotification);
