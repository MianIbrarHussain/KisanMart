import * as types from './types';
import {BaseUrl} from '../../utils/constans';
import axios from 'axios';

export const handlePostProduct = (formdata, onSuccess, onError) => {
  return async dispatch => {
    try {
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      await fetch(`http://${BaseUrl}:3000/home/addProduct`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.success === true) onSuccess();
          else onError(result);
        });
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };
};

export const handleGetProducts = (
  userID,
  category,
  isSeller,
  onSuccess,
  onError,
) => {
  return async dispatch => {
    try {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      await fetch(
        `http://${BaseUrl}:3000/home/getProducts?userID=${userID}&filter=${category}&isSeller=${isSeller}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result.success === true)
            onSuccess(
              isSeller
                ? result.myProducts
                : category === ''
                ? {
                    topSelling: result.topSelling,
                    exportQuality: result.exportQuality,
                    fruitsVeges: result.fruitsVeges,
                  }
                : result.othersProducts,
            );
          else onError(result);
        })
        .catch(error => {
          onError(error);
          console.log('error', error);
        });
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };
};

export const handleGetProductDetails = (productID, onSuccess, onError) => {
  return async dispatch => {
    try {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      await fetch(
        `http://${BaseUrl}:3000/home/getProductDetails/${productID}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result.success === true) onSuccess(result.data);
          else onError(result);
        })
        .catch(error => {
          onError(error);
          console.log('error', error);
        });
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };
};

export const handleCreateChatRoom = (data, onSuccessChat, onErrorChat) => {
  return async dispatch => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://${BaseUrl}:3000/home/createChatRoom`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const result = await axios(config);
      if (result) {
        if (result.data.success)
          onSuccessChat(result.data.chatID, result.status);
      }
    } catch (err) {
      console.log(err);
      onErrorChat(err);
    }
  };
};

export const handleFetchingProducts = (data, onSuccess, onError) => {
  return async dispatch => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://${BaseUrl}:3000/home/getSupplierProducts`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const result = await axios(config);
      if (result) {
        if (result.data.success) onSuccess(result.data.supplilerProducts);
      }
    } catch (err) {
      onError(err);
    }
  };
};

export const handleCreatingOffer = (
  data,
  onSuccessCreatingOffer,
  onErrorCreatingOffer,
) => {
  return async dispatch => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://${BaseUrl}:3000/deal/createNewOffer`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const result = await axios(config);
      if (result) {
        if (result.data.success) onSuccessCreatingOffer(result.data.dealID);
      }
    } catch (err) {
      onErrorCreatingOffer(err);
    }
  };
};

export const handleFetchMyDeals = (userID, onSuccess, onError) => {
  return async dispatch => {
    try {
      await fetch(`http://${BaseUrl}:3000/deal/getMyDeals/${userID}`, {
        method: 'GET',
        redirect: 'follow',
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.success === true) {
            onSuccess(result.data);
          }
        })
        .catch(error => {
          console.log('error', error);
          onError();
        });
    } catch (err) {
      onError(err);
    }
  };
};

export const handleDealDetails = (data, onSuccess, onError) => {
  return async dispatch => {
    try {
      await fetch(
        `http://${BaseUrl}:3000/deal/getDealDetails/${data.offerID}/${data.userID}`,
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
        .then(response => response.json())
        .then(result => {
          if (result.success === true) {
            onSuccess(result.data);
          }
        })
        .catch(error => {
          onError();
        });
    } catch (err) {
      onError(err);
    }
  };
};

export const updateDealStatus = (data, onSuccess, onError) => {
  return async dispatch => {
    try {
      await fetch(
        `http://${BaseUrl}:3000/deal/changeDealStaus/${data.offerID}/${data.userID}/${data.status}`,
        {
          method: 'PUT',
          redirect: 'follow',
        },
      )
        .then(response => response.json())
        .then(result => {
          if (result.success === true) {
            onSuccess(result.data);
          }
        })
        .catch(error => {
          onError();
        });
    } catch (err) {
      onErrorCreatingOffer(err);
    }
  };
};

export const saveAllChats = data => {
  return {
    type: types.SAVE_ALL_CHAT,
    payload: data,
  };
};

export const saveSingleChat = data => {
  return {
    type: types.SAVE_INDIVIDUAL_CHAT,
    payload: data,
  };
};

export const saveNewMessage = data => {
  return {
    type: types.SAVE_IN_INDIVIDUAL_CHAT,
    payload: data,
  };
};

export const saveLastInChat = data => {
  return {
    type: types.LAST_IN_CHAT,
    payload: data,
  };
};
