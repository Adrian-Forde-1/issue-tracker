import React, { Component } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Components
import SideNav from '../Navigation/SideNav';
import MessageList from './MessageList';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

import { setErrors } from '../../redux/actions/userActions';

class TeamChat extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.inputMessageRef = React.createRef();

    this.state = {
      message: '',
      messages: [],
    };
  }

  componentDidMount() {
    const server = 'http://127.0.0.1:5000';

    this.socket = io(server);

    this.socket.on('Output Chat Message', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    });

    // this.props.getChats(this.props.currentChatTeamID);
    const teamID = this.props.match.params.teamID;
    axios
      .get(`/api/chats/${teamID}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.setState({
          messages: response.data,
        });
      })
      .catch((err) => {
        this.props.setErrors(err);
      });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.props;

    let username = user.username;
    let userId = user._id;
    let currentTime = moment();
    let teamId = this.props.match.params.teamID;
    let message = this.state.message;
    let type = 'Image';

    this.socket.emit('Team Chat Message', {
      message,
      userId,
      username,
      currentTime,
      teamId,
      type,
    });

    this.setState({
      message: '',
    });

    this.inputMessageRef.current.focus();
  };
  render() {
    return (
      <div className="team-chat">
        <SideNav />
        <ProjectsTeamsHamburger />
        {/* <div className="team-chat-user-groups">
          <ul className="team-chat-user-groups-dropdown"></ul>
        </div> */}
        <div className="team-chat-content">
          {this.state.messages.length > 0 && (
            <MessageList messages={this.state.messages} />
          )}

          <form className="team-chat-form" onSubmit={this.onSubmit}>
            <input
              className="team-my-message"
              type="text"
              name="message"
              id="message"
              placeholder="Say something cool"
              value={this.state.message}
              ref={this.inputMessageRef}
              onChange={this.onChange}
            />
            <button>
              <i className="fas fa-level-down-alt"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  setErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamChat);
