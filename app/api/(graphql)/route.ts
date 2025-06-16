import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { UserFieldResolver } from "@graphql/User/fields";
import { UserMutationResolver } from "@graphql/User/mutations";
import { UserQueryResolver } from "@graphql/User/queries";
import { ChatFieldResolvers } from "@graphql/Chat/fields";
import { ChatMutationResolvers } from "@graphql/Chat/mutations";
import { ChatQueryResolvers } from "@graphql/Chat/queries";
import { RequestMutationResolver } from "@graphql/Request/mutations";
import { RequestQueryResolver } from "@graphql/Request/queries";
import { TrustedQueryResolvers } from "@graphql/Trusted/queries";
import type { NextRequest } from "next/server";
import { buildTypeDefsAndResolvers } from "type-graphql";

import type { AuthorizedContext, Context } from "../lib/auth/context";
import { authChecker, context } from "../lib/auth/context";

const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  resolvers: [
    UserQueryResolver,
    UserMutationResolver,
    UserFieldResolver,
    ChatQueryResolvers,
    ChatMutationResolvers,
    ChatFieldResolvers,
    RequestQueryResolver,
    RequestMutationResolver,
    TrustedQueryResolvers,
  ],
  authChecker,
  validate: true,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),
    {
      async requestDidStart({ request, contextValue }) {
        if (
          (contextValue as AuthorizedContext).onlyQuery &&
          !request.query?.startsWith("query")
        )
          (contextValue as Context).userId = null;
      },
    },
  ],
  introspection: process.env.NODE_ENV !== "production",
  status400ForVariableCoercionErrors: true,
});
const handler = startServerAndCreateNextHandler(server, {
  context,
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
