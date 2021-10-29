import { gql, useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, Image } from "react-native";
import {
	Text,
	useWindowDimensions,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { cache } from "../apollo";
import DismissKeyboard from "../components/DismissKeyboard";

const SEARCH_COFFEE_SHOPS = gql`
	query searchCoffeeShops(
		$searchType: String!
		$keyword: String!
		$offset: Int!
	) {
		searchCoffeeShops(
			searchType: $searchType
			keyword: $keyword
			offset: $offset
		) {
			id
			name
			latitude
			longitude
			user {
				id
			}
			photos {
				id
				url
			}
			categories {
				id
			}
			isMine
		}
	}
`;
const MessageContainer = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;
const MessageText = styled.Text`
	margin-top: 15px;
	color: white;
	font-weight: 600;
`;

const Input = styled.TextInput`
	background-color: rgba(255, 255, 255, 1);
	color: black;
	width: ${(props) => props.width / 1.2}px;
	padding: 5px 10px;
`;

const SearchContainer = styled.View`
	flex-direction: row;
	align-items: center;
	background-color: white;
`;

const SearchType = styled.TouchableOpacity`
	flex-direction: row;
	margin-left: 10px;
`;

export default function Search({ navigation }) {
	const numColumns = 4;
	const [searchType, setSearchType] = useState("cafe");
	const { width } = useWindowDimensions();
	const { setValue, register, watch, handleSubmit, getValues } = useForm();
	const [startQueryFn, { refetch, fetchMore, loading, data, called, error }] =
		useLazyQuery(SEARCH_COFFEE_SHOPS);
	const onValid = ({ keyword }) => {
		cache.evict({ fieldName: "searchCoffeeShops" });
		startQueryFn({
			variables: {
				searchType,
				keyword,
				offset: 0,
			},
		});
	};
	const SearchBox = () => (
		<SearchContainer>
			<SearchType
				onPress={() =>
					setSearchType((prev) => (prev === "cafe" ? "list" : "cafe"))
				}
			>
				<Ionicons name={searchType} size={20} />
			</SearchType>
			<Input
				width={width}
				placeholderTextColor="rgba(0, 0, 0, 0.8)"
				placeholder="Search by Selected Type"
				autoCapitalize="none"
				returnKeyLabel="Search" // android
				returnKeyType="search" // ios
				autoCorrect={false}
				onChangeText={(text) => setValue("keyword", text)}
				onSubmitEditing={handleSubmit(onValid)}
			/>
		</SearchContainer>
	);
	useEffect(() => {
		navigation.setOptions({
			headerTitle: SearchBox,
		});
		register("keyword", {
			required: true,
		});
	}, [searchType]);
	const renderItem = ({ item: coffeeShop }) => (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("CoffeeShopScreen", {
					coffeeShopId: coffeeShop.id,
				})
			}
		>
			<Image
				source={{ uri: coffeeShop.photos[0].url }}
				style={{ width: width / numColumns, height: 800 }}
			/>
		</TouchableOpacity>
	);
	return (
		<DismissKeyboard>
			<View style={{ flex: 1, backgroundColor: "black" }}>
				{loading ? (
					<MessageContainer>
						<ActivityIndicator size="large" />
						<MessageText>Searching...</MessageText>
					</MessageContainer>
				) : null}
				{!called ? (
					<MessageContainer>
						<MessageText>Search by keyword</MessageText>
					</MessageContainer>
				) : null}
				{data?.searchCoffeeShops !== undefined ? (
					data?.searchCoffeeShops?.length === 0 ? (
						<MessageContainer>
							<MessageText>Could not find anything.</MessageText>
						</MessageContainer>
					) : (
						<FlatList
							onEndReachedThreshold={0.05}
							onEndReached={() =>
								fetchMore &&
								fetchMore({
									variables: {
										searchType,
										keyword: getValues("keyword"),
										offset: data?.searchCoffeeShops?.length,
									},
								})
							}
							numColumns={numColumns}
							data={data?.searchCoffeeShops}
							keyExtractor={(coffeeShop) => "CoffeeShop:" + coffeeShop.id}
							renderItem={renderItem}
						/>
					)
				) : null}
			</View>
		</DismissKeyboard>
	);
}
