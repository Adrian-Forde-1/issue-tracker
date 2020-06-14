import React from 'react';

function MessageList({ messages }) {
  return (
    <ul>
      {messages.map((message) => (
        <div className="row">
          <div className="col-12">
            <div className="team-chat-message">
              <div key={message.id}>
                <p>
                  <strong>{message.user}</strong>
                </p>
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
}

export default MessageList;
