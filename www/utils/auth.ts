import { retrieveUser, type User } from "./user.ts";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { getCookies, setCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";
import type { FreshContext } from "fresh";
import { define, kv } from "./core.ts";
import { snowflake } from "./snowflake.ts";

const EXPIRATION_TIME = {
	AccessToken: 60 * 60 * 1000,
	RefreshToken: 24 * 60 * 60 * 1000,
};
const PRIVATE_KEY = new TextEncoder().encode(Deno.env.get("JWT_PRIVATE_KEY")!);

export const authMiddleware = define.middleware(async (ctx) => {
	const user = await resolveSession(ctx);

	if (user) {
		ctx.state.user = user;
		return ctx.next();
	} else {
		return ctx.redirect("/auth/refresh_token");
	}
});

export async function createAccessToken(user: User) {
	const payload: AccessToken & JWTPayload = {
		userId: user.id,
	};
	const expire = Date.now() + EXPIRATION_TIME.AccessToken;
	const jwt = new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(expire);

	return {
		token: await jwt.sign(PRIVATE_KEY),
		tokenType: "access_token",
		expire,
	} satisfies TokenResult<"access_token">;
}

export async function createRefreshToken(
	user: User,
	oldData?: RefreshTokenValidationResult,
) {
	const atomic = kv.atomic();

	if (oldData) {
		atomic.delete(["refresh_tokens", oldData.sessionId]);
	}

	const sessionId = snowflake();
	const payload: RefreshToken & JWTPayload = {
		sessionId,
	};
	const expire = Date.now() + EXPIRATION_TIME.RefreshToken;
	const jwt = new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(oldData?.expire ?? expire);

	await atomic.set(["refresh_tokens", sessionId], user.id).commit();

	return {
		token: await jwt.sign(PRIVATE_KEY),
		tokenType: "refresh_token",
		expire,
	} satisfies TokenResult<"refresh_token">;
}

async function validateRefreshToken(
	token: string,
): Promise<RefreshTokenValidationResult> {
	const { payload } = await jwtVerify<RefreshToken>(token, PRIVATE_KEY);
	const { value: userId } = await kv.get<string>([
		"refresh_tokens",
		payload.sessionId,
	]);

	const unknownUserError = new Error("Unknown User");

	if (userId) {
		const user = await retrieveUser(userId);

		if (user) {
			return {
				sessionId: payload.sessionId,
				expire: payload.exp!,
				user,
			};
		} else {
			throw unknownUserError;
		}
	} else {
		throw unknownUserError;
	}
}

export async function createSession(user: User) {
	const accessToken = await createAccessToken(user);
	const refreshToken = await createRefreshToken(user);

	return setupSession(accessToken, refreshToken);
}

export async function resolveSession(ctx: FreshContext) {
	const cookies = getCookies(ctx.req.headers);
	const accessToken = cookies["access_token"];

	if (accessToken) {
		const payload = await resolveToken<AccessToken>(accessToken);

		const user = await retrieveUser(payload.userId);
		return user;
	}
}

export async function refreshSession(token: string) {
	const parsedToken = await validateRefreshToken(token);

	const accessToken = await createAccessToken(parsedToken.user);
	const refreshToken = await createRefreshToken(
		parsedToken.user,
		parsedToken,
	);

	return setupSession(accessToken, refreshToken);
}

export function setupSession(
	accessToken: TokenResult<"access_token">,
	refreshToken: TokenResult<"refresh_token">,
) {
	const headers = new Headers({
		"location": "/",
	});

	setCookie(headers, {
		name: "access_token",
		value: accessToken.token,
		expires: accessToken.expire,
		path: "/",
		secure: true,
		httpOnly: true,
	});
	setCookie(headers, {
		name: "refresh_token",
		value: refreshToken.token,
		expires: refreshToken.expire,
		path: "/auth/refresh_token",
		secure: true,
		httpOnly: true,
	});

	return new Response(null, { headers, status: STATUS_CODE.Found });
}

export async function resolveToken<T extends Token>(token: string) {
	const { payload } = await jwtVerify<T>(token, PRIVATE_KEY);
	return payload;
}

type TokenType = "access_token" | "refresh_token";
export interface TokenResult<T extends TokenType> {
	token: string;
	tokenType: T;
	expire: number;
}

interface AccessToken {
	userId: string;
}
interface RefreshToken {
	sessionId: string;
}
export type Token = AccessToken | RefreshToken;
interface RefreshTokenValidationResult extends RefreshToken {
	expire: number;
	user: User;
}
