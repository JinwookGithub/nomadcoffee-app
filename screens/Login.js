import { useRef } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { TextInput } from "../components/auth/AuthShared";
import React from "react";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";

const LOGIN_MUTATION = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			ok
			token
			error
		}
	}
`;

export default function Login() {
	const { register, handleSubmit, setValue, watch } = useForm();
	const passwordRef = useRef(null);
	const onCompleted = async (data) => {
		const {
			login: { ok, token, error },
		} = data;
		console.log(data);
		if (ok && token) {
			await logUserIn(token);
		}
		if (error) console.log(error);
	};
	const [logInMutation, { loading }] = useMutation(LOGIN_MUTATION, {
		onCompleted,
	});
	const onNext = (nextOne) => {
		nextOne?.current?.focus();
	};
	const onValid = (data) => {
		if (!loading) {
			console.log(data);
			logInMutation({
				variables: { ...data },
			});
		}
	};
	return (
		<AuthLayout>
			<TextInput
				value={watch("username")}
				placeholder="Username"
				returnKeyType="next"
				autoCapitalize="none"
				placeholderTextColor={"rgba(154, 142, 142, 0.6)"}
				onSubmitEditing={() => onNext(passwordRef)}
				onChangeText={(text) => setValue("username", text)}
			/>
			<TextInput
				value={watch("password")}
				ref={passwordRef}
				placeholder="Password"
				secureTextEntry
				returnKeyType="done"
				lastOne={true}
				placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
				onSubmitEditing={handleSubmit(onValid)}
				onChangeText={(text) => setValue("password", text)}
			/>
			<AuthButton
				text="Log In"
				loading={loading}
				disabled={!watch("username") || !watch("password")}
				onPress={handleSubmit(onValid)}
			/>
		</AuthLayout>
	);
}
