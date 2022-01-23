import classnames from "classnames";
import { useRouter } from "next/router";
import React from "react";
import Blockies from "react-blockies";
import { useCollectionData } from "react-firebase-hooks/firestore";
import AddressInput from "../components/AddressInput";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { db, firestoreCollections } from "../utils/firebaseClient";
import { createGroup } from "../utils/moralis-db";
import { useEnsAddress } from "../utils/useEnsAddress";

declare let window: any;

const Dashboard: React.FC = () => {
	const router = useRouter();
	const { account: selfAddress } = useMoralisData();

	const [groups, loading] = useCollectionData<SplitwiseGroup>(
		db
			.collection(firestoreCollections.GROUPS)
			.where("members", "array-contains", selfAddress)
	);

	const handleAddressChange = async (address: string, ens: string) => {
		if (!address) {
			return;
		}

		await createGroup([selfAddress, address], selfAddress);

		const destination = ens ? `/groups/${ens}` : `/groups/${address}`;
		router.push(destination);
	};

	return (
		<div>
			<div className="max-w-3xl bg-dark-gray rounded-t-3xl my-0 mx-auto pb-0">
				<div className="w-full rounded-t-3xl bg-dark-gray p-12">
					<div className="text-xl text-white font-medium mb-2">
						Overall, You are Owed{" "}
						<span className="text-sea-green text-2xl ml-2">
							+ 0.5712 Eth
						</span>
					</div>
					<div className="w-full p-3 inline-flex justify-between items-center bg-light-gray rounded-lg">
						<span className="text-l text-white font-medium">
							You owe{" "}
							<span className="text-xl font-bold">
								0.2512 Eth
							</span>{" "}
						</span>
						<p className="h-max border-r-2 border-white border-solid"></p>
						<span className="text-l text-white font-medium">
							You are owed{" "}
							<span className="text-xl font-bold">
								0.2512 Eth
							</span>{" "}
						</span>
					</div>
				</div>
				<div className="w-full rounded-t-3xl bg-white p-12">
					<div className="mb-8">
						<h4 className="text-2xl font-bold">Add Fren</h4>
						<AddressInput onChange={handleAddressChange} />
					</div>
					<h4 className="text-2xl font-bold">Existing Frens</h4>
					<div className="grid gap-4">
						{groups?.map((group) => (
							<GroupTab group={group} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

interface SplitwiseGroup {
	createdAt: string;
	creator: string;
	id: string;
	members: string[];
	name: string;
	balance: number;
}

interface GroupTabProps {
	group: SplitwiseGroup;
}
const GroupTab: React.FC<GroupTabProps> = ({ group }) => {
	const { account: selfAddress } = useMoralisData();
	const router = useRouter();

	const otherAddress = group.members.find(
		(address) => address !== selfAddress
	);

	const { address, avatar, error, name } = useEnsAddress(otherAddress);

	const balance = group.balance || 0;

	const handleAddressChange = async () => {
		router.push(`/groups/${otherAddress}`);
	};

	return (
		<div
			onClick={handleAddressChange}
			className="rounded-lg border-solid border border-lighter-gray p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
		>
			<div className="inline-flex justify-center items-center gap-4">
				{avatar?.length ? (
					<img src={avatar} className="h-16 w-16 rounded-xl" />
				) : (
					<Blockies
						seed={otherAddress}
						size={8}
						className="h-16 w-16 rounded-lg"
					/>
				)}
				<h6 className="text-xl mb-0">
					{name ?? minimizeAddress(otherAddress)}
				</h6>
			</div>
			{!!balance && (
				<div
					className={classnames(
						"text-base font-medium",
						balance > 0 ? "text-green" : "text-orange"
					)}
				>
					{balance > 0 ? "+" : "-"}+ {balance} ETH
				</div>
			)}
		</div>
	);
};

export default Dashboard;
