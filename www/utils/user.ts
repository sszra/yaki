import type { APIUser } from "@discordjs/core";
import { extension } from "@std/media-types/extension";
import { snowflake } from "./snowflake.ts";
import { uploadAvatar } from "./imagekit.ts";
import { hash } from "@felix/bcrypt";

export const FORMATTING_PATTERN = {
	FullName: /^[A-Z]([a-z]+|\.)(\s[A-Z]([a-z]+|\.))*$/,
	Username: /^[a-z0-9]{3,20}$/,
};

export enum UserFlags {
	Verified = 1 << 0,
}

export interface User {
	id: string;
	username: string;
	fullName: string;
	flags?: UserFlags;
	nickname?: string;
	avatarUrl?: string;
	connections?: UserConnection;
}
export interface UserConnection {
	discord?: Pick<APIUser, "username" | "id">;
}

interface CreateUserOptions extends Omit<User, "id" | "avatarUrl"> {
	password: string | null;
	avatar: Blob | null;
}

const kv = await Deno.openKv();

export async function createUser(
	{ avatar, username, fullName, password, flags }: CreateUserOptions,
) {
	if (!username.match(FORMATTING_PATTERN.Username)) {
		throw new Error("Username hanya boleh mengandung huruf kecil.");
	} else if (!fullName.match(FORMATTING_PATTERN.FullName)) {
		throw new Error(
			'Format nama salah. (contoh yang benar: "Khinara Aleydra" atau "Khinara A.")',
		);
	} else if (password && password.length < 8) {
		throw new Error("Panjang karakter sandi minimal 8 karakter.");
	} else {
		const usernameAvailability = await kv.atomic().check({
			key: ["users", "byUsername", username],
			versionstamp: null,
		}).commit();

		if (!usernameAvailability.ok) {
			throw new Error("Username ini telah digunakan.");
		} else {
			const id = snowflake();
			const newUser: User = { id, username, fullName, flags };

			if (avatar) {
				const avatarExtension = extension(avatar.type)!;
				const supportedExtensions = ["jpeg", "png"];

				if (supportedExtensions.includes(avatarExtension)) {
					newUser.avatarUrl = await uploadAvatar(
						id,
						await avatar.bytes(),
						avatarExtension,
					);
				} else {
					throw new Error(
						"Avatar hanya mendukung format jpg dan png.",
					);
				}
			}

			const atomic = kv.atomic().set(["users", "byId", id], newUser).set([
				"users",
				"byUsername",
				username,
			], id).set(["users", "byId", id, "classes"], []).set([
				"users",
				"byId",
				id,
				"friends",
			], []);

			if (password) {
				atomic.set(
					["users", "byId", id, "password"],
					await hash(password),
				);
			}

			if (newUser.connections?.discord) {
				atomic.set([
					"users",
					"byConnection",
					"discord",
					newUser.connections.discord.id,
				], id);
			}

			const commit = await atomic.commit();
			if (commit.ok) {
				return newUser;
			} else {
				throw new Error("Gagal membuat akun");
			}
		}
	}
}

export async function retrievePassword(userId: string) {
	const { value: password } = await kv.get<string>([
		"users",
		"byId",
		userId,
		"password",
	]);
	return password;
}

export async function retrieveUser(userId: string) {
	const { value: user } = await kv.get<User>(["users", "byId", userId]);

	if (user) {
		return user;
	} else {
		throw new Error("Unknown User");
	}
}

export async function searchUser(
	username: string,
	fullData: true,
): Promise<User>;
export async function searchUser(
	username: string,
	fullData?: false,
): Promise<string>;
export async function searchUser(
	username: string,
	fullData?: boolean,
): Promise<string | User> {
	const { value: userId } = await kv.get<string>([
		"users",
		"byUsername",
		username,
	]);

	if (userId) {
		if (fullData) {
			return await retrieveUser(userId);
		} else {
			return userId;
		}
	} else {
		throw new Error("Unknown User.");
	}
}

type SupportedConnection = "discord";
export async function retrieveConnectedUser(
	type: SupportedConnection,
	id: string,
) {
	const { value: userId } = await kv.get<string>([
		"users",
		"byConnection",
		type,
		id,
	]);

	if (userId) {
		return await retrieveUser(userId);
	} else {
		throw new Error("No account connected");
	}
}
