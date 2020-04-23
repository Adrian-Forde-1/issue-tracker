import React, { useEffect } from 'react';

//React Router DOM
import { Link } from 'react-router-dom';

function BugPreview(props) {
  const { bug, index, projectId } = props;

  return (
    <div className="bug-preview-container">
      <Link to={`/bug/${bug._id}`}>
        <div className="bug-preview">
          <p className="bug-name">{bug.name}</p>
          <p className="bug-description">{bug.description}</p>
          <span
            style={{ background: `${bug.label.color}` }}
            className="bug-label"
            id={`bug-label-${index}`}
          >
            {bug.label.name}
          </span>
        </div>
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
      </Link>
    </div>
  );
}

export default BugPreview;
