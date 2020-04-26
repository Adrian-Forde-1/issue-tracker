import React from 'react';
import ReactDOM from 'react-dom';

//Components
import DeleteModal from './DeleteModal';

//Redux
import { connect } from 'react-redux';

//Actions
import { setCurrentId, setCurrentSection } from '../redux/actions/userActions';

function GroupPreview(props) {
  const { group } = props;
  return (
    <div className="preview">
      {/* <Link to={`/group/${group._id}`}>
        <h6>{group.name}</h6>
      </Link> */}

      <button
        onClick={() => {
          props.setCurrentSection('group');
          props.setCurrentId(group._id);
        }}
      >
        {group.name}
      </button>
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

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
};

export default connect(null, mapDispatchToProps)(GroupPreview);
