import React, { useEffect } from "react";
import moment from "moment";

//Redux
import { connect } from "react-redux";

function MessageList(props) {
  const { messages } = props;

  if (typeof messages === "object" && messages.length > 0) {
    return (
      <div className="team-messages">
        {messages.map((message, index) => (
          <div
            className="row"
            key={index}
            style={{
              width: "100%",
              margin: "0px auto",
            }}
          >
            <div className="col-12">
              {message.sender._id.toString() === props.user._id.toString() ? (
                <div className="team__chat-message" style={{ float: "right" }}>
                  <div key={message.id}>
                    <p
                      className="team__chat-message-content"
                      style={{ padding: "5px" }}
                    >
                      {message.message}
                    </p>
                    <p className="team-message-posted-at">
                      {moment.utc(message.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="team__chat-message" style={{ float: "left" }}>
                  <div key={message.id}>
                    <p className="team__chat-message-username">
                      {message.sender.username}
                    </p>
                    <p className="team__chat-message-content">
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
