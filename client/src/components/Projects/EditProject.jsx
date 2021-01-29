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

//Components
import Spinner from "../Misc/Spinner/Spinner";

const EditProject = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProject();
  }, []);

  const getProject = () => {
    const projectId = props.match.params.projectId;
    setIsLoading(true);
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

            setName(response.data.name);
            setDescription(response.data.description);
            setProject(response.data);
          }
        } else {
          props.setMessages(["Something went wrong"]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const project = {
      name: name,
      description: description,
    };

    axios
      .put(`/api/project/${props.match.params.projectId}`, { project: project })
      .then((res) => {
        if (res && res.data) {
          props.setMessages(res.data);
          props.history.goBack();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  if (Object.keys(project).length > 0) {
    return (
      <div className="standard-form__wrapper">
        <div className="standard-form__header">
          <h2>Edit Project</h2>
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
                <button>Edit Project</button>
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
  } else if (isLoading) return <Spinner />;
  else return null;
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(null, mapDispatchToProps)(EditProject);

{
  /* <div>
        {Object.keys(this.state.project).length > 0 && (
          <div className="form-container no-top-nav ">
            <div className="container p-l-175-0">
              <div className="auth-form">
                <h2>Edit Project</h2>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <br />
                    <textarea
                      type="text"
                      name="description"
                      maxLength="500"
                      value={this.state.description}
                      onChange={this.handleChange}
                      required
                    />
                  </div>

                  <button className="submit-btn">Edit Project</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div> */
}
