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
      return dispatch(sessionActions.signup({ email, username, password, profilePicture:picture }))
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
