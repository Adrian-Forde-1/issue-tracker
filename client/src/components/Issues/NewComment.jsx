import React, { Component } from "react";
import axios from "axios";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";

class NewNote extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      note: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const bugId = this.props.match.params.bugId;

    const newNote = {
      note: this.state.note,
      bug: bugId,
    };

    const username = this.props.user.username;

    axios
      .post("/api/note", { note: newNote, bugId: bugId, username: username })
      .then(() => {
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error.response.data);
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div className="form-container">
        <div className="container">
          <div className="auth-form">
            <h2>New Note</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="note">Note</label>
                <br />
                <textarea
                  type="text"
                  name="note"
                  maxLength="500"
                  value={this.state.note}
                  onChange={this.handleChange}
                />
              </div>

              <button className="submit-btn">Add Note</button>
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

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewNote));
