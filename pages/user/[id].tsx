import { DuplicateIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import Blockies from "react-blockies";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "react-toastify";
import PaymentSection from "../../components/PaymentSection";
import RequestNotification from "../../components/RequestNotification";
import RequestSection from "../../components/RequestSection";
import Transactions from "../../components/Transactions";
import QuestionIllustration from "../../assets/question.png";
import {
	Group,
	Notification,
	NotificationTypes,
	Transaction,
} from "../../contracts";
import { useMoralisData } from "../../hooks/useMoralisData";
import useTransactions from "../../hooks/useTransactions";
import { minimizeAddress } from "../../utils";
import { db, firestoreCollections } from "../../utils/firebaseClient";
import {
	createNotification,
	getGroupByPerson,
} from "../../utils/firebaseQueries";
import { fetchEnsAddress, useEnsAddress } from "../../utils/useEnsAddress";
import copy from 'copy-to-clipboard';
import { ArrowSmLeftIcon, CheckIcon, DotsVerticalIcon, TrashIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Modal from "../../components/Modal";
import Image from 'next/image'

declare let window: any;
export interface ProfileProps {
	transactions: Transaction[];
	profileAddress: string;
	ens?: string;
	avatar?: string;
	group?: Group;
}

const UserPage: React.FC<ProfileProps> = ({
	transactions: allTransactions,
	profileAddress,
	avatar: defaultAvatar,
	// group,
}) => {
	const router = useRouter();
	const queryAddress = router.query.id?.toString();

	const { address: otherAddress, name: ens } = useEnsAddress(queryAddress);

	const otherPersonAccount = queryAddress?.includes(".")
		? otherAddress
		: queryAddress?.toLowerCase();

	const [group, setGroup] = useState<Group>();
	const { account } = useMoralisData();
	const { address, avatar, error, name } = useEnsAddress(otherPersonAccount);

	const [selectedSection, setSelectedSection] = useState<"pay" | "request" | "transaction">(
		"pay"
	);
	const [settleAmount, setSettleAmount] = useState<number>(0);
	const [addressCopied, setAddressCopied] = useState(false)
	const [deleteModalVisible, setDeleteModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const [snapshot] = useCollection(
		group?.id &&
			db
				.collection(firestoreCollections.TRANSACTIONS)
				.where("groupId", "==", group?.id)
	);
	const [notificationSnapshot] = useCollection(
		group?.id &&
			account &&
			db
				.collection(firestoreCollections.NOTIFICATIONS)
				.where("groupId", "==", group?.id)
				.where("recipient", "==", account.toLowerCase())
				.where("closed", "==", false)
	);

	const notifications: Notification[] =
		notificationSnapshot?.docs?.map((doc) => doc.data() as Notification) ??
		[];

	const transactions: Transaction[] =
		(snapshot?.docs.map((doc) => doc.data() as Transaction) ?? []).sort(
			(a, b) => a.createdAt - b.createdAt
		) || [];
	const isOwner = group?.creator === account;

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

	const otherMember = group?.members.filter(
		(member) => member !== account
	)[0];
	const { result } = useTransactions(otherMember ?? "");

	const userName = name ?? minimizeAddress(address ?? otherPersonAccount);

	const fetchGroupData = async () => {
		let friendAddress: string = otherPersonAccount?.toLowerCase() ?? "";

		if (friendAddress.includes(".")) {
			const response = await fetchEnsAddress(friendAddress);
			friendAddress = response.address?.toLowerCase();
		}

		if (friendAddress && account) {
			const data = await getGroupByPerson(friendAddress, account);

			setGroup(data);
		}
	};

	const handleRequest = async () => {
		try {
			const balance =
				memberBalance[account?.toLowerCase()][
					otherAddress?.toLowerCase()
				];

			await createNotification(
				group.id,
				NotificationTypes.RequestToSettle,
				balance,
				account.toLowerCase(),
				otherAddress?.toLowerCase(),
				`${minimizeAddress(otherAddress?.toLowerCase())} has requested to settle with you`
			);
			toast.success("Request sent");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	const updateGroupData = async () => {
		try {
			if (!group) {
				return;
			}

			const updatedGroup: Group = {
				...group,
				groupBalance: memberBalance,
			};

			await axios.post(`/api/group/update`, {
				group: updatedGroup,
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchGroupData();
	}, [otherAddress, account]);

	const validTx = transactions.filter((tx) => !tx.skipped);

	useEffect(() => {
		if (transactions?.length && !!group) {
			updateGroupData();
		}
	}, [!!validTx.length]);

	const balanceAmount =
		memberBalance?.[account?.toLowerCase()]?.[
			otherAddress?.toLowerCase()
		] ?? 0;

	const handleCopy = () => {
		copy(address ?? otherPersonAccount)
		setAddressCopied(true)
		setTimeout(() => setAddressCopied(false), 2000)
	}

	const handleDelete = async () => {
		if(!group.id || loading) return;
		setLoading(true)
		try {
			await db
				.collection(firestoreCollections.GROUPS)
				.doc(group.id)
				.delete();
			toast.success('Group deleted!')
			router.push("/dashboard")
		} catch (error) {
			toast.error('Error deleting')
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="min-h-screen">
				<div className="container rounded-xl py-12 ">
					<button
						className="p-2 sm:ml-6 xs:ml-0 bg-white w-max xs:text-sm flex items-center rounded-md mb-6 text-base"
						onClick={() => router.back()}
					>
						<ArrowSmLeftIcon className='w-6 h-6 mr-2' />
						Go Back
					</button>
					<div className="mx-auto grid gap-6 sm:px-6 xs:px-0 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-5">
						<div className="space-y-6 border border-solid border-gray-100 card xs:p-4 xs:hidden rounded-3xl bg-white lg:col-start-1 lg:col-span-3">
							<div className="flex justify-between relative items-center">
								<div className="flex items-center space-x-5 w-full">
									<div className="group w-full">
										<div className="flex space-x-4 items-center">
											{avatar?.length ? (
												<img
													src={avatar}
													className="h-16 w-16 rounded-xl"
												/>
											) : (
												<Blockies
													seed={userName}
													size={9}
													scale={8}
													className="h-16 w-16 rounded-xl"
												/>
											)}

											<div>
												<h1 className="text-[32px] font-bold text-gray-900 mb-1">
													{userName}
												</h1>
												<div className="flex items-center cursor-pointer" onClick={handleCopy}>
													{
														addressCopied 
														? <CheckIcon className="w-4 h-4 text-green" />
														: <DuplicateIcon className="w-4 h-4" />
													}
													{!!name && (
														<span className="ml-2 text-sm">
															{`(${minimizeAddress(
																address ??
																	otherPersonAccount
															)})`}
														</span>
													)}
												</div>
											</div>
										</div>

										<div>
											{Object.entries(
												memberBalance[
													account?.toLowerCase()
												] ?? {}
											).map(([address, balance]) => {
												const shouldSkip =
													balance === 0 ||
													address ===
														account?.toLowerCase();
												const shouldPay = balance > 0;

												if (shouldSkip) return null;

												return (
													<div
														key={address}
														className="my-4 flex justify-between items-center space-x-6"
													>
														<div className="flex-1 text-base">
															{!shouldPay ? (
																<>
																	You owe
																	<span className="font-bold text-xl mx-2">
																		{
																			userName
																		}
																	</span>
																</>
															) : (
																<>
																	<span className="font-bold mr-2 text-xl">
																		{
																			userName
																		}
																	</span>
																	owes you
																</>
															)}
															<span
																className={`font-bold ml-2 text-xl ${
																	shouldSkip
																		? ""
																		: shouldPay
																		? " text-green "
																		: " text-orange"
																}`}
															>
																{balance === 0
																	? ""
																	: shouldPay
																	? "+ "
																	: ""}
																{balance.toPrecision(
																	3
																)}{" "}
																ETH
															</span>
														</div>
														{shouldPay ? (
															<div
																onClick={
																	handleRequest
																}
																className="border-2 text-white bg-black px-6 py-3 rounded-xl cursor-pointer transition-all ease-in-out"
															>
																Request
															</div>
														) : (
															<div
																onClick={() => {
																	setSelectedSection(
																		"pay"
																	);
																	setSettleAmount(
																		balanceAmount
																	);
																}}
																className="bg-black text-white border-2 border-black px-6 py-3 rounded-xl cursor-pointer transition-all ease-in-out"
															>
																Settle
															</div>
														)}
													</div>
												);
											})}
										</div>
									</div>
								</div>
								<Menu as="div" className="absolute top-0 right-0 inline-block text-left">
									<div>
										<Menu.Button className="">
											<DotsVerticalIcon className="h-6 w-6" />
										</Menu.Button>
									</div>

									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												<div
													onClick={() => setDeleteModalVisible(true)}
													className={classNames(
														"cursor-pointer flex items-center text-orange justify-between px-4 py-2 text-sm hover:text-white hover:bg-orange rounded-b-md"
													)}
												>
													<TrashIcon className="w-4 h-4" />
													Remove Fren
												</div>
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
							<div className="mt-8 border-b -mx-8 xs:hidden" />

							<Transactions
								transactions={transactions}
								account={account}
								group={group}
								friendAddress={otherAddress}
							/>
						</div>

						<section
							aria-labelledby="timeline-title"
							className={`${
								isOwner ? "grid grid-cols-1 gap-4" : ""
							} lg:col-span-2 xs:row-span-full`}
						>
							<div>
								<div className="card border border-solid border-gray-100 space-y-4 bg-white rounded-3xl">
									<div className="justify-between relative items-center hidden xs:flex">
										<div className="flex items-center space-x-5 w-full">
											<div className="group w-full">
												<div className="flex space-x-4 items-center">
													{avatar?.length ? (
														<img
															src={avatar}
															className="xs:w-10 xs:h-10 h-16 w-16 rounded-xl"
														/>
													) : (
														<Blockies
															seed={userName}
															size={8}
															scale={5}
															className="xs:w-10 xs:h-10 h-16 w-16 rounded-xl"
														/>
													)}

													<div>
														<h1 className="text-xl font-bold text-gray-900 mb-1">
															{userName}
														</h1>
														<div className="flex items-center cursor-pointer" onClick={handleCopy}>
															{
																addressCopied 
																? <CheckIcon className="w-4 h-4 text-green" />
																: <DuplicateIcon className="w-4 h-4" />
															}
															{!!name && (
																<span className="ml-2 text-sm">
																	{`(${minimizeAddress(
																		address ??
																			otherPersonAccount
																	)})`}
																</span>
															)}
														</div>
													</div>
												</div>

												<div>
													{Object.entries(
														memberBalance[
															account?.toLowerCase()
														] ?? {}
													).map(([address, balance]) => {
														const shouldSkip =
															balance === 0 ||
															address ===
																account?.toLowerCase();
														const shouldPay = balance > 0;

														if (shouldSkip) return null;

														return (
															<div
																key={address}
																className="my-4 flex flex-col justify-between"
															>
																<div className="flex-1 mb-4 text-xs">
																	{!shouldPay ? (
																		<>
																			You owe
																			<span className="font-bold text-base mx-2">
																				{
																					userName
																				}
																			</span>
																		</>
																	) : (
																		<>
																			<span className="font-bold mr-2 text-base">
																				{
																					userName
																				}
																			</span>
																			owes you
																		</>
																	)}
																	<span
																		className={`font-bold ml-2 text-base ${
																			shouldSkip
																				? ""
																				: shouldPay
																				? " text-green "
																				: " text-orange"
																		}`}
																	>
																		{balance === 0
																			? ""
																			: shouldPay
																			? "+ "
																			: ""}
																		{balance.toPrecision(
																			3
																		)}{" "}
																		ETH
																	</span>
																</div>
																{shouldPay ? (
																	<div
																		onClick={
																			handleRequest
																		}
																		className="border-2 text-center text-white bg-black px-6 py-3 rounded-xl cursor-pointer transition-all ease-in-out"
																	>
																		Request
																	</div>
																) : (
																	<div
																		onClick={() => {
																			setSelectedSection(
																				"pay"
																			);
																			setSettleAmount(
																				balanceAmount
																			);
																		}}
																		className="bg-black text-center text-white border-2 border-black px-6 py-3 rounded-xl cursor-pointer transition-all ease-in-out"
																	>
																		Settle
																	</div>
																)}
															</div>
														);
													})}
												</div>
											</div>
										</div>
										<Menu as="div" className="absolute top-0 right-0 inline-block text-left">
											<div>
												<Menu.Button className="">
													<DotsVerticalIcon className="h-6 w-6" />
												</Menu.Button>
											</div>

											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														<div
															onClick={() => setDeleteModalVisible(true)}
															className={classNames(
																"cursor-pointer flex items-center text-orange justify-between px-4 py-2 text-sm hover:text-white hover:bg-orange rounded-b-md"
															)}
														>
															<TrashIcon className="w-4 h-4" />
															Remove Fren
														</div>
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
									<div className="flex items-center justify-between">
										<div
											className={`px-4 py-2 pb-4 hidden xs:block relative text-center w-full cursor-pointer border-b-2 border-transparent text-sm ${
												selectedSection === "transaction" &&
												" active-bottom-border font-bold "
											}`}
											onClick={() =>
												setSelectedSection("transaction")
											}
										>
											Transactions
										</div>
										<div
											className={`px-4 py-2 pb-4 relative text-center w-full cursor-pointer border-b-2 border-transparent text-sm ${
												selectedSection === "pay" &&
												" active-bottom-border font-bold "
											}`}
											onClick={() =>
												setSelectedSection("pay")
											}
										>
											Pay
										</div>
										<div
											className={`px-4 py-2 pb-4 w-full relative text-center cursor-pointer border-b-2 border-transparent text-sm ${
												selectedSection === "request" &&
												"  active-bottom-border font-bold "
											}`}
											onClick={() =>
												setSelectedSection("request")
											}
										>
											Request
										</div>
									</div>
									{
										selectedSection === "transaction" && (
											<Transactions
												transactions={transactions}
												account={account}
												group={group}
												friendAddress={otherAddress}
											/>
										)
									}
									{selectedSection === "pay" && (
										<PaymentSection
											propAmount={settleAmount}
											settleAmount={setSettleAmount}
										/>
									)}
									{selectedSection === "request" && (
										<RequestSection group={group} />
									)}
								</div>
								<div className="mt-6 space-y-2">
									{notifications.map((notification) => (
										<RequestNotification
											settleAmount={(amount) => {
												setSelectedSection("pay");
												setSettleAmount(amount);
											}}
											notification={notification}
											key={notification.id}
										/>
									))}
								</div>
							</div>
						</section>
					</div>
				</div>
				<Modal 
					open={deleteModalVisible}
					onClose={() => setDeleteModalVisible(false)}
					showCTA={false}
				>
					<div className="p-4">
						<Image src={QuestionIllustration} alt='question' />
						<h1 className="text-left text-2xl font-bold">Are you Sure</h1>
						<p className="text-left text-base mt-2 mb-6">Once deleted you will have to import the <br /> transactions again.</p>
						<div className="flex items-center justify-between">
							<button onClick={() => setDeleteModalVisible(false)} className="px-6 py-2 rounded-md bg-gray-200">
								Cancel
							</button>
							<button onClick={handleDelete} disabled={loading} className={`px-6 text-white py-2 rounded-md bg-gradient-to-r from-purple to-pink disabled:bg-gray-200 disabled:text-black`}>
								{!loading ? 'Yes, Proceed' : 'Deleting...'}
							</button>
						</div>
					</div>
				</Modal>
				{/* <Modal
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					className="embed-modal"
					width={1032}
					bodyStyle={{
						borderRadius: "10px",
					}}
					title={
						<div className="font-urbanist">
							<h3 className="font-bold text-xl mb-1">
								Embed CryptoCoffee
							</h3>
							<p>
								Copy and paste the code below to send your
								website's visitors to your cryptocoffee page!
							</p>
						</div>
					}
					footer={null}
				>
					<div className="flex flex-col items-center justify-center">
						<Image src={embedbadge} />
						<div className="mt-8 relative mb-8 mx-8 border border-cryptopurple bg-lightpurple rounded-md py-8 px-12 text-lg">
							{script}
							<button
								className="flex absolute right-4 bottom-3 items-center text-lg text-cryptopurple"
								onClick={copyEmbedButtonScript}
								disabled={isScriptCopied}
							>
								{isScriptCopied ? (
									<CheckIcon className="w-6 h-6 mr-2" />
								) : (
									<DuplicateIcon className="w-6 h-6 mr-2" />
								)}
								Copy Code
							</button>
						</div>
					</div>
				</Modal> */}
			</div>
		</>
	);
};

export default UserPage;
