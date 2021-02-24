import React, { useEffect } from "react";
import moment from "moment";

//Redux
import { connect } from "react-redux";

function MessageList(props) {
  const { messages, messageWrapperRef } = props;

  useEffect(() => {
    console.log("Message list called");
  }, []);

  if (typeof messages === "object" && messages.length > 0) {
    return (
      <div className="chat__message-wrapper" ref={messageWrapperRef}>
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
              {props.user &&
              props.user._id &&
              message.sender._id.toString() === props.user._id.toString() ? (
                <div
                  className="team__chat-message team__chat-message--mine"
                  style={{ float: "right" }}
                >
                  <div key={message.id}>
                    <p
                      className="team__chat-message-content"
                      style={{ padding: "5px" }}
                    >
                      {message.message}
                    </p>
                    <p className="team__chat-message-posted-at">
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
                    <p className="team__chat-message-posted-at">
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
