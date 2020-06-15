import React, { useEffect, useState } from 'react';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from '../../redux/actions/modalActions';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

function BugPreview(props) {
  const { bug, index, labels, projectId } = props;

  const [bugLabels, setBugLabels] = useState([]);

  useEffect(() => {
    // console.log(bug.labels);
    var newLabels = [];
    if (labels) {
      if (labels.length > 0) {
        labels.forEach((label) => {
          if (bug.labels.includes(label._id)) {
            newLabels.push(label);
          }
        });
      }
    }
    setBugLabels(newLabels);
  }, []);

  const deleteModal = () => {
    props.setDeleteItem(bug);
    props.setItemType('bug');
    props.setCurrentLocation(props.history.location.pathname.split('/'));
    props.showModal();
  };

  return (
    <div className="bug-preview-container">
      <div>
        <div className="bug-preview">
          <div className="bug-preview-first-div">
            <Link
              to={`/project/${bug.project}/bug/${bug._id}`}
              className="bug-name"
            >
              {bug.name}
            </Link>
            {bug['labels'] &&
              bugLabels.length > 0 &&
              bugLabels.map((label, index) => {
                if (index > 2) {
                  return null;
                } else {
                  return (
                    <div
                      style={{
                        background: `${label.color}`,
                        textAlign: 'center',
                      }}
                      className="bug-label"
                      id={`bug-label-${index}`}
                      key={index}
                    >
                      {label.name}
                    </div>
                  );
                }
              })}
            {bug.status.name === 'New Bug' ? (
              <span className="bug-status" id={`bug-status-${index}`}>
                <i
                  style={{ color: `${bug.status.color}` }}
                  className="fas fa-exclamation"
                ></i>
              </span>
            ) : bug.status.name === 'Work In Progress' ? (
              <span className="bug-status" id={`bug-status-${index}`}>
                <i
                  style={{ color: `${bug.status.color}` }}
                  className="fas fa-truck-loading"
                ></i>
              </span>
            ) : (
              <span className="bug-status" id={`bug-status-${index}`}>
                <i
                  style={{ color: `${bug.status.color}` }}
                  className="fas fa-check"
                ></i>
              </span>
            )}
          </div>
          <div className="bug-preview-second-div">
            <p className="bug-description">{bug.description}</p>
            <i className="far fa-trash-alt" onClick={deleteModal}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

export default connect(null, mapDispatchToProps)(withRouter(BugPreview));
