import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { firebase } from '../../config';

interface Todo {
  id: string;
  heading: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addData, setAddData] = useState<string>('');
  const todoRef = firebase.firestore().collection('todos');

  useEffect(() => {
    const unsubscribe = todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const newTodos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const { heading } = doc.data() as { heading: string };
          newTodos.push({
            id: doc.id,
            heading: heading ?? '',
          });
        });
        setTodos(newTodos);
      });

    return () => unsubscribe();
  }, []);

  // Delete a todo from firestore db
  const deleteTodo = (todo: Todo) => {
    todoRef
      .doc(todo.id)
      .delete()
      .then(() => {
        // show a successful alert
        // alert("Deleted Successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Add a todo
  const addTodo = () => {
    // Check if we have a todo
    if (addData && addData.trim().length > 0) {
      // Get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData.trim(),
        createdAt: timestamp,
      };
      todoRef
        .add(data)
        .then(() => {
          setAddData('');
          // Release keyboard
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add A New Todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={(heading) => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Pressable
              style={styles.container}
              onPress={() =>
                router.push({
                  pathname: '/detail',
                  params: { id: item.id, heading: item.heading },
                })
              }>
              <FontAwesome
                name="trash-o"
                color="red"
                onPress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading} numberOfLines={1}>
                  {item.heading
                    ? item.heading[0].toUpperCase() + item.heading.slice(1)
                    : ''}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 45,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
});
