import { ethers } from "ethers";
import { Group, Transaction, User } from "../contracts";
import { validateAndResolveAddress } from "./crypto";
import { db, firestoreCollections } from "./firebaseClient";

export const createGroup = async (
	members: string[],
	creator: string
): Promise<Group> => {
	const group = new Group();
	group.members = members;
	group.creator = creator;
	group.createdAt = new Date().toISOString();

	const groupRef = db.collection(firestoreCollections.GROUPS).doc();

	group.id = groupRef.id;

	await groupRef.set({ ...group });
	return group;
};

// export const getUser = async (
// 	address: string,
// 	customProvider?:
// 		| ethers.providers.Web3Provider
// 		| ethers.providers.JsonRpcProvider
// ): Promise<User> => {
// 	const provider = customProvider
// 		? customProvider
// 		: new ethers.providers.Web3Provider((window as any).ethereum);

// 	const { address: userAddress } = await validateAndResolveAddress(
// 		address,
// 		provider
// 	);

// 	const response = await db
// 		.collection(firestoreCollections.USERS)
// 		.where("address", "==", userAddress)
// 		.get();

// 	if (!response.empty) {
// 		return response.docs[0].data() as User;
// 	}

// 	return null;
// };

export const saveTransaction = async (
	transaction: Transaction
): Promise<void> => {
	await db
		.doc(`${firestoreCollections.TRANSACTIONS}/${transaction.id}`)
		.set(transaction);
};

export const minimizeAddress = (address?: string): string => {
	if (!address) return "";
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 4)
	);
};
