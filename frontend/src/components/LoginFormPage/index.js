import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, Link } from 'react-router-dom';
import io from "socket.io-client";
import "./index.css"

function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return (
    <Redirect to="/" />
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => history.push("/"))
      .then(() => window.location.reload())
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
  }

  return (
    <div className='login-page'>
      <img src="https://theme.zdassets.com/theme_assets/678183/b7e9dce75f9edb23504e13b4699e208f204e5015.png"></img>



      <div className='login-container'>


        <div id="github-menu">
          <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" />
          <label class="menu-open-button" for="menu-open">
            <div id="github" >
              <i class="fa-brands fa-github"></i>
            </div>
          </label>
          <a class="menu-item woo" target="blank" href="https://github.com/wooyoungkim24">Wooyoung Kim</a>
        </div>

        <div id="linked-in-menu">
          <input type="checkbox" href="#" class="menu-openli" name="menu-openli" id="menu-openli" />
          <label class="menu-open-buttonli" for="menu-openli">
            <div id="linked-in" >
              <i class="fa-brands fa-linkedin"></i>
            </div>
          </label>
          <a class="menu-itemli wooli" target="blank" href="https://www.linkedin.com/in/wooyoung-kim-718618143/">Wooyoung Kim</a>

        </div>


        <div className='login-title'>
          <div className='login-title-top'>
            Welcome back!
          </div>
          <div className='login-title-bottom'>
            We're so excited to see you again!
          </div>
        </div>
        <div className='login-form' >
          <ul className='error-list'>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div className='login-username-field'>

            USERNAME OR EMAIL

            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>

          <div className='login-password-field'>

            PASSWORD


            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          <button type="button" onClick={handleSubmit}>Login</button>
        </div>
        <div className='login-bottom'>
          <div className='login-bottom-left'>
            Need an account? &nbsp;
            <div className='signup-login-link'>
              <Link to="/signup">Register</Link>
            </div>
          </div>
          <div className='login-bottom-right'>
            <button type='button' onClick={handleDemoLogin}>
              Demo User
            </button>
          </div>
        </div>
      </div>

    </div>

  );
}

export default LoginFormPage;
