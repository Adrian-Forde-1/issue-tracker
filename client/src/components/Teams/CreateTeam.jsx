import React, { useState, useEffect } from "react";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

const CreateTeam = (props) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    props.setCurrentTeam("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    var teamName = name;
    teamName = teamName.charAt(0).toUpperCase() + teamName.slice(1);

    const team = {
      name: teamName,
      password: password,
    };

    axios
      .post("/api/team", { team: team })
      .then((res) => {
        if (res && res.data) props.setMessages(res.data);

        props.getTeams();
        props.history.goBack();
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          props.setErrors(err);
          props.history.goBack();
        }
      });
  };
  return (
    <div className="standard-form__wrapper">
      <div className="standard-form__header">
        <h2>Create Team</h2>
      </div>
      <div className="standard-form__body">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="standard-form__input-container">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
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
          <button>Create</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(null, mapDispatchToProps)(CreateTeam);
