import React, { Component } from 'react';
import { generateColor } from '../util/generateColor';
import axios from 'axios';

//Components
import GoBack from './GoBack';

//Redux
import store from '../redux/store';

//Actions
import { getUserProjects } from '../redux/actions/projectActions';
import { SET_MESSAGES, SET_ERRORS } from '../redux/actions/types';

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
        store.dispatch({ type: SET_MESSAGES, payload: response.data });
        store
          .dispatch(getUserProjects(localStorage.getItem('token')))
          .then(() => {
            this.props.history.goBack();
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
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
      <div className="add-label">
        <GoBack />
        <div className="container">
          <div className="auth-form">
            <h2>Add Label</h2>
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
              Add Label
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddLabel;
