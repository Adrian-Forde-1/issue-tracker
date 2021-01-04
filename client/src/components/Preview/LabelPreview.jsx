import React, { useEffect } from "react";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actiosn
import { getUserProjects } from "../../redux/actions/projectActions";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";

const LabelPreview = (props) => {
  const { label, index, projectId, getProject, team } = props;

  const deleteLabel = () => {
    axios.delete(`/api/project/${projectId}/label/${label._id}`).then(() => {
      props.getUserProjects(localStorage.getItem("token"));
      getProject();
    });
  };
  return (
    <div
      className="label__preview"
      style={{ background: `${label.backgroundColor}` }}
    >
      <div className="label__preview-name">
        <span style={{ color: `${label.fontColor}` }}>{label.name}</span>
      </div>

      <div className="label__preview-actions">
        <div>
          <Link
            to={`${
              team !== null ? "/team/project/" : "/project/"
            }${projectId}/label/${label._id}/edit`}
          >
            <Tooltip title="Edit Label" position="bottom" size="small">
              <EditSVG />
            </Tooltip>
          </Link>
        </div>

        <div onClick={deleteLabel}>
          <Tooltip title="Delete Label" position="bottom" size="small">
            <TrashSVG />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  getUserProjects,
};

export default connect(null, mapDispatchToProps)(withRouter(LabelPreview));
