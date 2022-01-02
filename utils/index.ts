import { useMoralisData } from "./../hooks/useMoralisData";
import { ethers } from "ethers";
import { Group, Transaction, User } from "../contracts";
import { validateAndResolveAddress } from "./crypto";
import { db, firestoreCollections } from "./firebaseClient";

export const createGroup = async (
	members: string[],
	creator: string
): Promise<Group> => {
	const group = new Group();
	group.members = members.map((m) => m.toLowerCase());
	group.creator = creator;
	group.createdAt = new Date().toISOString();

	const groupRef = db.collection(firestoreCollections.GROUPS).doc();

	group.id = groupRef.id;
	group.name = `Group ${group.id.slice(4)}`;

	await groupRef.set({ ...group });
	return group;
};

export const getGroup = async (id: string): Promise<Group | null> => {
	const groupRef = db.collection(firestoreCollections.GROUPS).doc(id);

	const group = await groupRef.get();

	if (!group.exists) return null;

	return group.data() as Group;
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
	console.log({ transaction });
	await db
		.doc(`${firestoreCollections.TRANSACTIONS}/${transaction.id}`)
		.set(transaction);
};

export const minimizeAddress = (
	address?: string,
	currUser?: string
): string => {
	if (!address) return "";

	if (address.toLowerCase() === currUser?.toLowerCase()) return "you";
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 4)
	);
};

export const importTransaction = async (
	txId: string,
	group: Group
): Promise<void> => {
	// const tx = await db
	// 	.collection(firestoreCollections.TRANSACTIONS)
	// 	.where("id", "==", txId)
	// 	.where("groupId", "==", group.id)
	// 	.get();

	// if (!tx.empty) throw new Error("Transaction already imported");

	const provider = new ethers.providers.Web3Provider(
		(window as any).ethereum
	);
	const txn = await provider.getTransaction(txId);
	const block = await provider.getBlock(txn.blockNumber);

	console.log({ txn, block });

	if (!txn) {
		throw new Error(
			"Please make sure you are connected to correct network"
		);
	}

	const { hash, from, to, value } = txn;

	const checkIfSenderIsMember =
		group.members.includes(from.toLowerCase()) ||
		group.members.includes(from);
	const checkIfReceiverIsMember =
		group.members.includes(to.toLowerCase()) || group.members.includes(to);

	if (!checkIfSenderIsMember) {
		console.log(group.members.includes(from.toLowerCase()), from, to);
		throw new Error("Sender is not a member of this group");
	}
	if (!checkIfReceiverIsMember) {
		throw new Error("Receiver is not a member of this group");
	}

	const formattedValue = Number(ethers.utils.formatEther(value));

	const transaction = new Transaction();
	transaction.id = hash;
	transaction.from = from;
	transaction.to = to;
	transaction.amount = formattedValue;
	transaction.createdAt = new Date().getTime();
	transaction.groupId = group.id;
	transaction.createdAt = block.timestamp * 1000;

	await saveTransaction({ ...transaction });
};
