import { define } from "../utils/core.ts";

export default define.page(({ Component, state }) => {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>{state.title ? `${state.title} - Yaki` : "Yaki"}</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
});
