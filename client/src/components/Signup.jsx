import React, { useState, useEffect } from "react";

//React Router Dom
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { signUpUser } from "../redux/actions/userActions";

//Images
import programmingImg from "../resources/Images/programmingImg.jpg";
import programmingImg2X from "../resources/Images/programmingImg2X.jpg";
import programmingImg3X from "../resources/Images/programmingImg3X.jpg";

//Components
import LogoSVG from "./SVG/LogoSVG";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (props.authenticated === true) props.history.goBack();
    // this.usernameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: username.toString().toLowerCase(),
      email: email.toString().toLowerCase(),
      password: password,
      confirmPassword: confirmPassword,
    };

    props.signUpUser(user, props.history);
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
                  Username
                </div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {props.errors.username && (
                  <div className="auth-form__error">
                    {props.errors.username}
                  </div>
                )}
              </div>
              <div className="auth-form__input-container">
                <div className="auth-form__input-container__input-name">
                  Email
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {props.errors.email && (
                  <div className="auth-form__error">{props.errors.email}</div>
                )}
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
                {props.errors.password && (
                  <div className="auth-form__error">
                    {props.errors.password}
                  </div>
                )}
              </div>
              <div className="auth-form__input-container">
                <div className="auth-form__input-container__input-name">
                  Confirm Password
                </div>
                <input
                  type="password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {props.errors.confirmPassword && (
                  <div className="auth-form__error">
                    {props.errors.confirmPassword}
                  </div>
                )}
              </div>
              <button className="auth-form__submit-btn">Sign Up</button>
            </form>
            <div className="auth-form__no-account">
              Already have an account? Try <Link to="/login">Logging in!</Link>
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
  signUpUser,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
