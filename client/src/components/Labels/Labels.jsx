import React, { useEffect, useState } from "react";
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { clearErrors } from "../../redux/actions/userActions";

//SVG
import PlusSVG from "../SVG/PlusSVG";

//Components
import LabelPreview from "../Preview/LabelPreview";
import Spinner from "../Misc/Spinner/Spinner";

function Labels(props) {
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const projectId = props.match.params.projectId;

  useEffect(() => {
    getProject();
  }, [props.projects]);

  const getProject = () => {
    setIsLoading(true);
    axios
      .get(`/api/project/${projectId}`)
      .then((response) => {
        if (response && response.data) {
          setProject(response.data);
          if (props.location.pathname.indexOf("team") > -1) {
            props.setCurrentTeam(response.data.team);
          } else {
            props.setCurrentProject(response.data._id);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          props.setErrors(err);
        }
        setIsLoading(false);
      });
  };
  return (
    <div className="label__wrapper label__wrapper--no-padding">
      <div className="label__header">
        <div className="label__name">
          <h2>Labels</h2>
        </div>
        <div className="label__header-actions">
          <Link
            to={`${project.team !== null ? "/team/project/" : "/project/"}${
              project._id
            }/new/label`}
          >
            <Tooltip title="Add Label" position="bottom" size="small">
              <PlusSVG />
            </Tooltip>
          </Link>
        </div>
      </div>
      {Object.keys(project).length > 0 ? (
        <div className="label__label-container">
          {project.labels.map((label, index) => (
            <LabelPreview
              label={label}
              index={index}
              projectId={project._id}
              team={project.team}
              key={index}
              getProject={getProject}
            />
          ))}
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : null}
    </div>
  );
}

const mapDispatchToProps = {
  clearErrors,
};

const mapStateToProps = (state) => ({
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
