import React, { Component } from 'react';

//Tostify
import { toast } from 'react-toastify';

//Components
import AllProjects from './AllProjects';
import AllGroups from './AllGroups';

//React Router Dom
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { logoutUser, clearErrors } from '../redux/actions/userActions';
import SearchBar from './SearchBar';

class Manager extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      section: 'projects',
      search: '',
    };
  }

  componentDidMount() {
    if (this.props.user !== null) {
      document.querySelector('#groups').classList.add('hide');
      document.querySelector('#projects').classList.remove('hide');

      document.querySelector('#project-section-btn').style.border =
        '1px solid white';
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    if (this.props.user) {
      return (
        <div className="manager">
          <div className="container">
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

            <div className="manager-nav">
              <ul>
                <li>
                  <button
                    id="project-section-btn"
                    onClick={(e) => {
                      document.querySelector(
                        '#group-section-btn'
                      ).style.border = 'none';
                      e.target.style.border = '1px solid white';

                      document.querySelector('#groups').classList.add('hide');
                      document
                        .querySelector('#projects')
                        .classList.remove('hide');

                      this.setState({
                        section: 'projects',
                        search: '',
                      });
                    }}
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    id="group-section-btn"
                    onClick={(e) => {
                      document.querySelector(
                        '#project-section-btn'
                      ).style.border = 'none';
                      e.target.style.border = '1px solid white';

                      document.querySelector('#projects').classList.add('hide');
                      document
                        .querySelector('#groups')
                        .classList.remove('hide');

                      this.setState({
                        section: 'groups',
                        search: '',
                      });
                    }}
                  >
                    Groups
                  </button>
                </li>
                {this.state.section === 'groups' ? (
                  <div className="ml-auto d-flex">
                    <li className="manager-action-btn">
                      <Link to="/join/group">Join Group</Link>
                    </li>
                    <li className="manager-action-btn">
                      <button
                        onClick={() => {
                          this.props.logoutUser(this.props.history);
                        }}
                      >
                        Logout<i className="fas fa-door-open"></i>
                      </button>
                    </li>
                  </div>
                ) : (
                  <li className="ml-auto manager-action-btn">
                    <button
                      onClick={() => {
                        this.props.logoutUser(this.props.history);
                      }}
                    >
                      Logout<i className="fas fa-door-open"></i>
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div className="manager-content">
              <SearchBar onChange={this.onChange} search={this.state.search} />
              <AllProjects search={this.state.search} />
              <AllGroups search={this.state.search} />
            </div>
          </div>
          <Link
            to={
              this.state.section === 'projects'
                ? '/create/project'
                : '/create/group'
            }
            className="action-btn"
          >
            <i className="fas fa-plus"></i>
          </Link>
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
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
