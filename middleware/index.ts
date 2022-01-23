import { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import { getDataFromCookie, TOKEN_NAME } from "../utils/cookie";
import { db, firestoreCollections } from "../utils/firebaseClient";
import {
	getUserFromAddress,
	getUserByNonce,
	recoverAddress,
} from "../utils/server";

export const withAuth =
	(api: any) => async (req: NextApiRequest, res: NextApiResponse) => {
		const signature = getDataFromCookie(req, TOKEN_NAME);
		const address = getDataFromCookie(req, "address");

		// fetch user from firebase
		const user = await getUserFromAddress(address);

		const recoveredAddress = recoverAddress(user.nonce, signature);

		if (recoverAddress !== address) {
			return res.status(401).json({
				message: "You are not authorized to access this resource",
			});
		}

		return api(req, res, user);
	};
