import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTab from "./bottomTab";
import StoryScreen from "../screens/story";

const Stack = createStackNavigator();

const stackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomTab} />
      <Stack.Screen name="StoryScreen" component={StoryScreen} />
    </Stack.Navigator>
  );
};
export default stackNavigator;
