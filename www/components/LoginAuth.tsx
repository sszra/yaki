interface LoginAuthProps {
	icon: string;
	platformName: string;
	path: string;
}

export function LoginAuth({ icon, platformName, path }: LoginAuthProps) {
	return (
		<a
			class="flex gap-2 justify-center items-center rounded-full bg-black text-white p-2"
			href={path}
		>
			<img class="size-7" src={icon} />
			<p>Login with {platformName}</p>
		</a>
	);
}
