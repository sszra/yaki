import { DiscordSnowflake } from "@sapphire/snowflake";

export function snowflake(timestamp?: number) {
	return DiscordSnowflake.generate({ timestamp }).toString();
}
