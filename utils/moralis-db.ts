import { ethers } from "ethers";
import Moralis from "moralis/types";
import {
	Group as SplitGroup,
	Transaction as SplitTransaction,
} from "../contracts";

const Transaction = Moralis.Object.extend("transaction");
const Group = Moralis.Object.extend("group");

const TransactionQuery = new Moralis.Query(Transaction);
const GroupQuery = new Moralis.Query(Group);

export const createGroup = async (
	members: string[],
	creator: string
): Promise<SplitGroup> => {
	try {
		const group = new Group();

		const groupRef = await group.save({
			members: members.map((m) => m.toLowerCase()),
			creator,
			createdAt: new Date().toISOString(),
		});

		return groupRef;
	} catch (error) {
		console.error(error);
	}
};

export const getGroup = async (id: string): Promise<SplitGroup | null> => {
	try {
		const groupRef = await GroupQuery.get(id);

		return groupRef as any;
	} catch (error) {
		console.error(error);
	}
};

export const saveTransaction = async (
	transaction: SplitTransaction
): Promise<void> => {
	try {
		const transactionRef = new Transaction();
		await transactionRef.save(transaction);
	} catch (error) {
		console.error(error);
	}
};

export const importTransaction = async (
	txId: string,
	group: SplitGroup
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
