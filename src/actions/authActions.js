import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import backend from '../backend/backend';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post(`${backend}/api/users/register`, userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get Usr TOKEN
export const loginUser = userData => dispatch => {
  axios
    .post(`${backend}/api/users/login`, userData)
    .then(res => {
      // Save to Local Storage
      const { token } = res.data;
      // Set token to LocalStorage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode Token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localstorage
  localStorage.removeItem('jwyToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // set current user to {} whill will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
