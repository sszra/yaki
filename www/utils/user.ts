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
	connection: UserConnection;
}
export interface UserConnection {
	discord?: Pick<APIUser, "username" | "id">;
}

interface CreateUserOptions extends Omit<User, "id" | "avatarUrl"> {
	avatar: Blob;
}
export async function createUser(
	{ username, avatar, connection }: CreateUserOptions,
) {
	const usernameAvailability = await kv.atomic().check({
		key: ["users", "byUsername", username],
		versionstamp: null,
	}).commit();

	if (!usernameAvailability.ok) {
		throw new Error("Username isn't available");
	} else {
		const id = snowflake();
		const newUser: User = {
			id,
			username,
			connection,
		};

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
				throw new Error("Unsupported avatar format");
			}
		}

		const atomic = kv.atomic().set(["users", "byId", id], newUser).set([
			"users",
			"byUsername",
			username,
		], id);

		if (newUser.connection.discord) {
			atomic.set([
				"users",
				"byConnection",
				"discord",
				newUser.connection.discord.id,
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
