import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  getUserProjects,
  setProjectUpdated,
} from '../../redux/actions/projectActions';
import { setErrors, clearErrors } from '../../redux/actions/userActions';

//Components
import SearchBar from '../SearchBar';
import BugPreview from '../Preview/BugPreview';
import DeleteModal from '../DeleteModal';
import SideNav from '../Navigation/SideNav';
import ProjectsGroupsHamburger from '../Navigation/ProjectsGroupsHamburger';

function IndividualProject(props) {
  const [project, changeProject] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const projectId = props.match.params.projectId;

  const handleSearchChange = (e) => {
    sessionStorage.setItem('project-search', e.target.value);
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    sessionStorage.setItem('project-filter', e.target.value);
    setFilter(e.target.value);
  };

  const reRoute = () => {
    props.history.replace('/projects');
  };

  useEffect(() => {
    props.getUserProjects(localStorage.getItem('token'));

    if (sessionStorage.getItem('project-search') !== null) {
      setSearch(sessionStorage.getItem('project-search'));
    }

    if (sessionStorage.getItem('project-filter') !== null) {
      setFilter(sessionStorage.getItem('project-filter'));
    }

    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        changeProject(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error['reponse']) {
          props.setErrors(error);
          props.history.push('/projects');
        }
      });
  }, []);

  useEffect(() => {
    if (props.projectUpdated === true) {
      axios
        .get(`/api/project/${projectId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        })
        .then((response) => {
          changeProject(response.data);
        })
        .catch((error) => {
          props.setErrors(error);
          props.history.push('/projects');
        });

      props.setProjectUpdated(false);
    }
  }, [props.projectUpdated]);

  return (
    <div className="individual-container">
      <SideNav />
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
          <div>
            <h2 className="project-name">
              {project.name}{' '}
              {project.createdBy.toString() === props.user._id.toString() && (
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
                                props.setErrors(error);
                                props.history.push('/projects');
                              });
                          })
                          .catch((error) => {
                            props.setErrors(error);
                            props.history.push('/projects');
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
                                props.setErrors(error);
                                props.history.push('/projects');
                              });
                          })
                          .catch((error) => {
                            props.setErrors(error);
                            props.history.push('/projects');
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
                          reRoute={reRoute}
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
              <Link to={`/project/${project._id}/labels`}>
                Labels <i className="fas fa-tags"></i>
              </Link>
              <Link to={`/project/${project._id}/new/bug`}>
                New Bug <i className="fas fa-bug"></i>
              </Link>
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
      <ProjectsGroupsHamburger />
    </div>
  );
}

const mapDispatchToProps = {
  getUserProjects,
  setErrors,
  clearErrors,
  setProjectUpdated,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  projectUpdated: state.projects.projectUpdated,
  errors: state.user.errors,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IndividualProject));
