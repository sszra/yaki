import { authMiddleware } from "../../utils/auth.ts";

export const handler = authMiddleware(true);
