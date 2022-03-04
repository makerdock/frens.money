import { ArrowRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
import { useWalletMembershipAccess } from "../utils/useWalletMembershipAccess";
import { useChainId } from "../utils/useChainId";
import loadingAnimation from "../utils/lottie-loading.json";
import SwitchChainModal from "../components/SwitchChainModal";
import Lottie from "lottie-react";

// import { createGroup } from "../utils/moralis-db";

declare let window: any;

const Dashboard: React.FC = () => {
	const router = useRouter();
	const { account: selfAddress } = useMoralisData();

	const [groups, groupsLoading] = useCollectionData<SplitwiseGroup>(
		selfAddress &&
			db
				.collection(firestoreCollections.GROUPS)
				.where("members", "array-contains", selfAddress)
	);
	const [address, setAddress] = useState("");
	const [ens, setEns] = useState<string | null>("");
	const [loading, setLoading] = useState(false);
	const [owes, setOwes] = useState(0)
	const [owed, setOwed] = useState(0)
	const { access, isAccessLoading } = useWalletMembershipAccess();
	const { chainId, switchToDesiredChainId, isOnDesiredChainId } = useChainId(false);

	const groupIds = groups?.map(group => group.id) ?? [];

	const [transactions, transactionsLoading] = useCollectionData(
		selfAddress && !!groupIds.length &&
			db
				.collection(firestoreCollections.TRANSACTIONS)
				.where("groupId", "in", groupIds)
	)

	const dataLoading = groupsLoading || transactionsLoading || isAccessLoading;

	const memberBalance = transactions?.reduce<
		Record<string, Record<string, number>>
	>((balance, transaction) => {
		if (transaction.skipped) {
			return balance;
		}

		const { from: fromAddress, to: toAddress, amount, gas } = transaction;
		const from = fromAddress?.toLowerCase();
		const to = toAddress?.toLowerCase();

		balance[from] = {
			...balance[from],
			[to]: (balance[from]?.[to] ?? 0) + (amount + gas),
		};

		balance[to] = {
			...balance[to],
			[from]: (balance[to]?.[from] ?? 0) - (amount + gas),
		};

		return balance;
	}, {});

	const getBalanceForAccount = () => {
		let owes = 0;
		let owed = 0;

		Object.entries(
			memberBalance?.[
				selfAddress?.toLowerCase()
			] ?? {}
		).forEach(([address, balance]) => {
			const shouldSkip =
				balance === 0 ||
				address ===
					selfAddress?.toLowerCase();
			const shouldPay = balance < 0;

			if(shouldSkip) return;
			if(shouldPay) {
				owes += balance
			} else {
				owed += balance
			};
		})

		setOwed(owed)
		setOwes(owes)

	}

	useEffect(() => {
		getBalanceForAccount();
	}, [memberBalance, selfAddress])

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

	const overallOwed = (owed - owes).toPrecision(3)

	return (
		<div >
			<div className="max-w-3xl bg-dark-gray rounded-t-3xl xs:mx-2 my-0 mx-auto pb-0">
				<div className="w-full rounded-t-3xl bg-dark-gray p-12 xs:p-6">
					<div className="text-xl text-white xs:text-sm font-medium mb-2 xs:mb-6">
						Overall, You are Owed{" "}
						<span className="text-sea-green xs:text-xl text-2xl ml-2">
							{owed - owes < 0 ? '-' : '+'} {overallOwed} Eth
						</span>
					</div>
					<div className="w-full p-3 inline-flex justify-between items-center bg-light-gray rounded-lg">
						<span className="text-l xs:text-xs text-white font-medium">
							You owe{" "}
							<span className="text-xl xs:block xs:text-base font-bold">
								{Math.abs(owes).toPrecision(3)} Eth
							</span>{" "}
						</span>
						<p className="h-max border-r-2 border-white border-solid"></p>
						<span className="text-l xs:text-xs text-white font-medium">
							You are owed{" "}
							<span className="text-xl xs:block xs:text-base font-bold">
								{owed.toPrecision(3)} Eth
							</span>{" "}
						</span>
					</div>
				</div>
				<div className="w-full rounded-t-3xl bg-white p-12 xs:p-6 h-full">
					{
						dataLoading ? (
							<div>
								<Lottie animationData={loadingAnimation} loop className='w-80 mx-auto' />
							</div>
						) : (
							<>
								{
									!access && (
										<div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple to-pink rounded-lg text-white mb-4">
											<p className="h-full text-base">Mint Frens.money Gen 1 to get full access to the app. </p>
											<button onClick={() => router.push('/mint')} className="p-2 text-black bg-white rounded-md items-center">Mint Now</button>
										</div>
									)
								}
								<div className="mb-8 space-y-4">
									<h4 className="text-2xl font-bold">Add Fren</h4>
									<div className="flex items-stretch xs:flex-col space-x-4 xs:space-x-0 xs:space-y-2">
										<AddressInput
											onChange={handleAddressChange}
											setLoading={setLoading}
										/>
										<Button
											loading={loading}
											onClick={handleCreateGroup}
											disabled={!access && groups?.length >= 5}
											className="space-x-2 flex disabled:cursor-pointer"
										>
											<div>Create group</div>
											<ArrowRightIcon className="h-4 w-4 ml-2" />{" "}
										</Button>
									</div>
								</div>
								<div className="grid gap-4">
									{!groups?.length && (
										<div className="flex justify-center items-center flex-col">
											<Image src={sadface} />
											<div className="mt-8">
												When you add a fren, they will show up here.
											</div>
										</div>
									)}
									{!!groups?.length && (
										<h4 className="text-2xl font-bold">Existing Frens</h4>
									)}
									{groups?.map((group) => (
										<GroupTab group={group} memberBalance={memberBalance} />
									))}
								</div>
							</>
						)
					}
					<SwitchChainModal 
						visible={!isOnDesiredChainId}
						onSwitch={switchToDesiredChainId}
						switchingTo={'Ethereum'}
					/>
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
	memberBalance: Record<string, Record<string, number>>; 
}
const GroupTab: React.FC<GroupTabProps> = ({ group, memberBalance }) => {
	const { account: selfAddress } = useMoralisData();
	const router = useRouter();

	const otherAddress = group.members.find(
		(address) => address !== selfAddress
	);

	const { address, avatar, error, name } = useEnsAddress(otherAddress);

	const balance = memberBalance?.[otherAddress]?.[selfAddress];

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
					<img src={avatar} className="h-10 w-10 rounded-xl" />
				) : (
					<Blockies
						seed={otherAddress}
						size={10}
						className="rounded-lg"
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
					{balance > 0 ? "+" : ""}{balance.toPrecision(3)} ETH
				</div>
			)}
		</div>
	);
};

export default Dashboard;
