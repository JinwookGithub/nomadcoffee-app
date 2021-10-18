import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
	// preload
	const [loading, setLoading] = useState(true);
	const onFinish = () => setLoading(false);
	const preload = () => {
		const fontsToLoad = [Ionicons.font];
		console.log(fontsToLoad);
		const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));

		const imagesToLoad = [
			"https://www.pinclipart.com/picdir/middle/444-4443670_free-png-coffee-logo-image-png-images-transparent.png",
		];
		const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
		return Promise.all([...fontPromises, ...imagePromises]);
	};
	if (loading) {
		return (
			<AppLoading
				startAsync={preload}
				onError={console.warn}
				onFinish={onFinish}
			/>
		);
	}
	return (
		<View style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
