import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");
const TOKEN = "token";

export const logUserIn = async (token) => {
	await AsyncStorage.setItem(TOKEN, token);
	isLoggedInVar(true);
	tokenVar(token);
};

export const logUserOut = async () => {
	await AsyncStorage.removeItem(TOKEN);
	isLoggedInVar(false);
	tokenVar("");
};

const httpLink = createHttpLink({
	uri: "https://nomadcoffee-backend-byjjw.herokuapp.com/graphql",
});

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			token: tokenVar(),
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					searchCoffeeShops: offsetLimitPagination(),
					seeCoffeeShops: offsetLimitPagination(),
				},
			},
		},
	}),
});
export default client;
