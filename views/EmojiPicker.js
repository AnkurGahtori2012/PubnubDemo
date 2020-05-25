import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView, Button, View} from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import {TextInput} from 'react-native-gesture-handler';
export const EmojiPickerView = ({navigation}) => {
  const [chosenEmoji, setEmoji] = useState(null);
  const [inputName, setInputName] = useState(null);
  const handleEmojiSelected = emoji => {
    setEmoji(emoji);
  };

  const handleContinueButton = () => {
    if (chosenEmoji !== null) {
      navigation.replace('Channels', {emoji: chosenEmoji, name: inputName});
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {chosenEmoji ? (
        <>
          <View style={styles.topContainer}>
            <View
              style={{
                ...styles.emojiContainer,
                ...(chosenEmoji === null ? styles.empty : {}),
              }}>
              <Text style={styles.emoji}>{chosenEmoji || ''}</Text>
            </View>
            <TextInput
              style={{textAlign: 'center'}}
              placeholder="ENTER YOUR NAME"
              onChangeText={text => {
                setInputName(text);
              }}
            />
            <Button
              disabled={!inputName}
              style={styles.continueButton}
              title="Continue"
              onPress={handleContinueButton}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.topContainer}>
            <Text style={styles.hint}>
              Pick an emoji that will represent you in the chat!
            </Text>
            <View
              style={{
                ...styles.emojiContainer,
                ...(chosenEmoji === null ? styles.empty : {}),
              }}>
              <Text style={styles.emoji}>{chosenEmoji || ''}</Text>
            </View>
          </View>
          <View style={{height: '50%'}}>
            <EmojiSelector onEmojiSelected={handleEmojiSelected} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  topContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  continueButton: {
    marginVertical: 64,
    width: 300,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    marginVertical: 32,
  },
  emoji: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 60,
  },
  empty: {
    borderWidth: 5,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
});
