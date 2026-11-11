import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { firebase } from '../../config';

export default function Detail() {
  const { id, heading } = useLocalSearchParams<{ id: string; heading: string }>();
  const todoRef = firebase.firestore().collection('todos');
  const [textHeading, onChangeHeadingText] = useState<string>(heading ?? '');

  const updateTodo = () => {
    if (textHeading && textHeading.trim().length > 0 && id) {
      todoRef
        .doc(id)
        .update({
          heading: textHeading.trim(),
        })
        .then(() => {
          router.back();
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.textField}
          onChangeText={onChangeHeadingText}
          value={textHeading}
          placeholder="Update Todo"
        />
        <Pressable style={styles.buttonUpdate} onPress={updateTodo}>
          <Text>UPDATE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065',
  },
});
