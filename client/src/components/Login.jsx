import React, { useState, useEffect, useRef } from "react";

//Tostify
import { toast } from "react-toastify";

//React Router Dom
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { loginUser } from "../redux/actions/userActions";

//Images
import programmingImg from "../resources/Images/programmingImg.jpg";
import programmingImg2X from "../resources/Images/programmingImg2X.jpg";
import programmingImg3X from "../resources/Images/programmingImg3X.jpg";

//Components
import LogoSVG from "./SVG/LogoSVG";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let emailRef = useRef(null);

  useEffect(() => {
    if (props.authenticated === true) props.history.goBack();
    emailRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: email.toString().toLowerCase(),
      password: password,
    };

    props.loginUser(user, props.history);
  };

  if (props.authenticated === false) {
    return (
      <div className="auth-form__wrapper">
        <div className="auth-form__left-section">
          <div className="auth-form__left-section__logo-container">
            <LogoSVG />
          </div>
          <div className="auth-form__left-section__form-container">
            <form onSubmit={handleSubmit}>
              <div className="auth-form__input-container">
                <div className="auth-form__input-container__input-name">
                  Email
                </div>
                <input
                  type="email"
                  ref={emailRef}
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="auth-form__input-container">
                <div className="auth-form__input-container__input-name">
                  Password
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="auth-form__submit-btn">Login</button>
            </form>
            <div className="auth-form__no-account">
              Dont have an account? Try <Link to="/signup">Signing up!</Link>
            </div>
          </div>
        </div>
        <div className="auth-form__right-section">
          <div className="auth-form__right-section__img-filter"></div>
          <img
            srcSet={`${programmingImg} 1x, ${programmingImg2X} 2x, ${programmingImg3X} 3x`}
            alt="Code on laptop with books to left of the laptop"
          />
          <div className="auth-form__right-section-content">
            <h1>Track What Matters</h1>
            <h1>Enhance Communication</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et <br />
              lacus tellus massa pretium phasellus nunc suspendisse <br />
              enim. Sed consequat nec sed proin sed convallis tortor <br />
              mattis.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const mapDispatchToProps = {
  loginUser,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
