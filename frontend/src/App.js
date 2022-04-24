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
import { userNowOnline, getDMs } from "./store/session";



const socket = io.connect('/', {
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': Infinity
});

function App() {
  // socket.on('error', function(){
  //   console.log("attempting to reconnect$$$")
  //   socket.socket.reconnect();
  // });
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const [myUser, setMyUser] = useState({})
  const user = useSelector(state => {
    return state.session.user
  })
  const [madiaRecorder, setMadiaRecorder] = useState()
  const [stream, setStream] = useState()
  // const [yourServers, setYourServers] = useState([])

  const current_location = useLocation().pathname.split("/")[1]
  const [inVoice, setInVoice] = useState(false)
  const yourServers = useSelector(state => {
    return state.myServers.myServers
  })




  useEffect(() => {
    // console.log('are you even running')
    dispatch(sessionActions.restoreUser())
      .then((user) => {
        if (user) {
          dispatch(getServers(user.id))

          // dispatch(userOnline())
          // .then(servers => setYourServers(servers))
        }
        if (navigator.mediaDevices) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            // console.log("should only run once")
            setStream(stream)
            setMadiaRecorder(new MediaRecorder(stream))
          })
        }

      })
      .then(() => setIsLoaded(true));

  }, [dispatch]);


  useEffect(() => {
    // console.log("did you give me hope")
    if (user && !user.online) {
      dispatch(userNowOnline(user.id))
      // .then(() => dispatch(getDMs(user.id)))
      dispatch(getDMs(user.id))

    }
    //   console.log('why everything sucks ^^^^^^^^')
    //     // console.log("i am not online you better be running", data.userId, user.id)
    //   socket.on("loggedOn", (data) => {

    //     if (data.userId == user.id) {


    //       // .then(() =>dispatch(getDMs(user.id)))
    //     }
    //   })

    //   //Future, logged off dynamic
    //   // socket.on("loggedOff", dispatch(sessionActions.restoreUser()))
    // }
    // return () => {
    //   socket.off("loggedOn", (data) => {
    //     if (data.userId == user.id) {
    //       dispatch(userOnline())
    //     }
    //   })
    //   // socket.off("loggedOff",dispatch(sessionActions.restoreUser()))
    // }


  }, [socket,user])

  useEffect(() => {

    if (isLoaded && user) {
      // console.log("are you running")
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

      {isLoaded && user &&

        <div className="app-holder">
          <ServerBar inVoice={inVoice} isLoaded={isLoaded} user={user} socket={socket} />

          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>

            <Route exact path="/servers/:id/:textId">
              <Server inVoice={inVoice} setInVoice={setInVoice} key={current_location} setStream={setStream} setMadiaRecorder={setMadiaRecorder} stream={stream} madiaRecorder={madiaRecorder} isFirstLoaded={isLoaded} socket={socket} user={user} />
            </Route>


            <Route path="/home">
              <Home inVoice={inVoice} user={user} socket={socket} />
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
