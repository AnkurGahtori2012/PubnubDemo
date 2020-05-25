import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {usePubNub} from 'pubnub-react';
export const ChatView = ({route}) => {
  const userName = route.params.name;
  const userEmoji = route.params.emoji;
  const pubnub = usePubNub();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  // pubnub.hereNow(
  //   {
  //     channels: [route.params.channel],
  //     includeUUIDs: true,
  //     includeState: true,
  //   },
  //   (status, response) => {
  //     // handle status, response
  //     console.log(status, 'check online user in channel', response.channels);
  //   },
  // );
  useEffect(() => {
    pubnub.hereNow(
      {includeState: true, includeUUIDs: true},
      (status, response) => {
        console.log('available channels in global are:  ', status, response);
      },
    );
    if (pubnub) {
      let listener = {
        message: function(m) {
          console.log('new message');
          setMessages(msg => {
            return [...msg, {author: m.publisher, content: m.message.content}];
          });
          // handle message
          var channelName = m.channel; // The channel for which the message belongs
          var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
          var pubTT = m.timetoken; // Publish timetoken
          var msg = m.message; // The Payload
          var publisher = m.publisher; //The Publisher
          console.log(m);
        },
        presence: function(p) {
          // handle presence
          var action = p.action; // Can be join, leave, state-change or timeout
          var channelName = p.channel; // The channel for which the message belongs
          var occupancy = p.occupancy; // No. of users connected with the channel
          var state = p.state; // User State
          var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
          var publishTime = p.timestamp; // Publish timetoken
          var timetoken = p.timetoken; // Current timetoken
          var uuid = p.uuid; // UUIDs of users who are connected with the channel
          console.log(p);
        },
        signal: function(s) {
          // handle signal
          var channelName = s.channel; // The channel for which the signal belongs
          var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
          var pubTT = s.timetoken; // Publish timetoken
          var msg = s.message; // The Payload
          var publisher = s.publisher; //The Publisher
          console.log(s);
        },
        user: function(userEvent) {
          // for Objects, this will trigger when:
          // . user updated
          // . user deleted
          console.log(userEvent);
        },
        space: function(spaceEvent) {
          // for Objects, this will trigger when:
          // . space updated
          // . space deleted
          console.log(spaceEvent);
        },
        membership: function(membershipEvent) {
          // for Objects, this will trigger when:
          // . user added to a space
          // . user removed from a space
          // . membership updated on a space
        },
        messageAction: function(ma) {
          // handle message action
          var channelName = ma.channel; // The channel for which the message belongs
          var publisher = ma.publisher; //The Publisher
          var event = ma.message.event; // message action added or removed
          var type = ma.message.data.type; // message action type
          var value = ma.message.data.value; // message action value
          var messageTimetoken = ma.message.data.messageTimetoken; // The timetoken of the original message
          var actionTimetoken = ma.message.data.actionTimetoken; //The timetoken of the message action
          console.log('message action');
        },
        status: function(s) {
          var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
          var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
          var category = s.category; //Returns PNConnectedCategory
          var operation = s.operation; //Returns PNSubscribeOperation
          var lastTimetoken = s.lastTimetoken; //The last timetoken used in the subscribe request, of type long.
          var currentTimetoken = s.currentTimetoken; //The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
          var subscribedChannels = s.subscribedChannels; //All the current subscribed channels, of type array.
          console.log(s, 'status');
        },
      };
      pubnub.addListener(listener);
      pubnub.subscribe({
        channelGroups: ['group-2'],
      });

      return () => {
        console.log('changing channel');
        setMessages([]);
        pubnub.removeListener(listener);
        pubnub.unsubscribeAll();
      };
    }
  }, [pubnub, route.params.channel, userEmoji, userName]);
  const handleSubmit = () => {
    // pubnub.getSpaces({limit: 10}, (status, Response) => {
    //   console.log(status, '----------------', Response);
    // });
    setInput('');
    const message = {
      content: input,
      id: Math.random()
        .toString(16)
        .substr(2),
    };
    pubnub.publish(
      {channelGroup: 'space-1', channel: route.params.channel, message},
      (status, response) => {
        console.log(status, ':  message publish   :', response);
      },
    );
  };
  return (
    <SafeAreaView style={styles.outerContainer}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior="height"
        keyboardVerticalOffset={Platform.select({
          ios: 78,
          android: 0,
        })}>
        <View style={styles.topContainer}>
          {messages.map(message => (
            <View key={message.timetoken} style={styles.messageContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarContent}>{message.author}:</Text>
              </View>
              <View style={styles.messageContent}>
                <Text>{message.content}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            placeholder="Type your message here..."
          />
          <View style={styles.submitButton}>
            {input !== '' && <Button title="Send" onPress={handleSubmit} />}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
  },
  topContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
  },
  avatar: {
    // width: 38,
    // height: 38,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarContent: {
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  messageContent: {
    flex: 1,
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    elevation: 2,
  },
  submitButton: {
    position: 'absolute',
    right: 32,
  },
});
