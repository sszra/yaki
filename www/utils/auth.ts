import { retrieveUser, type User } from "./user.ts";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { getCookies, setCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";
import type { FreshContext } from "fresh";

const EXPIRATION_TIME = {
	AccessToken: 24 * 60 * 60 * 1000,
	RefreshToken: 7 * 24 * 60 * 60 * 1000,
};
const PRIVATE_KEY = new TextEncoder().encode(Deno.env.get("JWT_PRIVATE_KEY")!);

export async function createAccessToken(user: User) {
	const payload: Token & JWTPayload = {
		type: "access_token",
		id: user.id,
	};
	const expire = Date.now() + EXPIRATION_TIME.AccessToken;
	const jwt = new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(expire);

	return {
		token: await jwt.sign(PRIVATE_KEY),
		token_type: payload.type,
		expire,
	} satisfies TokenResult;
}

export async function createRefreshToken(user: User) {
	const payload: Token & JWTPayload = {
		type: "refresh_token",
		id: user.id,
	};
	const expire = Date.now() + EXPIRATION_TIME.RefreshToken;
	const jwt = new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(expire);

	return {
		token: await jwt.sign(PRIVATE_KEY),
		token_type: payload.type,
		expire,
	} satisfies TokenResult;
}

export async function createSession(user: User) {
	const headers = new Headers({
		location: "/",
	});

	const accessToken = await createAccessToken(user);
	const refreshToken = await createRefreshToken(user);

	setCookie(headers, {
		name: "access_token",
		value: accessToken.token,
		expires: accessToken.expire,
		path: "/",
	});
	setCookie(headers, {
		name: "refresh_token",
		value: refreshToken.token,
		expires: refreshToken.expire,
		path: "/refresh_token",
	});

	return new Response(null, { headers, status: STATUS_CODE.Found });
}

export async function resolveSession(ctx: FreshContext) {
	const cookies = getCookies(ctx.req.headers);
	const accessToken = cookies["access_token"];

	if (accessToken) {
		const { payload } = await jwtVerify<Token>(accessToken, PRIVATE_KEY);
		const user = await retrieveUser(payload.id);
		return user;
	}
}

export interface TokenResult {
	token: string;
	token_type: TokenType;
	expire: number;
}

interface Token extends Pick<User, "id"> {
	type: TokenType;
}
type TokenType = "access_token" | "refresh_token";
