import React, { Component } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

class EditBug extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);

    this.state = {
      bug: {},
    };
  }

  componentDidMount() {
    const bugId = this.props.match.params.bugId;
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
        this.props.history.goBack();
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bug.labels !== this.state.bug.labels) {
      if (this.state.bug['labels']) {
        this.state.bug.labels.forEach((label, index) => {
          document.querySelector(`#check${label._id}`).checked = true;
          // console.log(`#check${index}`);
        });
      }
    }
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

  handleCheckBoxChange = (e) => {
    if (e.target.checked) {
      const bug = this.state.bug;
      const label = this.state.bug.project.labels.find(
        (label) => label.name.toString() === e.target.value.toString()
      );
      const newLabels = [...this.state.bug.labels, label];
      bug.labels = newLabels;
      this.setState({
        bug,
      });
    } else {
      const bug = this.state.bug;
      const newLabels = this.state.bug.labels.filter(
        (label) => label.name.toString() !== e.target.value.toString()
      );

      bug.labels = newLabels;
      this.setState({
        bug,
      });
    }
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
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div>
        {Object.keys(this.state.bug).length > 0 && (
          <div className="form-container no-top-nav">
            <SideNav />
            <div className="container p-l-175-0">
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
                    {this.state.bug.project.labels &&
                      this.state.bug.project.labels.map((label, index) => (
                        <div className="form-check" key={index}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={label.name}
                            id={`check${label._id}`}
                            onChange={this.handleCheckBoxChange}
                          />
                          <label
                            htmlFor={`check${label._id}`}
                            className="form-check-label check-label"
                            style={{
                              background: `${label.color}`,
                              color: 'white',
                            }}
                          >
                            {label.name}
                          </label>
                        </div>
                      ))}
                  </div>
                  <button className="submit-btn">Edit Bug</button>
                </form>
              </div>
            </div>
            <ProjectsTeamsHamburger />
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(EditBug);
