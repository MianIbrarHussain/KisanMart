import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import socketService from '../../utils/socketservice';
import {BaseUrl} from '../../utils/constans';
import HomeDrawer from '../Drawers/HomeDrawer';
import Conversion from '../../screens/NewScreens/coversations/conversations';
import ChatScreen from '../../screens/NewScreens/chatScreen/chatScreen';
import Notification from '../../screens/NewScreens/notification/notification';
import TermsConditions from '../../screens/NewScreens/terms&Conditions/terms&Conditions';
import PrivacyPolicy from '../../screens/NewScreens/privacyPolicy/privacyPolicy';
import MyDeals from '../../screens/NewScreens/myDeals/myDeals';
import DealDetail from '../../screens/NewScreens/dealDetails/dealDetails';
import MyProfile from '../../screens/NewScreens/myProfile/myProfile';
import ProductDetail from '../../screens/NewScreens/productDetail/productDetail';
import AddProduct from '../../screens/NewScreens/addProduct/addProduct';
import SellerInfo from '../../screens/NewScreens/sellerInfo/sellerInfo';
import CategoryListing from '../../screens/NewScreens/categoryListing/categoryListing';
import {
  saveAllChats,
  saveLastInChat,
  saveNewMessage,
  saveSingleChat,
} from '../../redux/actions/home';

const NewHomeStack = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);

  useEffect(() => {
    socketService.initializeSocket(`http://${BaseUrl}:3000/`, {
      userID: userData.userID,
    });

    const handleChatUpdate = chatData => dispatch(saveAllChats(chatData));
    const handleNewChatUpdate = chatData => {
      if (chatData.userID === userData.userID) {
        dispatch(saveSingleChat(chatData.chatData));
      }
    };
    const handleMessageUpdate = messageData => {
      dispatch(saveNewMessage(messageData));
    };

    const handleNewOffer = messageData => {
      dispatch(saveNewMessage(messageData));
    };

    const handleLastInChat = lastInChat => {
      dispatch(saveLastInChat(lastInChat));
    };

    socketService.on('chatUpdate', handleChatUpdate);
    socketService.on('newMessage', handleMessageUpdate);
    socketService.on('newChat', handleNewChatUpdate);
    socketService.on('newOffer', handleNewOffer);
    socketService.on('lastInChat', handleLastInChat);

    return () => {
      socketService.disconnectSocket();
      socketService.removeListener('chatUpdate', handleChatUpdate);
      socketService.removeListener('newMessage', handleMessageUpdate);
      socketService.removeListener('newChat', handleNewChatUpdate);
      socketService.removeListener('newOffer', handleNewOffer);
      socketService.removeListener('lastInChat', handleLastInChat);
    };
  }, [dispatch, userData]);

  return (
    <Stack.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="MyDeals" component={MyDeals} />
      <Stack.Screen name="DealDetail" component={DealDetail} />
      <Stack.Screen name="Conversion" component={Conversion} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="SellerInfo" component={SellerInfo} />
      <Stack.Screen name="CategoryListing" component={CategoryListing} />
    </Stack.Navigator>
  );
};

export default NewHomeStack;
