import React, { useEffect, useState } from "react";
import { generateColor } from "../../util/generateColor";
import axios from "axios";

//Actions
import { getUserProjects } from "../../redux/actions/projectActions";
import { setMessages, setErrors } from "../../redux/actions/userActions";
import { connect } from "react-redux";

const AddLabel = (props) => {
  const labelFontColors = {
    White: "#fff",
    Black: "#000000",
  };

  const colorArray = [
    "#A020F0",
    "#CB410B",
    "#FFAA1D",
    "#891446",
    "#0989AC",
    "#a72608",
    "#3e1929",
    "#a71d31",
    "#619b8a",
    "#7fd8be",
    "#083d77",
    "#2d1e2f",
    "#e83f6f",
    "#2274a5",
    "#32936f",
  ];

  const [name, setName] = useState("New Label");
  const [fontColor, setFontColor] = useState(labelFontColors.White);
  const [bgColor, setBgColor] = useState("#A020F0");

  useEffect(() => {
    const projectId = props.match.params.projectId;

    axios
      .get(`/api/project/${projectId}`)
      .then((response) => {
        if (response && response.data) {
          if (
            (response.data.team !== null &&
              props.location.pathname.toString().indexOf("team") === -1) ||
            (response.data.team === null &&
              props.location.pathname.toString().indexOf("team") > -1)
          ) {
            props.history.goBack();
          } else {
            if (props.location.pathname.toString().indexOf("team") > -1)
              props.setCurrentTeam(response.data.team);
            else props.setCurrentProject(response.data._id);
          }
        } else {
          props.setErrors(["Something went wrong"]);
        }
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/project");
      });
  }, []);

  const sendRequest = (e) => {
    e.preventDefault();

    const projectId = props.match.params.projectId;

    const label = {
      name: name,
      fontColor: fontColor,
      backgroundColor: bgColor,
    };

    axios
      .post(`/api/project/${projectId}/label/create`, { label: label })
      .then((response) => {
        if (response && response.data) {
          props.setMessages(response.data);
          setName("New Label");
          setBgColor("#A020F0");
          setFontColor(labelFontColors.White);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
        }
      });
  };

  return (
    <div className="standard-form__wrapper">
      <div className="standard-form__header">
        <h2>Add Label</h2>
      </div>
      <div className="standard-form__body standard-form__body--no-padding">
        <div className="standard-form__split-double">
          <section>
            <div className="standard-form__input-container">
              <label htmlFor="name">Label Name</label>
              <input
                type="text"
                name="name"
                className="standard-form__input"
                maxLength="15"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>
            <div className="standard-form__input-container">
              <label htmlFor="">Font Color</label>
              <div className="label__font-color-container">
                <div
                  className={`label__font-color ${
                    fontColor === labelFontColors.White && "selected"
                  }`}
                  id="white-font"
                  style={{ background: "#fff" }}
                  onClick={() => {
                    setFontColor(labelFontColors.White);
                  }}
                ></div>
                <div
                  className={`label__font-color ${
                    fontColor === labelFontColors.Black && "selected"
                  }`}
                  id="black-font"
                  style={{ background: "#000000" }}
                  onClick={() => {
                    setFontColor(labelFontColors.Black);
                  }}
                ></div>
              </div>
            </div>
            <div className="standard-form__input-container">
              <label htmlFor="name">Background Color</label>
              <div className="label__background-colors-container">
                {colorArray.map((color, index) => (
                  <div
                    key={index}
                    className={`label__background-color ${
                      bgColor === color && "selected"
                    }`}
                    style={{ background: `${color}` }}
                    onClick={() => {
                      setBgColor(color);
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <button
              className="standard-form__submit-btn"
              onClick={(e) => {
                sendRequest(e);
              }}
            >
              Add Label
            </button>
          </section>
          <section>
            <div className="label__new-label-preview-container">
              <div
                className="label__new-label-preview"
                style={{ background: `${bgColor}` }}
              >
                <span style={{ color: `${fontColor}` }}>{name}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const mapDisptchToProps = {
  setMessages,
  setErrors,
  getUserProjects,
};

export default connect(null, mapDisptchToProps)(AddLabel);
