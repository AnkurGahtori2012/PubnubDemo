import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PubNub from 'pubnub';
import {PubNubProvider} from 'pubnub-react';
import {EmojiPickerView} from './views/EmojiPicker';
import {ChatView} from './views/Chat';
import Channels from './views/Channel';
const pubnub = new PubNub({
  subscribeKey: 'sub-c-e57520ec-966a-11ea-af75-c64b9203d8bd',
  publishKey: 'pub-c-c4d8a1e3-4881-4cc3-93c8-304caa0b0d20',
  restore: true,
});
console.disableYellowBox = true;
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <PubNubProvider client={pubnub}>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="EmojiPicker" component={EmojiPickerView} />
          <Stack.Screen name="Channels" component={Channels} />
          <Stack.Screen name="Chat" component={ChatView} />
        </Stack.Navigator>
      </PubNubProvider>
    </NavigationContainer>
  );
}
