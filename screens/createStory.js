import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  Button,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image1",
      dropDownHeight: 40,
      light_theme: true,
    };
  }

  async addStory() {
    if (
      this.state.title &&
      this.state.description &&
      this.state.story &&
      this.state.moral
    ) {
      let storyData = {
        preview_image: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
      };
      await firebase
        .database()
        .ref("/posts/" + Math.random().toString(36).slice(2))
        .set(storyData)
        .then(function (snapshot) {});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed");
    } else {
      Alert.alert(
        "Error",
        "Todos os campos são obrigatórios!",
        [{ text: "OK", onPress: () => console.log("OK Pressionado") }],
        { cancelable: false }
      );
    }
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  fetchUser() {
    var theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (data) => {
        theme = data.val().current_theme;
        this.setState({
          light_theme: theme === "light",
        });
      });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let previewImages = {
        image1: require("../assets/story_image_1.png"),
        image2: require("../assets/story_image_2.png"),
        image3: require("../assets/story_image_3.png"),
        image4: require("../assets/story_image_4.png"),
        image5: require("../assets/story_image_5.png"),
      };
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }
              >
                Nova História
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={previewImages[this.state.previewImage]}
                style={styles.previewImage}
              />
              <View
                style={{
                  height: RFValue(this.state.dropDownHeight),
                }}
              >
                <DropDownPicker
                  items={[
                    { label: "Image1", value: "image1" },
                    { label: "Image2", value: "image2" },
                    { label: "Image3", value: "image3" },
                    { label: "Image4", value: "image4" },
                    { label: "Image5", value: "image5" },
                  ]}
                  defaultValue={this.state.previewImage}
                  open={this.state.dropDownHeight === 170 ? true : false}
                  onOpen={() => {
                    this.setState({ dropDownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropDownHeight: 40 });
                  }}
                  placeholder={this.state.previewImage}
                  onSelectItem={(item) => {
                    this.setState({ previewImage: item.value });
                  }}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: this.state.light_theme ? "black" : "white",
                    color: this.state.light_theme ? "black" : "white",
                  }}
                  textStyle={{
                    color:
                      this.state.dropDownHeight === 170 ? "black" : "white",
                    fontFamily: "Bubblegum-Sans",
                  }}
                  placeholderStyle={{
                    color: this.state.light_theme ? "black" : "white",
                  }}
                />
              </View>
              <TextInput
                style={
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont
                }
                onChangeText={(title) => {
                  this.setState({ title });
                }}
                placeholder={"titulo"}
                placeholderTextColor={
                  this.state.light_theme ? "black" : "white"
                }
              />
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(description) => {
                  this.setState({ description });
                }}
                placeholder={"descrição"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? "black" : "white"
                }
              />
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(story) => {
                  this.setState({ story });
                }}
                placeholder={"historia"}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor={
                  this.state.light_theme ? "black" : "white"
                }
              />
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(moral) => {
                  this.setState({ moral });
                }}
                placeholder={"moral"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? "black" : "white"
                }
              />
              <View style={styles.submitButton}>
                <Button
                  onPress={() => this.addStory()}
                  title="Submit"
                  color="#841584"
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#94F0EF",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain",
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "white",
    fontFamily: "Bubblegum-Sans",
  },
  inputFontLight: {
    height: RFValue(40),
    borderColor: "black",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "black",
    fontFamily: "Bubblegum-Sans",
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
  },
});
