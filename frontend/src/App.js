import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ServerBar from "./components/ServerBar";
import Server from "./components/Server";
import io from "socket.io-client";
import "./index.css"
import { getServers } from "../../frontend/src/store/server";
import Home from "./components/Home";



const socket = io.connect('/');
function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [myUser, setMyUser] = useState({})
  const user = useSelector(state => {
    return state.session.user
  })
  const [madiaRecorder, setMadiaRecorder] = useState()
  // const [yourServers, setYourServers] = useState([])

  const current_location = useLocation().pathname.split("/")[2]

  const yourServers = useSelector(state => {
    return state.myServers.myServers
  })

  useEffect(() => {

  }, [])



  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then((user) => {
        if (user) {
          dispatch(getServers(user.id))
          // .then(servers => setYourServers(servers))
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          let tempRecorder = new MediaRecorder(stream);
          setMadiaRecorder(tempRecorder)
        })
          .then(() => setIsLoaded(true));

      }, [dispatch]);

    useEffect(() => {

      if (isLoaded && user) {
        socket.emit("online", { username: user.username, userId: user.id })
      }
    }, [isLoaded])




    // console.log('why is there no user', user)
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
        {isLoaded && !user &&
          <>
            <Redirect to="/login" />
            <Switch>
              <Route path="/login">
                <LoginFormPage />
              </Route>
              <Route path="/signup">
                <SignupFormPage />
              </Route>
            </Switch>

          </>

        }

        {isLoaded && user && yourServers.length &&

          <div className="app-holder">
            <ServerBar isLoaded={isLoaded} user={user} socket={socket} servers={yourServers} />

            <Switch>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>

              <Route exact path="/servers/:id/:textId">
                <Server madiaRecorder = {madiaRecorder} isFirstLoaded={isLoaded} socket={socket} servers={yourServers} user={user} />
              </Route>


              <Route path="/home">
                <Home user={user} socket={socket} />
              </Route>

              <Route path="/login">
                <LoginFormPage />
              </Route>
              <Route path="/signup">
                <SignupFormPage />
              </Route>
            </Switch>
          </div>
        }




      </>
    );
  }

export default App;
