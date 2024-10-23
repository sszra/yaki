import { useState } from "preact/hooks";

interface LoginProps {
	username?: string;
	password?: string;
	error?: string;
}

export function Login(props: LoginProps) {
	const [username, setUsername] = useState<string>(props.username ?? "");
	const [password, setPassword] = useState<string>(props.username ?? "");
	return (
		<form method="POST" class="flex flex-col gap-3 w-full max-w-80">
			<p class="text-4xl font-bold">Login</p>
			<div class="flex flex-col">
				<label class="font-bold" for="username">
					Username
				</label>
				<input
					class="bg-slate-200 rounded-full px-3 py-2 placeholder:text-slate-500 outline-none"
					name="username"
					id="username"
					type="username"
					placeholder="szraaa"
					value={username}
					onInput={(input) => setUsername(input.currentTarget.value)}
				/>
			</div>
			<div class="flex flex-col">
				<label class="font-bold" for="password">
					Kata Sandi
				</label>
				<input
					class="bg-slate-200 rounded-full px-3 py-2 placeholder:text-slate-500 outline-none"
					name="password"
					id="password"
					type="password"
					placeholder="Admin#1234"
					value={password}
					onInput={(input) => setPassword(input.currentTarget.value)}
				/>
			</div>
			{props?.error && (
				<div class="flex items-center w-full">
					<p class="text-red-500 text-sm">{props.error}</p>
				</div>
			)}
			<button
				class="bg-black rounded-full px-3 py-2 text-white text-sm disabled:opacity-50"
				type="submit"
				disabled={username == "" || password == ""}
				f-client-nav={false}
			>
				Login
			</button>
		</form>
	);
}
