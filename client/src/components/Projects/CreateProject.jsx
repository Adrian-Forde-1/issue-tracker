import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//SVG
import InfoSVG from "../SVG/InfoSVG";

const CreateProject = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (props.location.pathname.indexOf("team") > -1)
      props.setCurrentTeam(props.match.params.teamId);
    else props.setCurrentProject("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const teamId = props.match.params.teamId;

    const project = {
      name: name,
      description: description,
      teamId,
    };

    axios
      .post("/api/project", { project: project })
      .then((res) => {
        if (res && res.data) {
          props.setMessages(res.data);
          props.getProjects();
          props.history.goBack();
        }
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.goBack();
      });
  };
  return (
    <div className="standard-form__wrapper">
      <div className="standard-form__header">
        <h2>Create Project</h2>
      </div>
      <div className="standard-form__body standard-form__body--no-padding">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="standard-form__split-double">
            <section>
              <div className="standard-form__input-container">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="standard-form__input-container standard-form__input-container--fill">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  className="standard-form__input-container-textarea standard-form__input-container-textarea--fill"
                  name="description"
                  maxLength="500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div
                  className={`standard-form__input-container__description-info`}
                >
                  <Tooltip
                    title="You can use markdown in your description"
                    position="bottom"
                    size="small"
                  >
                    <InfoSVG />
                  </Tooltip>
                </div>
              </div>
              <button>Create Project</button>
            </section>
            <section>
              <div className="standard-form__preview-view">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(null, mapDispatchToProps)(CreateProject);
