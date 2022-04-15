import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
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

  const current_location = useLocation().pathname.split("/")[2]

  const yourServers = useSelector(state => {
    return state.myServers.myServers
  })

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then((user) => dispatch(getServers(user.id)))
      .then(() => setIsLoaded(true));

  }, [dispatch]);


  return (
    <>
      {/* <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
      </Switch> */}



        <div className="app-holder">
          <ServerBar isLoaded = {isLoaded} user={user} socket={socket} servers={yourServers} />
          <Switch>
            <Route exact path="/servers/:id/:textId">
              <Server isFirstLoaded = {isLoaded} key={useLocation().pathname.split("/")[2]} socket={socket} servers = {yourServers} user = {user}/>
            </Route>
            <Route path="/login">
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
          </Switch>
        </div>


    </>
  );
}

export default App;
