import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {usePubNub} from 'pubnub-react';

const Channels = ({navigation, route}) => {
  const userName = route.params.name;
  const userEmoji = route.params.emoji;
  const pubnub = usePubNub();

  const [Channels, setChannels] = useState(null);

  const addChannel = useCallback(channel => {
    console.log('adding channel');
    setChannels(data => [...data, channel]);
  }, []);
  const removeChannel = useCallback(channel => {
    console.log('removing console');
    setChannels(data => {
      let newChannels = [];
      for (let i = 0; i < data.length; i++) {
        if (channel !== data[i]) {
          newChannels.push(data[i]);
        }
      }
    });
  }, []);
  const fetchChannels = useCallback(() => {
    pubnub.channelGroups
      .listChannels({channelGroup: 'group-2'})
      .then(response => {
        console.log(response);
        setChannels(response.channels);
      })
      .catch(err => {
        console.log('error in getting group-2', error);
      });
  }, []);
  useEffect(() => {
    if (userName === 'ankur1') {
      console.log('user is ', userName);
      pubnub.setAuthKey('auth-key-1');
    } else if (userName === 'ankur2') {
      console.log('user is ', userName);

      pubnub.setAuthKey('auth-key-2');
    } else {
      console.log('user is ', userName);
      pubnub.setAuthKey('auth-key-4');
    }
    fetchChannels();
    pubnub.setUUID(userName + userEmoji);

    let listener = {
      message: function(m) {
        console.log('new message');
        fetchChannels();
        // handle message
        var channelName = m.channel; // The channel for which the message belongs
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        var msg = m.message; // The Payload
        var publisher = m.publisher; //The Publisher
        // console.log(m);
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
    pubnub.subscribe({channels: ['group-2-events']});
    pubnub.addListener(listener);
    return () => {
      console.log('removing listener for available channel');
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
    };
  }, []);

  const handleChannel = item => {
    navigation.navigate('Chat', {...route.params, channel: item});
  };
  if (!Channels) {
    return <ActivityIndicator size={30} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={Channels}
        renderItem={({item}) => (
          <SingleChannel item={item} handleChannel={handleChannel} />
        )}
        keyExtractor={(item, indes) => item + indes}
        numColumns={2}
      />
    </View>
  );
};
export default Channels;
const SingleChannel = ({item, handleChannel}) => {
  const pubnub = usePubNub();
  const [newMessageCount, setNewMessageCount] = useState();

  return (
    <View style={styles.GridViewContainer}>
      <Text
        style={styles.GridViewTextLayout}
        onPress={() => {
          handleChannel(item);
        }}>
        {item}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 5,
    backgroundColor: '#7B1FA2',
  },
  GridViewTextLayout: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: '#fff',
    padding: 10,
  },
});
