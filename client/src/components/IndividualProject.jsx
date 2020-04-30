import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//Component
import SearchBar from './SearchBar';
import BugPreview from './BugPreview';
import DeleteModal from './DeleteModal';
import GoBack from './GoBack';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { getUserProjects } from '../redux/actions/projectActions';
import {
  setCurrentSection,
  setCurrentId,
  setErrors,
  clearErrors,
} from '../redux/actions/userActions';

function IndividualProject(props) {
  const [project, changeProject] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [user, changeUser] = useState({});
  // const projectId = props.match.params.projectId;
  const projectId = props.currentId;

  const handleSearchChange = (e) => {
    sessionStorage.setItem('project-search', e.target.value);
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    sessionStorage.setItem('project-filter', e.target.value);
    setFilter(e.target.value);
  };

  useEffect(() => {
    props.getUserProjects(localStorage.getItem('token'));
    const { user } = props;

    if (sessionStorage.getItem('project-search') !== null) {
      setSearch(sessionStorage.getItem('project-search'));
    }

    if (sessionStorage.getItem('project-filter') !== null) {
      setFilter(sessionStorage.getItem('project-filter'));
    }

    changeUser(user);
  }, []);

  useEffect(() => {
    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        changeProject(response.data);
      })
      .catch((error) => {
        props.setErrors(error);
        props.setCurrentSection('');
        props.setCurrentId('');
      });
  }, []);
  return (
    <div className="individual-container">
      <GoBack
        section={
          project.archived === false
            ? project.group
              ? 'group'
              : ''
            : project.group
            ? 'group/archived'
            : 'project/archived'
        }
        id={project.group ? `${project.group}` : ''}
      />
      <div className="containers">
        <div className="search-and-filter">
          <SearchBar
            onChange={handleSearchChange}
            search={search}
            extraClass="search-extra-info"
          />
          {/* <div className="select-container">
            <select name="" id="" value={filter} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="New Bug">New Bug</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div> */}
        </div>
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
        {props.errors !== null &&
          props.errors['bug'] &&
          !toast.isActive('bugtoast') &&
          toast(props.errors.bug, {
            toastId: 'bugtoast',
            type: 'error',
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            onClose: () => {
              props.clearErrors();
            },
          })}

        {Object.keys(project).length > 0 && (
          <div className="container-fluid">
            <h2 className="project-name">
              {project.name}{' '}
              {project.createdBy.toString() === user._id.toString() && (
                <span>
                  <i
                    className={`fas fa-archive ${
                      project.archived === true && 'remove-archive-sign'
                    }`}
                    onClick={() => {
                      if (project.archived === false) {
                        axios
                          .put(
                            `/api/project/${project._id}/archive/add`,
                            null,
                            {
                              headers: {
                                Authorization: localStorage.getItem('token'),
                              },
                            }
                          )
                          .then(() => {
                            axios
                              .get(`/api/project/${projectId}`, {
                                headers: {
                                  Authorization: localStorage.getItem('token'),
                                },
                              })
                              .then((response) => {
                                changeProject(response.data);
                              })
                              .catch((error) => {
                                props.setErrors(error.response.data);
                                props.setCurrentSection('');
                                props.setCurrentId('');
                              });
                          })
                          .catch((error) => {
                            props.setErrors(error.response.data);
                            props.setCurrentSection('');
                            props.setCurrentId('');
                          });
                      } else {
                        axios
                          .put(
                            `/api/project/${project._id}/archive/remove`,
                            null,
                            {
                              headers: {
                                Authorization: localStorage.getItem('token'),
                              },
                            }
                          )
                          .then(() => {
                            axios
                              .get(`/api/project/${projectId}`, {
                                headers: {
                                  Authorization: localStorage.getItem('token'),
                                },
                              })
                              .then((response) => {
                                changeProject(response.data);
                              })
                              .catch((error) => {
                                props.setErrors(error.response.data);
                                props.setCurrentSection('');
                                props.setCurrentId('');
                              });
                          })
                          .catch((error) => {
                            props.setErrors(error.response.data);
                            props.setCurrentSection('');
                            props.setCurrentId('');
                          });
                      }
                    }}
                  ></i>
                  <i
                    className="far fa-trash-alt"
                    onClick={() => {
                      const element = document.createElement('div');
                      element.classList.add('modal-element');
                      document
                        .querySelector('#modal-root')
                        .appendChild(element);
                      ReactDOM.render(
                        <DeleteModal
                          item={project}
                          type={'project'}
                          groupId={project.group}
                        />,
                        element
                      );
                    }}
                  ></i>
                </span>
              )}
            </h2>
            <p className="project-description">{project.description}</p>

            <div className="action-bar">
              <button
                onClick={() => {
                  props.setCurrentSection('project/labels');
                  props.setCurrentId(project._id);
                }}
              >
                Labels <i className="fas fa-tags"></i>
              </button>
              <button
                onClick={() => {
                  props.setCurrentSection('project/bug/new');
                  props.setCurrentId(project._id);
                }}
              >
                New Bug <i className="fas fa-bug"></i>
              </button>
            </div>
            <div className="bugs">
              {project.bugs &&
                project.bugs.length > 0 &&
                project.bugs.map((bug, index) =>
                  filter === 'All' ? (
                    search === '' ? (
                      <BugPreview
                        bug={bug}
                        index={index}
                        projectId={project._id}
                        key={index}
                      />
                    ) : (
                      bug.name.toLowerCase().indexOf(search.toLowerCase()) >
                        -1 && (
                        <BugPreview
                          bug={bug}
                          index={index}
                          projectId={project._id}
                          key={index}
                        />
                      )
                    )
                  ) : (
                    bug.status.name === filter &&
                    (search === '' ? (
                      <BugPreview
                        bug={bug}
                        index={index}
                        projectId={project._id}
                        key={index}
                      />
                    ) : (
                      bug.name.toLowerCase().indexOf(search.toLowerCase()) >
                        -1 && (
                        <BugPreview
                          bug={bug}
                          index={index}
                          projectId={project._id}
                          key={index}
                        />
                      )
                    ))
                  )
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getUserProjects,
  setCurrentSection,
  setCurrentId,
  setErrors,
  clearErrors,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  errors: state.user.errors,
  currentId: state.user.currentId,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IndividualProject));
