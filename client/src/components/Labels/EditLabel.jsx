import React, { useEffect, useState } from "react";
import { generateColor } from "../../util/generateColor";
import axios from "axios";

//React Router DOM
import { withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//Components

const EditLabel = (props) => {
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

  const [name, setName] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [project, setProject] = useState({});

  useEffect(() => {
    getLabel();
  }, []);

  const getLabel = () => {
    const projectId = props.match.params.projectId;
    const labelId = props.match.params.labelId;

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

            var label = response.data.labels.find(
              (label) => label._id.toString() === labelId.toString()
            );
            setProject(response.data);
            setName(label.name);
            setBgColor(label.backgroundColor);
            setFontColor(label.fontColor);
          }
        } else {
          props.setErrors(["Something went wrong"]);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const sendRequest = (e) => {
    e.preventDefault();

    const projectId = props.match.params.projectId;
    const labelId = props.match.params.labelId;

    const label = {
      name: name,
      fontColor: fontColor,
      backgroundColor: bgColor,
    };

    axios
      .put(`/api/project/${projectId}/label/${labelId}/edit`, { label: label })
      .then((response) => {
        props.setMessages(response.data);
        props.history.goBack();
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
        }
      });
  };

  if (Object.keys(project).length > 0) {
    return (
      <div className="standard-form__wrapper">
        <div className="standard-form__header">
          <h2>Edit Label</h2>
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
                Edit Label
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
  } else return null;
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

const mapStateToProps = (state) => ({
  extraIdInfo: state.user.extraIdInfo,
  projects: state.projects.projects,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditLabel));
