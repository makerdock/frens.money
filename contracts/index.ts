export class Group {
	id: string = "";
	name: string = "";
	creator: string = "";
	members: string[] = [];
	createdAt: string = "";
}

export class Transaction {
	id: string = "";
	groupId: string = "";
	from: string = "";
	to: string = "";
	amount: number = 0;
	createdAt: number | null = null;
	message: string = "";
}
export class User {
	profileImage: string = "";
	coverImage: string = "";
	id: string = "";
	name: string = "";
	description: string = "";
	address: string = "";
	ens: string | null = null;
}

// export class Transaction {
// 	from: string = "";
// 	fromEns: string | null = null;
// 	to: string = "";
// 	amount: number = 0;
// 	timestamp: number = new Date().getTime();
// 	id: string = "";
// 	message: string = "";
// 	cronStatus: "pending" | "success" = "pending";
// 	status: "success" | "failure" | "" = "";
// 	chain: string = "";
// 	formattedAmount: string = "";
// 	tokenDecimals: number = 0;
// 	senderAvatar?: string = null;
// }
