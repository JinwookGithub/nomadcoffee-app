import AppLoading from "expo-app-loading";
import TabNav from "./navigators/TabNav";
import { AppearanceProvider } from "react-native-appearance";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
	// preload
	console.log("start");
	const isLoggedIn = useReactiveVar(isLoggedInVar);
	const [loading, setLoading] = useState(true);
	const onFinish = () => setLoading(false);
	const preloadAssets = () => {
		const fontsToLoad = [Ionicons.font];
		const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
		const imagesToLoad = [
			"https://www.pinclipart.com/picdir/middle/444-4443670_free-png-coffee-logo-image-png-images-transparent.png",
		];
		const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
		return Promise.all([...fontPromises, ...imagePromises]);
	};
	const preload = async () => {
		console.log("preload");
		const token = await AsyncStorage.getItem("token");
		if (token) {
			isLoggedInVar(true);
			tokenVar(token);
		}
		return preloadAssets();
	};
	if (loading) {
		console.log(loading);
		return (
			<AppLoading
				startAsync={preload}
				onError={console.warn}
				onFinish={onFinish}
			/>
		);
	}
	console.log(isLoggedIn);
	return (
		<ApolloProvider client={client}>
			<AppearanceProvider>
				<NavigationContainer>
					<TabNav isLoggedIn={isLoggedIn} />
				</NavigationContainer>
			</AppearanceProvider>
		</ApolloProvider>
	);
}
