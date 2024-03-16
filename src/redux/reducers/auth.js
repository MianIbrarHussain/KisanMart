import * as types from '../actions/types';

const initialState = {
  userData: {},
  loggedIn: false,
  isSeller: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        loggedIn: true,
        userData: action.payload,
      };
    case types.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        isSeller: false,
        userData: {},
      };
    case types.TOGGLE_MODE:
      return {
        ...state,
        isSeller: !state.isSeller,
      };
    default:
      return state;
  }
};
