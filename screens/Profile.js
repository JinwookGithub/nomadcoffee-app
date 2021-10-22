import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { UserAvatar } from "../components/user/UserAvatar";
import AuthButton from "../components/AuthButton";
import { logUserOut } from "../apollo";

const SEE_PROFILE_QUERY = gql`
	query seeProfile($username: String!) {
		seeProfile(username: $username) {
			name
			username
			email
			location
			avatarURL
			githubUsername
		}
	}
`;

const WText = styled.Text`
	color: white;
	font-size: 20px;
`;

const Wrapper = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const Layout = styled.View`
	padding: 0 4px;
	background-color: black;
	flex: 1;
`;

export default function Profile() {
	const { data } = useQuery(SEE_PROFILE_QUERY, {
		variables: { username },
	});
	return (
		<Layout>
			<Wrapper>
				<UserAvatar
					resizeMode="cover"
					uri={data?.seeProfile?.avatarURL}
					username={data?.seeProfile?.username}
				/>

				<AuthButton
					text="Logout"
					loading={false}
					disabled={false}
					onPress={logUserOut}
					width={"30%"}
				/>
			</Wrapper>
			<WText>{`email: ${data?.seeProfile?.email}`}</WText>
			<WText>{`name: ${data?.seeProfile?.name}`}</WText>
			<WText>{`location: ${data?.seeProfile?.location}`}</WText>
			<WText>{`github: ${data?.seeProfile?.githubUsername}`}</WText>
		</Layout>
	);
}
