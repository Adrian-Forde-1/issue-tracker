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
import {
  clearErrors,
  setErrors,
  setCurrentSection,
  setCurrentId,
} from '../redux/actions/userActions';
import { setProjects } from '../redux/actions/projectActions';

function IndividualGroup(props) {
  const [group, changeGroup] = useState({});
  const [search, setSearch] = useState('');
  const groupId = props.currentId;

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
    <div className="individual-container">
      <GoBack secion="" id="" />
      <div className="container">
        <SearchBar onChange={handleSearchChange} search={search} />
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
            <h2 className="group-name">
              {group.name}{' '}
              {group.createdBy.toString() === props.user._id.toString() ? (
                <i
                  className="far fa-trash-alt"
                  onClick={() => {
                    const element = document.createElement('div');
                    element.classList.add('modal-element');
                    document.querySelector('#modal-root').appendChild(element);
                    ReactDOM.render(
                      <DeleteModal item={group} type={'group'} />,
                      element
                    );
                  }}
                ></i>
              ) : (
                <i
                  className="fas fa-door-open"
                  onClick={() => {
                    axios
                      .put(`/api/leave/group/${groupId}`, null, {
                        headers: {
                          Authorization: localStorage.getItem('token'),
                        },
                      })
                      .then(() => {
                        props.setCurrentSection('');
                        props.setCurrentId('');
                      })
                      .catch((error) => {
                        props.setErrors(error.response.data);
                        props.setCurrentSection('');
                        props.setCurrentId('');
                      });
                  }}
                ></i>
              )}
            </h2>
            <p className="group-id">
              <span>Id: </span>
              {group._id}
            </p>
            <div className="action-bar"></div>
            <AllGroupProjects search={search} />
          </div>
        )}
      </div>
      <i
        className="fas fa-plus-square action-btn"
        onClick={() => {
          props.setCurrentSection('group/create/project');
          props.setCurrentId(group._id);
        }}
      ></i>
    </div>
  );
}

const mapDispatchToProps = {
  setProjects,
  setErrors,
  clearErrors,
  setCurrentSection,
  setCurrentId,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  groups: state.groups.groups,
  errors: state.user.errors,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(IndividualGroup);
