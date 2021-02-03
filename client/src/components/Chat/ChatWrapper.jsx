import React, { useEffect, Suspense, lazy } from "react";

//React Router DOM
import { Route, Switch, Redirect } from "react-router-dom";

//Components
import TeamChatLandingPage from "./TeamChatLandingPage";
import TeamChat from "./TeamChat";

const ChatWrapper = (props) => {
  useEffect(() => {
    props.setCurrentTeam("");
  }, []);

  let routes = (
    <Switch>
      <Route
        exact
        path="/team/chat"
        render={(props) => {
          return <TeamChatLandingPage {...props} />;
        }}
      />
      <Route
        exact
        path="/team/chat/:teamId"
        render={(props) => {
          return <TeamChat {...props} />;
        }}
      />
    </Switch>
  );

  return (
    <div className="chat__wrapper">
      <Suspense fallback="Loading">{routes}</Suspense>
    </div>
  );
};

export default ChatWrapper;
