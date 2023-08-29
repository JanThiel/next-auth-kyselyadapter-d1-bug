import {D1Database} from "@cloudflare/workers-types";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB: D1Database;
            NEXTAUTH_GOOGLE_ID: string;
            NEXTAUTH_GOOGLE_SECRET: string;
            NEXTAUTH_DEBUG: string;
        }
    }
}