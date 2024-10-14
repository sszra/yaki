import { createDefine } from "fresh";
import type { User } from "./user.ts";

export interface State {
	title: string;
	user: User;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();
