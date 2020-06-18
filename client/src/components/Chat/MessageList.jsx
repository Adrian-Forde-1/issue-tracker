import React, { useEffect } from 'react';
import moment from 'moment';

//Redux
import { connect } from 'react-redux';

function MessageList(props) {
  const { messages } = props;

  useEffect(() => {
    if (document.querySelector('.team-messages')) {
      const messages = document.querySelectorAll('.team-messages div');
      const lastChildHeight = messages[messages.length - 1];
      const pos = lastChildHeight.getBoundingClientRect().bottom;
      document.querySelector('.team-messages').scrollTo(0, pos);
    }
  }, [messages]);

  useEffect(() => {
    if (document.querySelector('.team-messages')) {
      const messages = document.querySelectorAll('.team-messages div');
      const lastChildHeight = messages[messages.length - 1];
      const pos = lastChildHeight.getBoundingClientRect().bottom;
      document.querySelector('.team-messages').scrollTo(0, pos);
    }
  }, []);
  if (typeof messages === 'object' && messages.length > 0) {
    return (
      <div className="team-messages">
        {messages.map((message, index) => (
          <div
            className="row"
            key={index}
            style={{
              width: '100%',
              margin: '0px auto',
            }}
          >
            <div className="col-12">
              {message.sender._id.toString() === props.user._id.toString() ? (
                <div className="team-chat-message" style={{ float: 'right' }}>
                  <div key={message.id}>
                    <p
                      className="team-chat-message-content"
                      style={{ padding: '5px' }}
                    >
                      {message.message}
                    </p>
                    <p className="team-message-posted-at">
                      {moment.utc(message.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="team-chat-message" style={{ float: 'left' }}>
                  <div key={message.id}>
                    <p className="team-chat-message-username">
                      {message.sender.username}
                    </p>
                    <p className="team-chat-message-content">
                      {message.message}
                    </p>
                    <p className="team-message-posted-at">
                      {moment.utc(message.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(MessageList);
