"use client";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";

const httpLink = createHttpLink({
  uri: "http://localhost:4040/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get("accessToken");
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function GraphQLWrapper({ children }) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>{children}</Provider>
    </ApolloProvider>
  );
}
