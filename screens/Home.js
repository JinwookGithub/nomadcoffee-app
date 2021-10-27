import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/coffeeShop/ScreenLayout";
import { RefreshControl } from "react-native";
import CoffeeShop from "../components/coffeeShop/CoffeeShop";

const SEE_COFFEE_SHOPS = gql`
	query seeCoffeeShops($page: Int!) {
		seeCoffeeShops(page: $page) {
			coffeeShops {
				id
				name
				latitude
				longitude
				user {
					id
					name
					avatarURL
				}
				photos {
					id
					url
				}
				categories {
					id
					name
				}
			}
		}
	}
`;

const Container = styled.View`
	background-color: black;
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export default function Home() {
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const { data, loading, error, refetch, fetchMore } = useQuery(
		SEE_COFFEE_SHOPS,
		{
			variables: { page: 1 },
		}
	);
	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};
	const renderCoffeeShop = ({ item: coffeeShop }) => (
		<CoffeeShop coffeeShop={coffeeShop} />
	);
	return (
		<ScreenLayout loading={loading}>
			<FlatList
				style={{ width: "100%" }}
				showsVerticalScrollIndicator={false}
				onEndReachedThreshold={0.05}
				onEndReached={() => {
					setPage((prev) => {
						const next = prev + 1;
						fetchMore({
							variables: {
								page: next,
							},
						});
						return next;
					});
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#fff"
					/>
				}
				data={data?.seeCoffeeShops?.coffeeShops}
				keyExtractor={(coffeeShops) => "CoffeeShop:" + coffeeShops.id}
				renderItem={renderCoffeeShop}
			/>
		</ScreenLayout>
	);
}
