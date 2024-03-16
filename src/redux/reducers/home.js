import * as types from '../actions/types';

const initialState = {
  notifications: [],
  chats: [],
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_ALL_CHAT:
      return {
        ...state,
        chats: action.payload,
      };
    case types.SAVE_IN_INDIVIDUAL_CHAT:
      return {
        ...state,
        chats: state.chats.map(k => {
          if (action.payload.chatID === k.chatID) {
            return {
              ...k,
              conversation: [
                ...k.conversation,
                {
                  ...action.payload.message,
                },
              ],
            };
          } else return k;
        }),
      };
    case types.SAVE_INDIVIDUAL_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };
    case types.LAST_IN_CHAT: {
      return {
        ...state,
        chats: state.chats.map(k => {
          if (action.payload.chatID === k.chatID) {
            return {
              ...k,
              lastInChat: {
                ...k.lastInChat,
                [`${action.payload.senderID}`]: action.payload.lastInChat,
              },
            };
          } else return k;
        }),
      };
    }
    default:
      return state;
  }
};
