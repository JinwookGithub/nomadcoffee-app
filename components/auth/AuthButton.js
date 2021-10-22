import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../colors";

const Button = styled.TouchableOpacity`
	background-color: ${colors.orange};
	padding: 15px 10px;
	border-radius: 3px;
	width: ${(props) => props.width};
	opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const ButtonText = styled.Text`
	color: white;
	font-weight: 600;
	text-align: center;
`;

export default function AuthButton({
	onPress,
	disabled,
	text,
	loading,
	width = "100%",
}) {
	return (
		<Button disabled={disabled} onPress={onPress} width={width}>
			{loading ? (
				<ActivityIndicator color="white" />
			) : (
				<ButtonText>{text}</ButtonText>
			)}
		</Button>
	);
}
