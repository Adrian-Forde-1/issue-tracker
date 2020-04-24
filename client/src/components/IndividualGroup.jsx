import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//Components
import SearchBar from './SearchBar';
import GoBack from './GoBack';

//React Router DOM
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import AllGroupProjects from './AllGroupProjects';
import DeleteModal from './DeleteModal';

//Actions
import { clearErrors } from '../redux/actions/userActions';
import { setProjects } from '../redux/actions/projectActions';

function IndividualGroup(props) {
  const [group, changeGroup] = useState({});
  const [search, setSearch] = useState('');
  const groupId = props.match.params.groupId;

  useEffect(() => {
    var fetchGroup = [...props.groups];
    fetchGroup = fetchGroup.find(
      (group) => group._id.toString() === groupId.toString()
    );

    if (fetchGroup !== null) {
      props.setProjects(fetchGroup.projects);
      changeGroup(fetchGroup);
    }
  }, [props.groups]);

  const handleSearchChange = (e) => {
    sessionStorage.setItem('project-search', e.target.value);
    setSearch(e.target.value);
  };

  return (
    <div className="group-container">
      <GoBack />
      <div className="container">
        {props.errors !== null &&
          props.errors['project'] &&
          !toast.isActive('projecttoast') &&
          toast(props.errors.project, {
            toastId: 'projecttoast',
            type: 'error',
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            onClose: () => {
              props.clearErrors();
            },
          })}
        {Object.keys(group).length > 0 && (
          <div>
            <h2 className="group-name">{group.name}</h2>
            <p className="group-id">
              <span>Id: </span>
              {group._id}
            </p>
            <SearchBar onChange={handleSearchChange} search={search} />
            <div className="action-bar">
              {group.createdBy.toString() === props.user._id.toString() ? (
                <button
                  className="project-leave-delete"
                  onClick={() => {
                    const element = document.createElement('div');
                    element.classList.add('modal-element');
                    document.querySelector('#modal-root').appendChild(element);
                    ReactDOM.render(
                      <DeleteModal
                        item={group}
                        type={'group'}
                        history={props.history}
                      />,
                      element
                    );
                  }}
                >
                  Delete <i className="far fa-trash-alt"></i>
                </button>
              ) : (
                <button
                  className="project-leave-delete"
                  onClick={() => {
                    axios
                      .put(`/api/leave/group/${groupId}`, null, {
                        headers: {
                          Authorization: localStorage.getItem('token'),
                        },
                      })
                      .then(() => {
                        props.history.goBack();
                      });
                  }}
                >
                  Leave <i className="fas fa-door-open"></i>
                </button>
              )}
            </div>
            <AllGroupProjects search={search} />
          </div>
        )}
      </div>
      <Link to={`/group/${groupId}/project/create`} className="action-btn">
        <i className="fas fa-plus"></i>
      </Link>
    </div>
  );
}

const mapDispatchToProps = {
  setProjects,
  clearErrors,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  groups: state.groups.groups,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(IndividualGroup);
