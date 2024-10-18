import { HttpError, page } from "fresh";
import { retrieveClass, retrieveClassesFor } from "../../../utils/class.ts";
import { define } from "../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async GET(ctx) {
		const notFound = new HttpError(
			STATUS_CODE.NotFound,
			"This class isn't available",
		);
		const classId = ctx.params.classId;

		const availableClasses = await retrieveClassesFor(ctx.state.user.id);

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
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <p>Tidak ada tugas</p>;
});
