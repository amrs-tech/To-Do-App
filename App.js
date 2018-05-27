import React, { Component } from "react";
import Header, { He } from './Header';
import NavigationBar from 'react-native-navbar';
import { CheckBox } from 'react-native-elements';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View,
  Button,
  FlatList,
  AsyncStorage,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default class TodoList extends Component {
   
  state = {
    tasks: [],
    text: "",
    textValue: "Not-DONE"
  };
  
  
  onClick = () => {
    this.setState({backgroundColor: 'green'})
  }

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text, textValue } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }),
            text: "",
            
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
  };
  

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(i, 1);

        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
   
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding}]}
      >
      <View style={{width:"100%", height: 40, backgroundColor: 'skyblue', color:'black'}}>
      <Text style={{paddingTop:5, paddingLeft: 8, fontSize: 20, fontWeight:'bold', justifyContent:'center', textAlign:'center'}}>To-Do App</Text>
      </View>
      <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Tasks"
          returnKeyType="Add"
          returnKeyLabel="Add"
        />
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.hr} />
              
              <View style={styles.listItemCont}>
                <TouchableOpacity>
                  <Text style={styles.listItem} >
                    {item.text}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{
                     borderWidth:0,
                     borderColor:'rgba(66, 152, 244, 1)',
                     alignItems:'center',
                     justifyContent:'center',
                     width:45,
                     height:28,
                     backgroundColor:'rgb(66, 152, 244)',
                     borderRadius:5,
                   }} onPress={()=>{Alert.alert(
                      item.text+' :Marking Completed',
                      'Press OK to remove!',
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => this.deleteTask(index)},
                      ],
                      { cancelable: false }
                    )}}>
                  <Text>Mark</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                 style={{
                     borderWidth:0,
                     borderColor:'rgba(66, 152, 244, 1)',
                     alignItems:'center',
                     justifyContent:'center',
                     width:28,
                     height:28,
                     backgroundColor:'grey',
                     borderRadius:100,
                   }} onPress={() => this.deleteTask(index)} >
                 <Text style={{color: 'white', fontWeight: 'bold'}}>X</Text>
               </TouchableOpacity>
              </View>
              
              <View style={styles.hr} />
            </View>}
        />
        
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    borderWidth:2, 
    borderColor:'black',
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 5,
    fontSize: 18,
  },
  hr: {
    height: 1,
    paddingTop: 2,
    backgroundColor: "black"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    width: "100%"
  },
  
});

