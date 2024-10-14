import type { APIUser } from "@discordjs/core";
import { extension } from "@std/media-types/extension";
import { snowflake } from "./snowflake.ts";
import { uploadAvatar } from "./imagekit.ts";

const kv = await Deno.openKv();

export interface User {
	id: string;
	username: string;
	nickname?: string;
	avatarUrl?: string;
	connections: UserConnection;
}
export interface UserConnection {
	discord?: Pick<APIUser, "username" | "id">;
}

interface CreateUserOptions extends Omit<User, "id" | "avatarUrl"> {
	avatar?: Blob;
}
export async function createUser(
	options: CreateUserOptions,
) {
	const usernameAvailability = await kv.atomic().check({
		key: ["users", "byUsername", options.username],
		versionstamp: null,
	}).commit();

	if (!usernameAvailability.ok) {
		throw new Error("Username isn't available");
	} else {
		const id = snowflake();
		const newUser: User = {
			id,
			username: options.username,
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
		], id);

		if (newUser.connections.discord) {
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
			throw new Error("Failed to create user");
		}
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
		const { value: user } = await kv.get<User>(["users", "byId", userId]);
		return user;
	}
}
