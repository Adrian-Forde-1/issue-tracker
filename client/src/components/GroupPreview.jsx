import React from 'react';
import ReactDOM from 'react-dom';

//Components
import DeleteModal from './DeleteModal';

//React Router DOM
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

function GroupPreview(props) {
  const { group } = props;
  return (
    <div className="preview">
      <Link to={`/group/${group._id}`}>
        <h2>{group.name}</h2>
        <br />
        <p>{group.description}</p>
      </Link>
      <button
        className="delete-btn"
        onClick={() => {
          const element = document.createElement('div');
          element.classList.add('modal-element');
          document.querySelector('#modal-root').appendChild(element);
          ReactDOM.render(
            <DeleteModal item={group} type={'group'} history={null} />,
            element
          );
        }}
      >
        <i className="far fa-trash-alt"></i>
      </button>
    </div>
  );
}

export default withRouter(GroupPreview);
