import React, { Component } from 'react';
import axios from 'axios';

//Components
import GoBack from './GoBack';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  setCurrentSection,
  setCurrentId,
  setErrors,
} from '../redux/actions/userActions';

class EditBug extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);

    this.state = {
      bug: {},
    };
  }

  componentDidMount() {
    const bugId = this.props.currentId;
    axios
      .get(`/api/bug/${bugId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.setState({
          bug: response.data,
        });
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.setCurrentSection('project/bug');
        this.props.setCurrentId(this.props.currentId);
      });
  }

  handleNameChange = (e) => {
    const bug = this.state.bug;
    bug.name = e.target.value;
    this.setState({
      bug,
    });
  };
  handleDescriptionChange = (e) => {
    const bug = this.state.bug;
    bug.description = e.target.value;
    this.setState({
      bug,
    });
  };
  handleLabelChange = (e) => {
    const bug = this.state.bug;
    const label = this.state.bug.project.labels.find(
      (label) => label.name.toString() === e.target.value.toString()
    );
    bug.label = label;
    this.setState({
      bug,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `/api/bug/${this.state.bug._id}`,
        { bug: this.state.bug },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        this.props.setCurrentSection('bug');
        this.props.setCurrentId(this.state.bug._id);
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.setCurrentSection('bug');
        this.props.setCurrentId(this.state.bug._id);
      });
  };
  render() {
    return (
      <div>
        {Object.keys(this.state.bug).length > 0 && (
          <div className="form-container no-top-nav">
            <GoBack section="bug" id={this.state.bug._id} />
            <div className="container">
              <div className="auth-form">
                <h2>Edit Bug</h2>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                      type="text"
                      name="name"
                      value={this.state.bug.name}
                      onChange={this.handleNameChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <br />
                    <textarea
                      type="text"
                      name="description"
                      maxLength="500"
                      value={this.state.bug.description}
                      onChange={this.handleDescriptionChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="label">Label</label>
                    <br />
                    <select
                      type="text"
                      name="label"
                      value={this.state.bug.label.name}
                      onChange={this.handleLabelChange}
                      required
                    >
                      {this.state.bug.project.labels &&
                        this.state.bug.project.labels.map((label, index) => (
                          <option value={label.name} key={index}>
                            {label.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button className="submit-btn">Edit Bug</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
  setErrors,
};

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBug);
