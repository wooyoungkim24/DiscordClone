import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./index.css"

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [picture, setPicture] = useState("")

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password, profilePicture: picture }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };
  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
  }

  return (

    <div className='signup-page'>
      <img src="https://theme.zdassets.com/theme_assets/678183/b7e9dce75f9edb23504e13b4699e208f204e5015.png"></img>



      <div className='signup-container'>

        <div id="github-menu">
          <input type="checkbox" href="#" className="menu-open" name="menu-open" id="menu-open" />
          <label className="menu-open-button" htmlFor="menu-open">
            <div id="github" >
              <i className="fa-brands fa-github"></i>
            </div>
          </label>
          <a className="menu-item woo" target="blank" href="https://github.com/wooyoungkim24">Wooyoung Kim</a>
        </div>

        <div id="linked-in-menu">
          <input type="checkbox" href="#" className="menu-openli" name="menu-openli" id="menu-openli" />
          <label className="menu-open-buttonli" htmlFor="menu-openli">
            <div id="linked-in" >
              <i className="fa-brands fa-linkedin"></i>
            </div>
          </label>
          <a className="menu-itemli wooli" target="blank" href="https://www.linkedin.com/in/wooyoung-kim-718618143/">Wooyoung Kim</a>

        </div>


        <div className='signup-title'>
          <div className='signup-title-top'>
            Create an account
          </div>
        </div>
        <div className='signup-form' >
          <ul className='error-list'>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div className='signup-email-field'>

            EMAIL

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='signup-username-field'>

            USERNAME

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='signup-picture-field'>

            PROFILE PICTURE

            <input
              type="text"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              required
            />
          </div>

          <div className='signup-password-field'>

            PASSWORD


            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='signup-confirm-field'>

            CONFIRM PASSWORD


            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>


          <button type="button" onClick={handleSubmit}>Signup</button>
        </div>
        <div className='signup-bottom'>
          <div className='signup-bottom-left'>

            <Link to="/login">Already have an account?</Link>

          </div>
          <div className='signup-bottom-right'>
            <button type='button' onClick={handleDemoLogin}>
              Demo User
            </button>
          </div>
        </div>
      </div>

    </div>



  );
}

export default SignupFormPage;
