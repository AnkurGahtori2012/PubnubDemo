const express = require('express');
const app = express();
const port = 3000;
var PubNub = require('pubnub');
var pubnub = new PubNub({
  subscribeKey: 'sub-c-e57520ec-966a-11ea-af75-c64b9203d8bd',
  publishKey: 'pub-c-c4d8a1e3-4881-4cc3-93c8-304caa0b0d20',
  secretKey: 'sec-c-YjRmMTZkMTMtYzViZS00N2Q3LWIxZjktM2U5YjgyYWQxNDRl',
  uuid: 'myUniqueUUID',
  ssl: true,
});

function addChannels(channelGroup, channels) {
  pubnub.channelGroups.addChannels(
    {
      channels: channels,
      channelGroup: channelGroup,
    },
    function (status) {
      if (status.error) {
        console.log('error in adding new channels: ', channels);
      } else {
        // no event for the "-events" channel add
        // because no one should be listening yet

        if (channels[0] == channelGroup + '-events') return;
        pubnub.publish(
          {
            channel: channelGroup + '-events',
            message: {
              action: 'add',
              channels: channels,
            },
          },
          function (status, response) {
            if (status.error) {
              console.log('channel addes but signal failed');
            } else {
              console.log(
                'channel added and signal sent :',
                channelGroup + '-events'
              );
              console.log(channels);
            }
          }
        );
      }
    }
  );
}

function removeChannels(channelGroup, channels) {
  pubnub.channelGroups.removeChannels(
    {
      channels: channels,
      channelGroup: channelGroup,
    },
    function (status) {
      if (status.error) {
        // handle error
        // if channel group has no 1 channel left (-events)
        // then we need to publish the "empty" event
        // or just notify the "remover"
      } else {
        // no event for the "-events" channel remove
        // because no one should be listening anymore
        if (channels[0] == channelGroup + '-events') return;

        pubnub.publish(
          {
            channel: channelGroup + '-events',
            message: {
              action: 'remove',
              channels: channels,
            },
          },
          function (status, response) {
            if (status.error) {
              console.log('channel removed but signal failed');
            } else {
              console.log(
                'channel remved and signla sent',
                channelGroup + '-events'
              );
              console.log(channels);
            }
          }
        );
      }
    }
  );
}

pubnub.grant({
  channels: ['group-2-events'],
  authKeys: ['auth-key-2'],
  read: true,
});
{
  // pubnub.channelGroups.addChannels(
  //   {
  //     channelGroup: 'space-1',
  //     channels: [
  //       'work',
  //       'fitness',
  //       'tech',
  //       'movies',
  //       'chats',
  //       'demo',
  //       'result',
  //       'chats1',
  //     ],
  //   },
  //   (status) => {
  //     console.log('adding channel response', status);
  //   }
  // );
  // pubnub.channelGroups.addChannels(
  //   {
  //     channelGroup: 'group-2',
  //     channels: ['g2-1', 'g2-3', 'g2-2', 'chats'],
  //   },
  //   (status) => {
  //     console.log('channel adding in group-2', status);
  //   }
  // );
  // pubnub.channelGroups
  //   .deleteGroup({ channelGroup: 'space-1' })
  //   .then((response) => {
  //     console.log('channelGroup response:  ', response);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // pubnub.channelGroups.addChannels(
  //   { channels: ['group-2-events'] },
  //   (status, response) => {
  //     console.log(status, 'group-2-events', response);
  //   }
  // );
}
pubnub.grant(
  {
    channelGroup: 'space-1',
    channels: ['work', 'fitness', 'tech', 'movies', 'chats'],
    authKeys: ['auth-key-2', 'auth-key-1'],
    read: true, // false to disallow
    write: true, // false to disallow
  },
  (status, response) => {
    // console.log(status, ': read and write permission :', response);
  }
);
pubnub.grant(
  {
    channelGroups: ['space-1', 'group-2'],
    authKeys: ['auth-key-1', 'auth-key-2'],
    read: true,
  },
  (status, response) => {
    // console.log('manage grant', status, response, 'manage grant');
  }
);

pubnub.grant({
  channelGroups: ['group-2'],
  channels: ['chats'],
  authKeys: ['auth-key-2'],
  read: true,
  write: true,
});
pubnub.grant({
  channels: ['chats'],
  authKeys: ['auth-key-5'],
  read: true,
  write: true,
});
pubnub.grant({
  channelGroups: ['space-1'],
  authKeys: ['auth-key-3'],
  read: true,
});

pubnub.hereNow(
  { includeState: true, includeUUIDs: true },
  (status, response) => {
    // console.log('available channels in global are:  ', status, response);
  }
);

pubnub.channelGroups
  .listGroups()
  .then((respnse) => {
    // console.log('channel group list : ', respnse);
  })
  .catch((err) => {
    // console.log('channel group', err);
  });
{
  // pubnub.channelGroups
  //   .listChannels({ channelGroup: 'group-2' })
  //   .then((res) => {
  //     console.log('channnel in groups are  : ', res);
  //   })
  //   .catch((err) => {
  //     console.log('group channel list error :', err);
  //   });
  // pubnub.deleteSpace('space-1', (status, response) => {
  //   console.log(status, 'removing space', response);
  // });
  // pubnub.channelGroups.removeChannels({
  //   channelGroup: 'space-1',
  //   channels: ['chats1'],
  // });
}
// pubnub.channelGroups.removeChannels({
//   channels: ['game1'],
//   channelGroup: 'group-2',
// });
removeChannels('group-2', ['game1']);
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/add', (req, res) => {
  addChannels('group-2', [req.query.channel]);
  res.send('added');
});
app.get('/remove', (req, res) => {
  removeChannels('group-2', [req.query.channel]);
  res.send('removed');
});
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
