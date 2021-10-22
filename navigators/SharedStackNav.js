import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Profile from "../screens/Profile";

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName }) {
	return (
		<Stack.Navigator
			headerMode="screen"
			screenOptions={{
				headerBackTitleVisible: false,
				headerTintColor: "white",
				headerStyle: {
					borderBottomColor: "rgba(255, 255, 255, 0.3)",
					shadowColor: "rgba(255, 255, 255, 0.3)",
					backgroundColor: "black",
				},
			}}
		>
			{screenName === "Home" ? (
				<Stack.Screen name={"Home"} component={Home} />
			) : null}
			{screenName === "Search" ? (
				<Stack.Screen name={"Search"} component={Search} />
			) : null}
			{screenName === "Profile" ? (
				<Stack.Screen name={"Profile"}>{() => <Profile />}</Stack.Screen>
			) : null}
		</Stack.Navigator>
	);
}
