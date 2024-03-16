import * as types from './types';
import {BaseUrl} from '../../utils/constans';
import axios from 'axios';

export const userRegistration = (
  data,
  onSuccessRegistration,
  onErrorRegistraton,
) => {
  return async dispatch => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://${BaseUrl}:3000/auth/userRegistration`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const result = await axios(config);
      if (result) {
        if (result.data.success) onSuccessRegistration(result.data.userID);
      }
    } catch (err) {
      onErrorRegistraton(err);
    }
  };
};

export const userVerification = (
  data,
  onSuccessVerification,
  onErrorVerification,
) => {
  return async dispatch => {
    try {
      var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
      };

      await fetch(
        `http://${BaseUrl}:3000/auth/userVerification`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.success === true) {
            onSuccessVerification();
            dispatch(saveUserData(result.data));
          } else onErrorVerification(result);
        });
    } catch (err) {
      onErrorVerification(err);
      console.log(err);
    }
  };
};

export const userLogin = (data, onSuccessLogin, onErrorLogin) => {
  return async dispatch => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://${BaseUrl}:3000/auth/login`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const result = await axios(config);
      if (result) {
        if (result.data.success) {
          dispatch(saveUserData(result.data.data));
          onSuccessLogin(true);
        }
      }
    } catch (err) {
      console.log(err);
      onErrorLogin(err);
    }
  };
};

export const toggleMode = data => {
  return {
    type: types.TOGGLE_MODE,
  };
};

export const saveUserData = data => {
  return {
    type: types.LOGIN,
    payload: data,
  };
};

export const userLogout = data => {
  return {
    type: types.LOGOUT,
  };
};
