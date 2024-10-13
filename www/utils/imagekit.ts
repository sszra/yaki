import ImageKit from "imagekit";
import { encodeBase64 } from "@std/encoding/base64";

const FOLDER_PATH = "/yaki";

export const imagekit = new ImageKit({
	publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY")!,
	privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY")!,
	urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT")!,
});

export async function uploadAvatar(
	userId: string,
	data: Uint8Array,
	extension: string,
) {
	const uploaded = await imagekit.upload({
		file: encodeBase64(data),
		fileName: `${userId}.${extension}`,
		folder: FOLDER_PATH,
	});
	return uploaded.url;
}
