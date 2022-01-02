import React, { useState } from "react";
import Blockies from "react-blockies";
import { useCollection } from "react-firebase-hooks/firestore";
import ImportTransaction from "../components/ImportTransaction";
import PaymentSection from "../components/PaymentSection";
import { Group, Transaction } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { getGroup, minimizeAddress } from "../utils";
import { db, firestoreCollections } from "../utils/firebaseClient";
import { useEnsAddress } from "../utils/useEnsAddress";

declare let window: any;

export const getServerSideProps = async (req, res) => {
	const group = await getGroup(req.query.id);
	return {
		props: {
			group,
		},
	};
};

export interface ProfileProps {
	transactions: Transaction[];
	profileAddress: string;
	ens?: string;
	avatar?: string;
	group?: Group;
}

const Profile: React.FC<ProfileProps> = ({
	transactions: allTransactions,
	profileAddress,
	ens,
	avatar: defaultAvatar,
	group,
}) => {
	const { account } = useMoralisData();
	const { address, avatar, error, name } = useEnsAddress(account);
	const [selectedSection, setSelectedSection] = useState<"pay" | "import">(
		"pay"
	);

	const [snapshot] = useCollection(
		group?.id &&
			db
				.collection(firestoreCollections.TRANSACTIONS)
				.where("groupId", "==", group?.id)
	);

	const transactions: Transaction[] =
		(snapshot?.docs.map((doc) => doc.data() as Transaction) ?? []).sort(
			(a, b) => a.createdAt - b.createdAt
		) || [];
	const isOwner = group?.creator === account;

	console.log(transactions);

	return (
		<>
			<div className="bg-gray-50 min-h-screen">
				{/* Page header */}
				<div className="w-full bg-cryptopurple h-64" />
				<div className="max-w-6xl max-lg:mx-2 mx-auto rounded-xl py-12 ">
					<div className="-mt-64 mx-auto grid grid-cols-1 gap-6 sm:px-6 xs:px-0 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
						<div className="space-y-6 p-8 xs:p-4 rounded-lg bg-white shadow-md lg:col-start-1 lg:col-span-2 border border-gray-300">
							<div className="flex justify-between items-center sm:hidden">
								<div className="flex items-center space-x-5">
									<div className="group">
										<h1 className="font-urbanist text-3xl font-bold text-gray-900 mb-1">
											{group?.name}{" "}
										</h1>
										<span className="text-sm">
											{`(${group?.members
												.map((member) =>
													minimizeAddress(member)
												)
												.join(", ")})`}
										</span>
									</div>
								</div>
							</div>
							<div className="mt-8 border-b -mx-8 xs:hidden" />

							{/* Comments*/}
							<section aria-labelledby="notes-title">
								<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
									<div className="mb-8">
										<h2
											id="notes-title"
											className="text-xl font-urbanist font-bold text-gray-900"
										>
											Recent Supporters 🤝
										</h2>
									</div>
									<div>
										{transactions.map((txn) => (
											<div
												key={txn.id}
												className="space-y-2"
											>
												<div className="flex items-center space-x-2">
													<div>
														{minimizeAddress(
															txn.from,
															account
														)}
													</div>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17 8l4 4m0 0l-4 4m4-4H3"
														/>
													</svg>
													<div>
														{minimizeAddress(
															txn.to,
															account
														)}{" "}
													</div>
												</div>
												<div>{txn.amount} ETH</div>
											</div>
										))}
									</div>
								</div>
							</section>
						</div>

						<section
							aria-labelledby="timeline-title"
							className={`${
								isOwner ? "grid grid-cols-1 gap-4" : ""
							} lg:col-start-3 lg:col-span-1 sm:row-span-full`}
						>
							<div className="bg-white border border-gray-200 rounded-lg">
								<div className="hidden p-6 justify-between items-center sm:flex">
									<div className="flex items-center space-x-5">
										<div className="flex-shrink-0">
											{avatar && (
												<img
													src={avatar}
													alt={profileAddress}
													className="h-16 w-16 rounded-full"
												/>
											)}
											{!avatar && (
												<Blockies
													seed={profileAddress}
													size={9}
													scale={8}
													className="rounded-full"
												/>
											)}
										</div>
										<div className="group">
											<h1 className="font-urbanist text-2xl font-bold text-gray-900 mb-1">
												{/* <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md" /> */}
												{name ??
													minimizeAddress(
														profileAddress
													)}
											</h1>
										</div>
									</div>
								</div>
								<div className="p-4 space-y-4">
									<div className="flex items-center">
										<div
											className={`px-4 py-2 cursor-pointer border-b-2 border-transparent text-sm ${
												selectedSection === "pay" &&
												"  border-blue-600 "
											}`}
											onClick={() =>
												setSelectedSection("pay")
											}
										>
											Pay
										</div>
										<div
											className={`px-4 py-2 cursor-pointer border-b-2 border-transparent text-sm ${
												selectedSection === "import" &&
												"  border-blue-600 "
											}`}
											onClick={() =>
												setSelectedSection("import")
											}
										>
											Import
										</div>
									</div>
									{selectedSection === "pay" && (
										<PaymentSection />
									)}
									{selectedSection === "import" && (
										<ImportTransaction group={group} />
									)}
								</div>
							</div>
						</section>
					</div>
				</div>
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
						<div className="mt-8 relative mb-8 mx-8 border border-cryptopurple bg-lightpurple rounded-md py-8 px-12 font-urbanist text-lg">
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

// export const getStaticProps: GetStaticProps = async (context) => {
// 	const userAddress = context.params.id;

// 	const mainnetEndpoint =
// 		"https://speedy-nodes-nyc.moralis.io/d35afcfb3d409232f26629cd/eth/mainnet";
// 	const provider = new ethers.providers.JsonRpcProvider(mainnetEndpoint);

// 	const { address, name, avatar } = await validateAndResolveAddress(
// 		userAddress.toString(),
// 		provider
// 	);

// 	const transactionsResponse = await db
// 		.collection("transactions")
// 		.where("to", "==", address.toString().toLowerCase())
// 		.get();

// 	const transactions: Transaction[] = transactionsResponse.docs.map((doc) => {
// 		const data = doc.data();
// 		return {
// 			...(data as Transaction),
// 			id: doc.id,
// 		};
// 	});

// 	return {
// 		revalidate: 60,
// 		props: {
// 			transactions,
// 			profileAddress: address,
// 			ens: name,
// 			avatar: avatar ?? "",
// 		},
// 	};
// };

// export async function getStaticPaths() {
// 	return { paths: [], fallback: "blocking" };
// }

export default Profile;
