import React, { Component } from "react";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";

//Resources
import codeImgBlur from "../../resources/Images/codeImgBlur.jpg";

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
      <div className="standard-form__wrapper">
        {/* <SideNav /> */}
        <div className="standard-form__header">
          {/* <div className="standard-form__header-img-container">
            <img
              src={codeImgBlur}
              alt="code with a section in the shape of a donut blurred out"
            />
            <div className="standard-form__header-img-container-gradient"></div>
          </div> */}

          <h2>Create Project</h2>
        </div>
        <div className="standard-form__body">
          <form onSubmit={this.handleSubmit}>
            <div className="standard-form__input-container">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <div className="standard-form__input-container">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                name="description"
                maxLength="500"
                value={this.state.description}
                onChange={this.handleChange}
              />
            </div>
            <button>Create Project</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(CreateTeamProject);
