import React, { Component } from "react";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";

//Components
import SideNav from "../Navigation/SideNav";

class CreateTeamProject extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: "",
      description: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const teamId = this.props.match.params.teamId;

    const project = {
      name: this.state.name,
      description: this.state.description,
      teamId,
    };

    axios
      .post(
        "/api/project",
        { project: project },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then(() => {
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div className="form-container p-t-0">
        {/* <SideNav /> */}
        <div className="container p-l-175">
          <div className="auth-form">
            <h2>Create Project</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                  type="text"
                  name="description"
                  maxLength="500"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </div>
              <button className="submit-btn">Create Project</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(CreateTeamProject);
