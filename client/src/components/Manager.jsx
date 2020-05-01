import React, { Component } from 'react';

//Resources
import bugLogoWhite from '../resources/Images/Bug_Logo_White.svg';

//Tostify
import { toast } from 'react-toastify';

//Components
import AllProjects from './AllProjects';
import AllGroups from './AllGroups';
import SearchBar from './SearchBar';
import IndividualProject from './IndividualProject';
import IndividualGroup from './IndividualGroup';
import IndividualBug from './IndividualBug';
import Labels from './Labels';
import AddLabel from './AddLabel';
import EditLabel from './EditLabel';
import NewBug from './NewBug';
import CreateProject from './CreateProject';
import CreateGroup from './CreateGroup';
import CreateGroupProject from './CreateGroupProject';
import ArchivedProjects from './ArchivedProjects';
import EditBug from './EditBug';
import ArchivedGroupProjects from './ArchivedGroupProjects';
import JoinGroup from './JoinGroup';

//React Router Dom
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  logoutUser,
  clearErrors,
  clearCurrentSectionAndId,
  setCurrentSection,
  setCurrentId,
} from '../redux/actions/userActions';

class Manager extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.changeSectionAndId = this.changeSectionAndId.bind(this);

    this.state = {
      section: 'projects',
      search: '',
    };
  }

  componentDidMount() {
    if (this.props.user !== null) {
      this.props.clearCurrentSectionAndId();
      document
        .querySelector('#groups-btn')
        .classList.remove('selected-section');
      document.querySelector('#projects-btn').classList.add('selected-section');
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changeSectionAndId(section, id) {
    this.setState({
      section: section,
      id: id,
    });
  }

  render() {
    if (this.props.user) {
      return (
        <div className="manager">
          {this.props.errors !== null &&
            this.props.errors['project'] &&
            !toast.isActive('projecttoast') &&
            toast(this.props.errors.project, {
              toastId: 'projecttoast',
              type: 'error',
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              onClose: () => {
                this.props.clearErrors();
              },
            })}
          {this.props.errors !== null &&
            this.props.errors['group'] &&
            !toast.isActive('grouptoast') &&
            toast(this.props.errors.group, {
              toastId: 'grouptoast',
              type: 'error',
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              onClose: () => {
                this.props.clearErrors();
              },
            })}

          <div className="manager-side-nav">
            <Link to="/">
              <img src={bugLogoWhite} alt="" />
            </Link>
            <ul>
              <li
                id="projects-btn"
                onClick={() => {
                  this.setState({
                    section: 'projects',
                  });

                  this.props.clearCurrentSectionAndId();

                  document
                    .querySelector('#groups-btn')
                    .classList.remove('selected-section');
                  document
                    .querySelector('#projects-btn')
                    .classList.add('selected-section');
                }}
              >
                Projects
              </li>
              <li
                id="groups-btn"
                onClick={() => {
                  this.setState({
                    section: 'groups',
                  });

                  this.props.clearCurrentSectionAndId();

                  document
                    .querySelector('#projects-btn')
                    .classList.remove('selected-section');
                  document
                    .querySelector('#groups-btn')
                    .classList.add('selected-section');
                }}
              >
                Groups
              </li>
            </ul>
          </div>
          <div className="manager-content">
            {this.props.currentSection === '' && (
              <i
                className="fas fa-caret-square-right manager-hamburger"
                onClick={() => {
                  document
                    .querySelector('.manager-hamburger')
                    .classList.toggle('nav-open');
                  document
                    .querySelector('.manager-side-nav')
                    .classList.toggle('nav-open');
                }}
              ></i>
            )}

            {this.props.currentSection === '' && (
              <SearchBar
                onChange={this.onChange}
                search={this.state.search}
                extraClass={'manager-search'}
              />
            )}
            <div className="manager-section">
              {this.state.section === 'projects' &&
                this.props.currentSection === '' && (
                  <div className="manager-section-container">
                    <h3>Projects</h3>
                    <AllProjects
                      search={this.state.search}
                      changeSectionAndId={this.changeSectionAndId}
                    />
                  </div>
                )}
              {this.state.section === 'groups' &&
                this.props.currentSection === '' && (
                  <div className="manager-section-container">
                    <h3>Groups</h3>
                    <AllGroups search={this.state.search} />
                  </div>
                )}

              {/* Project */}
              {this.props.currentSection === 'project' &&
                this.props.currentId !== '' && <IndividualProject />}
              {this.props.currentSection === 'project/label/create' &&
                this.props.currentId !== '' && <AddLabel />}
              {this.props.currentSection === 'project/label/edit' &&
                this.props.currentId !== '' && <EditLabel />}
              {this.props.currentSection === 'project/bug/new' &&
                this.props.currentId !== '' && <NewBug />}
              {this.props.currentSection === 'project/bug/edit' &&
                this.props.currentId !== '' && <EditBug />}
              {this.props.currentSection === 'project/labels' &&
                this.props.currentId !== '' && <Labels />}
              {this.props.currentSection === 'project/create' && (
                <CreateProject />
              )}
              {this.props.currentSection === 'project/archived' && (
                <ArchivedProjects search={this.state.search} />
              )}

              {/* Bug */}
              {this.props.currentSection === 'bug' &&
                this.props.currentId !== '' && <IndividualBug />}

              {/* Group */}
              {this.props.currentSection === 'group/create' && <CreateGroup />}
              {this.props.currentSection === 'group/join' && <JoinGroup />}
              {this.props.currentSection === 'group/create/project' &&
                this.props.currentId !== '' && <CreateGroupProject />}
              {this.props.currentSection === 'group' &&
                this.props.currentId !== '' && <IndividualGroup />}
              {this.props.currentSection === 'group/archived' &&
                this.props.currentId !== '' && <ArchivedGroupProjects />}
            </div>
          </div>
          {this.props.currentSection === '' && (
            <i
              className="fas fa-plus-square action-btn"
              onClick={() => {
                if (this.state.section === 'projects') {
                  this.props.setCurrentSection('project/create');
                  this.props.setCurrentId('');
                }
                if (this.state.section === 'groups') {
                  this.props.setCurrentSection('group/create');
                  this.props.setCurrentId('');
                }
              }}
            ></i>
          )}

          {this.props.currentSection === '' &&
            this.state.section === 'projects' && (
              <i
                className="fas fa-archive action-btn extra-right"
                onClick={() => {
                  this.props.setCurrentSection('project/archived');
                }}
              ></i>
            )}
          {this.props.currentSection === 'group' && (
            <i
              className="fas fa-archive action-btn extra-right"
              onClick={() => {
                this.props.setCurrentSection('group/archived');
              }}
            ></i>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = {
  logoutUser,
  clearErrors,
  clearCurrentSectionAndId,
  setCurrentSection,
  setCurrentId,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  errors: state.user.errors,
  currentSection: state.user.currentSection,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
