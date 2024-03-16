import React from 'react';
import MainNav from './src/navigation/mainNav';
import {SafeAreaView} from 'react-native';
import Toast from 'react-native-toast-message';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, persister} from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <SafeAreaView style={{flex: 1}}>
          <MainNav />
          <Toast />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
