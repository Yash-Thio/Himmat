import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type OperationVariables,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { GraphQLFormattedError } from "graphql/error";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import type { FC } from "react";
import { Suspense } from "react";

import { GET_CURRENT_USER } from "./queries";

export const { query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`,
      credentials: "include",
    }),
  });
});

type OmittedProps<Y> = Omit<Omit<Y, "loading">, "data">;

type ComponentProps<Y> =
  OmittedProps<Y> extends Record<string, never>
    ? { props?: object }
    : { props: OmittedProps<Y> };

export function Injector<T, Y>({
  fetch,
  Component,
  props,
}: {
  fetch: () => Promise<T>;
  Component: FC<{ data?: T; loading: boolean } & Y>;
} & ComponentProps<Y>) {
  return (
    <Suspense fallback={<Component {...((props || {}) as Y)} loading />}>
      {/*@ts-expect-error -- to allow dynamic props*/}
      <InjectorSuspensed Component={Component} fetch={fetch} props={props} />
    </Suspense>
  );
}
async function InjectorSuspensed<T, Y>({
  fetch,
  Component,
  props,
}: {
  fetch: () => Promise<T>;
  Component: FC<{ data?: T; loading: boolean } & Y>;
} & ComponentProps<Y>) {
  const data = await fetch();
  return (
    <Suspense fallback={<Component loading {...((props || {}) as Y)} />}>
      <Component loading={false} {...((props || {}) as Y)} data={data} />
    </Suspense>
  );
}

function checkErrors(errors?: readonly GraphQLFormattedError[]) {
  if (errors && errors.length > 0)
    throw new Error(errors.map((e) => e.message).join(" | "));
}

export async function queryGQL<T, V extends OperationVariables>(
  _query: TypedDocumentNode<T, V>,
  variables?: V,
  Cookie?: ReadonlyRequestCookies,
  revalidate?: number,
  tags?: string[],
): Promise<T> {
  const res = await query({
    query: _query,
    variables,
    context: {
      headers: {
        Cookie,
      },
      fetchOptions: {
        cache: revalidate === undefined ? "force-cache" : undefined,
        next: {
          revalidate,
          tags,
        },
      },
    },
  });
  checkErrors(res.errors);
  return res.data;
}

export async function getCurrentUser() {
  return queryGQL(GET_CURRENT_USER, undefined, await cookies(), 0);
}
