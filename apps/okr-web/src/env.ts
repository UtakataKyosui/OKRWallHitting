import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import * as dotenvx from "@dotenvx/dotenvx";

export const env = createEnv({
    server: {
        OPENROUTER_API_KEY: z.string().min(1),
    },
    "runtimeEnv": {
        OPENROUTER_API_KEY: dotenvx.get("OPENROUTER_API_KEY") || process.env.OPENROUTER_API_KEY,
    }
});
