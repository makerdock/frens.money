import { ArrowRightIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "react-toastify";
import AddressInput from "../components/AddressInput";
import Button from "../components/Button";
import { Group } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { createGroup } from "../utils";
import { db, firestoreCollections } from "../utils/firebaseClient";
// import { createGroup } from "../utils/moralis-db";

declare let window: any;

const Dashboard: React.FC = () => {
	const router = useRouter();
	const { account: selfAddress } = useMoralisData();

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

	const handleRedirect = (group: Group) => {
		const recipient = group.members.filter(
			(member) => member.toLowerCase() !== selfAddress.toLowerCase()
		)[0];

		if (!recipient) {
			toast.error("Could not find recipient");
			return;
		}

		router.push(`/user/${recipient}`);
	};

	const [snapshot] = useCollection(
		selfAddress &&
			db
				.collection(firestoreCollections.GROUPS)
				.where("members", "array-contains", selfAddress)
	);

	const cleanedGroups =
		snapshot?.docs.map((doc) => doc.data() as Group) ?? [];

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
					<h4 className="text-2xl font-bold">Existing Frens</h4>
					<div className="space-y-3">
						{cleanedGroups.map((group) => (
							<div
								onClick={() => handleRedirect(group)}
								key={group.id}
								className="cursor-pointer rounded-lg border-solid border-2 border-dark-gray px-6 py-4 flex justify-between items-center"
							>
								<div className="inline-flex justify-center items-center">
									<div>
										<Image
											src={"/../assets/Wallet.svg"}
											width={32}
											height={32}
										/>
									</div>
									<h6 className="text-2xl font-bold mb-0">
										0xAbhishekKumar
									</h6>
								</div>
								<div className="text-base font-medium text-sea-green">
									+ 0.005 ETH
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
