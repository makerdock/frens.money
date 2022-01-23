import { ArrowRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Blockies from "react-blockies";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import { toast } from "react-toastify";
import AddressInput from "../components/AddressInput";
import Button from "../components/Button";
import { Group } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { db, firestoreCollections } from "../utils/firebaseClient";
import { createGroup } from "../utils/firebaseQueries";
import { useEnsAddress } from "../utils/useEnsAddress";
import Image from "next/image";
import sadface from "../assets/sadface.png";

// import { createGroup } from "../utils/moralis-db";

declare let window: any;

const Dashboard: React.FC = () => {
	const router = useRouter();
	const { account: selfAddress } = useMoralisData();

	const [groups] = useCollectionData<SplitwiseGroup>(
		selfAddress &&
			db
				.collection(firestoreCollections.GROUPS)
				.where("members", "array-contains", selfAddress)
	);
	const [address, setAddress] = useState("");
	const [ens, setEns] = useState<string | null>("");
	const [loading, setLoading] = useState(false);
	const handleAddressChange = async (address: string, ens: string) => {
		if (!address) {
			return;
		}

		setEns(ens ?? null);
		setAddress(address);
	};

	const handleCreateGroup = async () => {
		if (!address) {
			toast.error("Please enter an address");
			return;
		}

		const currUserAddress = selfAddress.toLowerCase();
		const memberAddress = address.toLowerCase();

		if (currUserAddress === memberAddress) {
			toast.error("You can't create a group with yourself");
			return;
		}

		try {
			setLoading(true);
			await createGroup(
				[currUserAddress, memberAddress],
				currUserAddress
			);

			const destination = ens ? `/user/${ens}` : `/user/${address}`;
			router.push(destination);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
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
					<div className="mb-8 space-y-4">
						<h4 className="text-2xl font-bold">Add Fren</h4>
						<div className="flex items-stretch space-x-4">
							<AddressInput onChange={handleAddressChange} />
							<Button
								loading={loading}
								onClick={handleCreateGroup}
								className="space-x-2 flex"
							>
								<div>Create group</div>
								<ArrowRightIcon className="h-4 w-4 ml-2" />{" "}
							</Button>
						</div>
					</div>
					<div className="grid gap-4">
						{groups?.length === 0 && (
							<div className="flex justify-center items-center flex-col">
								<Image src={sadface} />
								<div className="mt-8">
									When you add a fren, they will show up here.
								</div>
							</div>
						)}
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
		router.push(`/user/${otherAddress}`);
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
					className={classNames(
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
