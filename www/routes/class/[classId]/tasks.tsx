import { HttpError, page, type RouteConfig } from "fresh";
import { resolveSession } from "../../../utils/auth.ts";
import { retrieveClass, retrieveClassesFor } from "../../../utils/class.ts";
import { define } from "../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const user = await resolveSession(ctx);

		if (user) {
			ctx.state.user = user;
			const notFound = new HttpError(
				STATUS_CODE.NotFound,
				"This class isn't available",
			);
			const classId = ctx.params.classId;

			const availableClasses = await retrieveClassesFor(user.id);

			if (availableClasses.includes(classId)) {
				const fetchedClass = await retrieveClass(classId);

				if (fetchedClass) {
					return page({ fetchedClass });
				} else {
					throw notFound;
				}
			} else {
				throw notFound;
			}
		} else {
			return ctx.redirect("/refresh_token");
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { fetchedClass } = data;

	return (
		<div class="flex flex-col w-dvw h-dvh p-4">
			<p>{fetchedClass.name}</p>
		</div>
	);
});
