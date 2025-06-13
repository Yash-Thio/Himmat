"use client";

import {
  HttpLink,
  type OperationVariables,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { GraphQLError } from "graphql/error";
import type { PropsWithChildren } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useToken } from "./auth-client";

function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        InstagramStats: {
          keyFields: ["username"],
        },
      },
    }),
    link: new HttpLink({
      uri: `/api`,
    }),
  });
}

export function ApolloWrapper({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

export const tokenContext = (token?: string | null) => {
  if (!token) return undefined;
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
    credentials: `omit`,
  };
};

export function useAuthQuery<T, V extends OperationVariables>(
  query: TypedDocumentNode<T, V>,
  variables?: V,
) {
  const token = useToken();
  const [fetch, result] = useLazyQuery(query);
  const [calledVars, setCalledVars] = useState<string | undefined>();
  useEffect(() => {
    if (token && variables && calledVars !== JSON.stringify(variables)) {
      setCalledVars(JSON.stringify(variables));
      void fetch({
        variables,
        context: tokenContext(token),
      });
    }
  }, [fetch, token, variables, calledVars]);
  const reFetch = useCallback(
    (v?: V) =>
      fetch({
        variables: v,
        context: tokenContext(token),
      }),
    [fetch, token],
  );
  return [reFetch, result] as const;
}

export function useAuthMutation<T, V extends OperationVariables>(
  mutation: TypedDocumentNode<T, V>,
) {
  const token = useToken();
  const [mutate, result] = useMutation(mutation);
  const method = useCallback(
    (variables?: V) =>
      mutate({
        variables,
        context: tokenContext(token),
      }),
    [token],
  );
  return [method, result] as const;
}

export function handleGQLErrors(error?: GraphQLError) {
  if (error?.message) toast.error(error.message);
}
