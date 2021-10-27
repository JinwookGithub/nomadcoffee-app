import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Profile from "../screens/Profile";
import checkMe from "../hooks/checkMe";

const Stack = createNativeStackNavigator();

export default function SharedStackNav({ screenName }) {
	const { data } = checkMe();
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
				<Stack.Screen name={"Profile"}>
					{() => <Profile username={data?.me?.username} />}
				</Stack.Screen>
			) : null}
		</Stack.Navigator>
	);
}
