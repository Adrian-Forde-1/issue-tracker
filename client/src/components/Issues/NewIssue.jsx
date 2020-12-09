import React, { Component } from "react";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//React Router DOM
import { withRouter } from "react-router-dom";

//Actions
import { getUserProjects } from "../../redux/actions/projectActions";
import { setErrors } from "../../redux/actions/userActions";

//Components
import SideNav from "../Navigation/SideNav";
import ProjectsTeamsHamburger from "../Navigation/ProjectsTeamsHamburger";

class NewIssue extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleMemberChange = this.handleMemberChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      project: {},
      name: "",
      description: "",
      members: [],
      assignedMembers: [],
      labels: [],
    };
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;

    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          const responseProject = response.data;

          this.setState({
            project: responseProject,
          });

          //If project is in a team, get all the members from that team
          if (response.data.team !== null) {
            axios
              .get(`/api/team/${response.data.team}`, {
                headers: { Authorization: localStorage.getItem("token") },
              })
              .then((response) => {
                this.setState({
                  members: response.data.users,
                });
              })
              .catch((error) => {
                this.props.setErrors(error);
                this.props.history.goBack();
              });
          }

          if (
            this.props.match.params &&
            this.props.match.params.toString().indexOf("team" > -1)
          ) {
            this.props.setCurrentTeam(response.data.team);
          }
        }
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

  // handleLabelChange = (e) => {
  //   console.log('Label changed');
  //   if (e.target.checked) {
  //     const label = this.state.project.labels.find(
  //       (label) => label.name.toString() === e.target.value.toString()
  //     );

  //     console.log(label);
  //     const newLabels = [...this.state.labels, label._id];
  //     this.setState({
  //       labels: newLabels,
  //     });
  //   } else {
  //     const newLabels = this.state.labels.filter(
  //       (label) => label.name.toString() !== e.target.value.toString()
  //     );
  //     this.setState({
  //       labels: newLabels,
  //     });
  //   }
  // };
  handleMemberChange = (e) => {
    if (e.target.checked) {
      const newMembers = [...this.state.assignedMembers, e.target.value];
      this.setState({
        assignedMembers: newMembers,
      });
    } else {
      const newMembers = this.state.assignedMembers.filter(
        (member) => member.toString() !== e.target.value.toString()
      );
      this.setState({
        assignedMembers: newMembers,
      });
    }
  };

  handleLabelChange = (e) => {
    console.log("Label changed");
    if (e.target.checked) {
      const label = this.state.project.labels.find(
        (label) => label._id.toString() === e.target.value.toString()
      );
      const newLabels = [...this.state.labels, label._id];
      this.setState({
        labels: newLabels,
      });
    } else {
      const newLabels = this.state.labels.filter(
        (label) => label.toString() !== e.target.value.toString()
      );
      this.setState({
        labels: newLabels,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const issue = {
      name: this.state.name,
      description: this.state.description,
      labels: this.state.labels,
      projectId: this.state.project._id,
      assignees: this.state.assignedMembers,
    };

    axios
      .post(
        "/api/issue",
        { issue: issue },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then(() => {
        this.props.getUserProjects(localStorage.getItem("token"));
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div className="standard-form__wrapper">
        <div className="standard-form__header">
          <h2>New Issue</h2>
        </div>
        <div className="standard-form__body  standard-form__body--no-padding">
          <form onSubmit={this.handleSubmit}>
            <div className="standard-form__split-double">
              <section>
                <div className="standard-form__input-container">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    maxLength="60"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="standard-form__input-container standard-form__input-container--fill">
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    className="standard-form__input-container-textarea standard-form__input-container-textarea--fill"
                    name="description"
                    maxLength="500"
                    autoComplete="off"
                    value={this.state.description}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <button className="standard-form__btn">Add Issue</button>
              </section>
              <section>
                <div className="standard-form__input-container">
                  <label htmlFor="">Labels</label>
                </div>
                {this.state.project.labels &&
                  this.state.project.labels.map((label, index) => (
                    <div className="standard-form__input-container" key={index}>
                      <label
                        htmlFor={`check${index}`}
                        className="form-check-label check-label"
                        style={{ background: `${label.color}`, color: "white" }}
                      >
                        {label.name}
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={label._id}
                          id={`check${index}`}
                          onChange={this.handleLabelChange}
                        />
                      </label>
                    </div>
                  ))}

                {this.state.project["team"] && this.state.members.length > 0 && (
                  <div className="standard-form__input-container">
                    <label htmlFor="">Assign Members</label>
                  </div>
                )}

                {this.state.members &&
                  this.state.members.map((member, index) => (
                    <div
                      className="standard-form__input-container"
                      key={member._id}
                    >
                      <label
                        htmlFor={`check${member._id}`}
                        className="form-check-label check-label"
                        style={{ background: `#2e00b1`, color: "white" }}
                      >
                        {member.username}
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={member._id}
                          id={`check${member._id}`}
                          onChange={this.handleMemberChange}
                        />
                      </label>
                    </div>
                  ))}
              </section>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
  getUserProjects,
};

export default connect(null, mapDispatchToProps)(withRouter(NewIssue));
