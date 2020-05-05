import React, { Component } from 'react';
import { generateColor } from '../../util/generateColor';
import axios from 'axios';

//Actions
import { getUserProjects } from '../../redux/actions/projectActions';
import { setMessages, setErrors } from '../../redux/actions/userActions';
import { connect } from 'react-redux';

//Components
import SideNav from '../Navigation/SideNav';

class AddLabel extends Component {
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
    document.querySelector(
      '.show-color'
    ).style.background = `${this.state.color}`;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendRequest = (e) => {
    e.preventDefault();

    const projectId = this.props.match.params.projectId;

    const label = {
      name: this.state.name,
      color: this.state.color,
    };

    axios
      .post(
        `/api/project/${projectId}/label/create`,
        { label: label },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        this.props.history.goBack();
        this.props.setMessages(response);
      })
      .catch((error) => {
        if (error['response']) {
          this.props.setErrors(error);
          this.props.history.goBack();
        }
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
      <div className="form-container p-t-0">
        <SideNav />
        <div className="container p-l-175">
          <div className="auth-form">
            <h2>Add Label</h2>
            <div className="form-group">
              <label htmlFor="name">Label Name</label>
              <input
                type="text"
                name="name"
                maxLength="15"
                value={this.state.name}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="w-100 d-flex justify-content-center mx-auto">
              <button className="color-picker mr-2" onClick={showColor}>
                Generate Color <i className="fas fa-sync-alt"></i>
              </button>
              <div className="show-color"></div>
            </div>
            <button className="submit-btn" onClick={this.sendRequest}>
              Add Label
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDisptchToProps = {
  setMessages,
  setErrors,
  getUserProjects,
};

export default connect(null, mapDisptchToProps)(AddLabel);
