import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ServerBar from "./components/ServerBar";
import Server from "./components/Server";
import io from "socket.io-client";
import "./index.css"
import { getServers } from "../../frontend/src/store/server";

const socket = io.connect('/');
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(state => {
    return state.session.user
  })
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));

  }, [dispatch]);


  return (
    <>
      {/* <Navigation isLoaded={isLoaded} /> */}

      {isLoaded && (
        <div className="app-holder">
          <ServerBar user={user} socket={socket} />
          <Switch>
            <Route exact path = "/servers/:id">
              <Server socket={socket} />
            </Route>
            {/* <Route path="/login">
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route> */}
          </Switch>
        </div>

      )}
    </>
  );
}

export default App;
