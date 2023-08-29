import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {Database, KyselyAdapter, KyselyAuth} from "@auth/kysely-adapter";
import {D1Dialect} from "kysely-d1";
import {binding} from "cf-bindings-proxy";
import {D1Database} from "@cloudflare/workers-types";
import {SqliteAdapter} from "kysely";

const kyselyDb = new KyselyAuth<Database>({
  dialect: new D1Dialect({
    database: binding<D1Database>("DB"),
  })
});

const executor = kyselyDb.getExecutor();
const adapter = executor.adapter;

console.log("is D1Dialect KyseAuth Adapter instanceof SqliteAdapter", adapter instanceof SqliteAdapter ? "true" : "false");

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_ID,
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET,
    }),
  ],
  /* @ts-ignore */
  adapter: KyselyAdapter(kyselyDb),
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
