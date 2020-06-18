import React, { Component } from 'react';
import { generateColor } from '../../util/generateColor';
import axios from 'axios';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { getUserProjects } from '../../redux/actions/projectActions';
import { setErrors } from '../../redux/actions/userActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

class EditLabel extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.sendRequest = this.sendRequest.bind(this);

    this.state = {
      name: '',
      color: '#0989AC',
    };
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    const labelId = this.props.match.params.labelId;
    var label;

    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        label = response.data.labels.find(
          (label) => label._id.toString() === labelId.toString()
        );

        this.setState(
          {
            name: label.name,
            color: label.color,
          },
          () => {
            document.querySelector(
              '.show-color'
            ).style.background = `${this.state.color}`;
          }
        );
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendRequest = (e) => {
    e.preventDefault();

    const projectId = this.props.match.params.projectId;
    const labelId = this.props.match.params.labelId;

    const label = {
      name: this.state.name,
      color: this.state.color,
    };

    axios
      .put(
        `/api/project/${projectId}/label/${labelId}/edit`,
        { label: label },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        this.props.getUserProjects(localStorage.getItem('token')).then(() => {
          this.props.history.goBack();
        });
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  };
  render() {
    const showColor = () => {
      const getColor = generateColor();

      this.setState(
        {
          color: getColor,
        },
        () => {
          document.querySelector(
            '.show-color'
          ).style.background = `${this.state.color}`;
        }
      );
    };
    return (
      <div>
        <ProjectsTeamsHamburger />
        <SideNav />
        <div className="form-container p-t-0">
          <div className="container p-l-175-0">
            <div className="auth-form">
              <h2>Edit Label</h2>
              <div className="form-group">
                <label htmlFor="name">Label Name</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="w-50 d-flex justify-content-center mx-auto">
                <button className="color-picker mr-2" onClick={showColor}>
                  Generate Color <i className="fas fa-sync-alt"></i>
                </button>
                <div className="show-color"></div>
              </div>
              <button className="submit-btn" onClick={this.sendRequest}>
                Edit Label
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
  getUserProjects,
};

const mapStateToProps = (state) => ({
  extraIdInfo: state.user.extraIdInfo,
  projects: state.projects.projects,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditLabel));
