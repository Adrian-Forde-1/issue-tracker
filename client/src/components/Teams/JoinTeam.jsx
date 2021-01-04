import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

const JoinTeam = (props) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    props.setCurrentTeam("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const team = {
      teamId: id,
      password: password,
    };

    axios
      .post("/api/join/team", { team: team })
      .then((res) => {
        if (res && res.data) {
          props.setMessages(res.data);
          props.getTeams();
          props.history.push("/team");
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          props.setErrors(err);
        }
      });
  };
  return (
    <div className="standard-form__wrapper">
      <div className="standard-form__header">
        <h2>Join Team</h2>
      </div>
      <div className="standard-form__body">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="standard-form__input-container">
            <label htmlFor="name">Id</label>
            <input
              type="text"
              name="name"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
          </div>
          <div className="standard-form__input-container">
            <label htmlFor="password">Passowrd</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button>Join</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinTeam);
