import type { APIUser } from "@discordjs/core";
import { extension } from "@std/media-types/extension";
import { snowflake } from "./snowflake.ts";
import { uploadAvatar } from "./imagekit.ts";
import { hash } from "@felix/bcrypt";

const FORMATTING_PATTERN = {
	Username: /^[a-z0-9]{3,20}$/,
};

export enum UserFlags {
	Verified = 1 << 0,
}

export interface User {
	id: string;
	username: string;
	flags?: UserFlags;
	nickname?: string;
	avatarUrl?: string;
	connections?: UserConnection;
}
export interface UserConnection {
	discord?: Pick<APIUser, "username" | "id">;
}

interface CreateUserOptions extends Omit<User, "id" | "avatarUrl"> {
	password: string;
	avatar?: Blob;
}

const kv = await Deno.openKv();

export async function createUser(
	options: CreateUserOptions,
) {
	if (options.username.match(FORMATTING_PATTERN.Username)) {
		const usernameAvailability = await kv.atomic().check({
			key: ["users", "byUsername", options.username],
			versionstamp: null,
		}).commit();

		if (options.password.length < 8) {
			throw new Error("Panjang karakter sandi minimal 8 karakter");
		}

		if (!usernameAvailability.ok) {
			throw new Error("Username ini tidak tersedia");
		} else {
			const id = snowflake();
			const newUser: User = {
				id,
				username: options.username,
				flags: options.flags,
				connections: options.connections,
			};

			if (options.avatar) {
				const avatarExtension = extension(options.avatar.type)!;
				const supportedExtensions = ["jpeg", "png"];

				if (supportedExtensions.includes(avatarExtension)) {
					newUser.avatarUrl = await uploadAvatar(
						id,
						await options.avatar.bytes(),
						avatarExtension,
					);
				} else {
					throw new Error("Unsupported avatar format");
				}
			}

			const atomic = kv.atomic().set(["users", "byId", id], newUser).set([
				"users",
				"byUsername",
				options.username,
			], id).set(["users", "byId", id, "classes"], []).set([
				"users",
				"byId",
				id,
				"friends",
			], []).set(
				["users", "byId", id, "password"],
				await hash(options.password),
			);

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
	} else {
		throw new Error("Username hanya bisa mengandung huruf kecil dan angka");
	}
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
	fullData?: boolean,
): Promise<string | User>;
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
