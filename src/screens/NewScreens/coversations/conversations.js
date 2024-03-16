import {Icon} from '@rneui/base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, CustomStyles, FontFamily, FontSize} from '../../../theme/theme';
import {useSelector} from 'react-redux';
import {BaseUrl} from '../../../utils/constans';
import {DateTimeString} from '../../../components/DateTimeString';

const Conversion = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {chats} = useSelector(state => state.home);
  const {userData} = useSelector(state => state.auth);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderCont(i18n.language)}
        onPress={() => {
          navigation.navigate('ChatScreen', {chatID: item.chatID});
        }}>
        <View style={styles.renderWrap(i18n.language)}>
          <Image
            source={{
              uri: `http://${BaseUrl}:3000/media/${item.profilePicture}`,
            }}
            style={styles.avatar}
          />
          <View style={styles.nameCont(i18n.language)}>
            <Text style={{...CustomStyles.subTitle}}>{item.recipientName}</Text>
            {item.conversation.length !== 0 && (
              <Text numberOfLines={1} style={styles.message}>
                <Text
                  style={{
                    color: Colors.primary,
                  }}>
                  {item?.conversation[item?.conversation.length - 1]?.sender ===
                  userData.userID
                    ? 'Me : '
                    : 'Him : '}
                </Text>
                {item?.conversation[item?.conversation.length - 1]?.message}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.timeWarp(i18n.language)}>
          <Text
            style={[
              {...CustomStyles.paragraph},
              {
                fontSize: 12,
              },
            ]}>
            {DateTimeString(
              item?.conversation[item?.conversation.length - 1]?.timestamp,
            )}
          </Text>

          {item.conversation.filter(
            f =>
              new Date(f.timestamp).getTime() >
              new Date(item.lastInChat[userData.userID]).getTime(),
          ).length !== 0 && (
            <View style={styles.msgBadge}>
              <Text style={styles.msgNum}>
                {
                  item.conversation.filter(
                    f =>
                      new Date(f.timestamp).getTime() >
                      new Date(item.lastInChat[userData.userID]).getTime(),
                  ).length
                }
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.topTab(i18n.language)}>
        <Icon
          name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
          type="ant-design"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{...CustomStyles.subTitle}}>{t('messages')}</Text>
        <View style={styles.iconCont(i18n.language)}>
          <Icon name="search" type="feather" size={20} />
          <Icon name="dots-three-vertical" type="entypo" size={20} />
        </View>
      </View>

      <FlatList
        renderItem={renderItem}
        data={chats}
        ListEmptyComponent={
          <Text
            style={{
              color: Colors.primary,
              fontFamily: FontFamily.subTitle,
              textAlign: 'center',
              marginTop: 50,
            }}>
            no chats to show
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topTab: language => {
    return {
      justifyContent: 'space-between',
      width: '95%',
      alignSelf: 'center',
      height: 40,
      alignItems: 'center',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  iconCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      width: '15%',
      justifyContent: 'space-between',
    };
  },
  renderCont: language => {
    return {
      height: 100,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    };
  },
  renderWrap: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
    };
  },
  avatar: {width: 50, height: 50, resizeMode: 'cover', borderRadius: 100},
  nameCont: language => {
    return {
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
      marginLeft: language === 'en' ? 14 : 0,
      marginRight: language === 'en' ? 0 : 14,
    };
  },
  message: {
    ...CustomStyles.paragraph,
    width: 120,
    fontSize: FontSize.short,
  },
  timeWarp: language => {
    return {
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
    };
  },
  msgBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: 18,
    height: 18,
  },
  msgNum: {
    fontSize: 11,
    color: 'white',
  },
});
export default Conversion;
