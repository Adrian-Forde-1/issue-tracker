import React, { useEffect, useState, useRef, useCallback } from "react";

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

//SVG
import SendSVG from "../SVG/SendSVG";

//Components
import MessageList from "./MessageList";

const TeamChat = (props) => {
  let inputMessageRef = useRef(null);
  let socket = io("https://af-issue-tracker.herokuapp.com/");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageWrapperRef = useRef(null);

  // const onRefChange = useCallback((node) => {
  //   setMessageWrapperRef(node);

  //   if (
  //     node &&
  //     node !== undefined &&
  //     node !== null &&
  //     node.current !== undefined
  //   ) {
  //     node.current.focus();
  //     node.current.scrollTop = node.current.scrollHeight;
  //   }
  // });

  // const messageWrapperRef = useRef(null);

  useEffect(() => {
    inputMessageRef.current.focus();

    socket.on("Output Chat Message", (message) => {
      setMessages((prevState) => {
        return [...prevState, message];
      });
      setMessage("");

      if (messageWrapperRef.current)
        messageWrapperRef.current.scrollTop =
          messageWrapperRef.current.scrollHeight;
    });

    if (props.setCurrentTeam) props.setCurrentTeam(props.match.params.teamId);
    // props.setCurrentTeam(`${teamId}`);

    getMessages();
  }, []);

  useEffect(() => {
    getMessages();
  }, [props.location.pathname]);

  const getMessages = () => {
    setMessages([]);
    setMessage("");
    axios
      .get(`/api/chats/${props.match.params.teamId}`)
      .then((res) => {
        if (res && res.data) {
          setMessages(res.data);
        }

        messageWrapperRef.current.scrollTop =
          messageWrapperRef.current.scrollHeight;
      })
      .catch((err) => {
        if (err && err.response && err.response.data) props.setErrors(err);
      });
  };

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
        {messages.length > 0 && (
          <MessageList
            messages={messages}
            messageWrapperRef={messageWrapperRef}
          />
        )}
      </div>
      <form
        className="team__chat-form"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <div className="chat__my-message-container">
          <input
            className="chat__my-message"
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            autoComplete="off"
            value={message}
            ref={inputMessageRef}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button>
            <SendSVG />
            {/* <i className="fas fa-level-down-alt"></i> */}
          </button>
        </div>
      </form>
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
