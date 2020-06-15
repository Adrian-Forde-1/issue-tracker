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
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleMemberChange = this.handleMemberChange.bind(this);

    this.state = {
      bug: {},
      members: [],
      assignedMembers: [],
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

        if (response.data.project.team !== null) {
          axios
            .get(`/api/team/${response.data.project.team}`, {
              headers: { Authorization: localStorage.getItem('token') },
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
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  }

  componentDidUpdate(prevProps, prevState) {
    //   if (prevState.bug.labels !== this.state.bug.labels) {
    //     if (this.state.bug['labels']) {
    //       this.state.bug.labels.forEach((label, index) => {
    //         document.querySelector(`#check${label._id}`).checked = true;
    //       });
    //     }
    //   }

    if (this.state.bug.labels.length > 0) {
      this.state.bug.labels.forEach((label) => {
        this.state.bug.project.labels.forEach((projectLabel) => {
          if (projectLabel._id.toString() === label.toString()) {
            document.querySelector(`#check${label}`).checked = true;
          }
        });
      });
    }

    if (prevState.members !== this.state.members) {
      if (this.state.bug['assignees']) {
        if (this.state.bug.assignees.length > 0) {
          this.state.bug.assignees.forEach((assignee) => {
            this.setState((prevState) => ({
              assignedMembers: [...prevState.assignedMembers, assignee._id],
            }));
            document.querySelector(`#check${assignee._id}`).checked = true;
          });
        }
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

  handleLabelChange = (e) => {
    if (e.target.checked) {
      const bug = this.state.bug;
      const newLabels = [...this.state.bug.labels, e.target.value];

      bug.labels = newLabels;
      this.setState({
        bug,
      });
    } else {
      const bug = this.state.bug;
      const newLabels = this.state.bug.labels.filter(
        (label) => label.toString() !== e.target.value.toString()
      );
      bug.labels = newLabels;
      this.setState({
        bug,
      });
    }
  };

  handleMemberChange = (e) => {
    if (e.target.checked) {
      e.target.checked = true;
      const newMembers = [...this.state.assignedMembers, e.target.value];
      this.setState({
        assignedMembers: newMembers,
      });
    } else {
      e.target.checked = false;
      const newMembers = this.state.assignedMembers.filter(
        (member) => member.toString() !== e.target.value.toString()
      );
      this.setState({
        assignedMembers: newMembers,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const bug = {
      name: this.state.bug.name,
      description: this.state.bug.description,
      labels: this.state.bug.labels,
      projectId: this.state.bug.project._id,
      assignees: this.state.assignedMembers,
    };
    axios
      .put(
        `/api/bug/${this.state.bug._id}`,
        { bug: bug },
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
                      maxLength="30"
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
                            value={label._id}
                            id={`check${label._id}`}
                            onChange={this.handleLabelChange}
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

                    {this.state.members && this.state.members.length > 0 && (
                      <div className="form-group mb-0">
                        <label htmlFor="">Assign Members</label>
                      </div>
                    )}

                    {this.state.members &&
                      this.state.members.map((member, index) => (
                        <div className="form-check" key={member._id}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={member._id}
                            id={`check${member._id}`}
                            onChange={this.handleMemberChange}
                          />
                          <label
                            htmlFor={`check${member._id}`}
                            className="form-check-label check-label"
                            style={{
                              background: `#2e00b1`,
                              color: 'white',
                            }}
                          >
                            {member.username}
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
