import React, { useEffect, useState, useRef } from "react";

//Socket IO
import io from "socket.io-client";

//Moment
import moment from "moment";

//Axios
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";

//Components
import MessageList from "./MessageList";

const TeamChat = (props) => {
  let socket;
  let inputMessageRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();
    inputMessageRef.current.focus();

    socket.on("Output Chat Message", (message) => {
      setMessages((prevState) => {
        return [...prevState, message];
      });

      if (document.querySelector(".team-messages")) {
        document.querySelector(".team-messages").scrollTo(0, 999999999999999);
      }
    });

    const teamId = props.match.params.teamId;
    // props.setCurrentTeam(`${teamId}`);
    console.log(props);

    axios
      .get(`/api/chats/${teamId}`)
      .then((res) => {
        if (res && res.data) setMessages(messages);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) props.setErrors(err);
      });
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    const { user } = props;

    let username = user.username;
    let userId = user._id;
    let currentTime = moment();
    let teamId = props.match.params.teamId;
    let type = "Image";

    socket.emit("Team Chat Message", {
      message,
      userId,
      username,
      currentTime,
      teamId,
      type,
    });

    setMessage(message);

    inputMessageRef.current.focus();
  };
  return (
    <div className="team__chat">
      {/* <div className="team__chat-user-groups">
          <ul className="team__chat-user-groups-dropdown"></ul>
        </div> */}
      <div className="team__chat-content">
        {messages.length > 0 && <MessageList messages={messages} />}

        <form
          className="team__chat-form"
          onSubmit={() => {
            onSubmit();
          }}
        >
          <input
            className="team-my-message"
            type="text"
            name="message"
            id="message"
            placeholder="Say something cool"
            autoComplete="off"
            value={message}
            ref={inputMessageRef}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button>
            <i className="fas fa-level-down-alt"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  setErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamChat);
