import React, { Component } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Components
import SideNav from '../Navigation/SideNav';
import MessageList from './MessageList';

class TeamChat extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      message: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
  };
  render() {
    return (
      <div className="team-chat">
        <SideNav />
        <div className="team-chat-content">
          <div className="team-messages">
            <MessageList messages={this.state.messages} />
          </div>
          <form onSubmit={this.onSubmit}>
            <textarea
              className="team-my-message"
              type="text"
              name="message"
              id="message"
              value={this.state.message}
              onChange={this.onChange}
            />
            <button>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(TeamChat);
