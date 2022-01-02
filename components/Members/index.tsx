import React, { useEffect, useState } from "react";
import { useMoralisData } from "../../hooks/useMoralisData";
import axios from "axios";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, firestoreCollections } from "../../utils/firebaseClient";
import { Group } from "../../contracts";

const Members = () => {
	// state to store array of addresses

	const { account } = useMoralisData();
	const router = useRouter();
	const [members, setMembers] = useState([]);
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);

	const [snapshot] = useCollection(
		account &&
			db
				.collection(firestoreCollections.GROUPS)
				.where("members", "array-contains", account)
	);

	console.log({ account, members }, members.length);

	const canAddNewMembers =
		!!members.length && members[members.length - 1]?.trim().length > 0;

	const handleInputChange = (e, index) => {
		const newMembers = [...members];

		newMembers[index] = e.target.value;
		console.log(newMembers);
		setMembers(newMembers);
	};

	const handleAddMember = () => {
		if (!canAddNewMembers) return;
		const newMembers = [...members];
		newMembers.push(address);
		setMembers(newMembers);
		setAddress("");
	};

	const handleDeleteMember = (index) => {
		const newMembers = [...members];
		newMembers.splice(index, 1);
		setMembers(newMembers);
	};

	const handleCreateGroup = async () => {
		try {
			setLoading(true);

			const group = await axios.post("/api/group/create", {
				members,
			});
			router.push(`/${group.data.id}`);
			console.log(group);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const cleanedGroups =
		snapshot?.docs.map((doc) => doc.data() as Group) ?? [];

	useEffect(() => {
		setMembers([account]);
	}, [account]);

	return (
		<div className="w-full">
			<div className="">
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Add members
					<div className="font-bold">(use address for now.)</div>
				</label>
				<div className="mt-1 space-y-2 w-64">
					{members.map((member, index) => (
						<div
							key={index}
							className="flex items-center space-x-4"
						>
							<input
								value={member}
								onChange={(e) => handleInputChange(e, index)}
								type="text"
								name="text"
								id="text"
								key={index}
								className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
								placeholder="you@example.com"
							/>
							{members.length > 1 && member !== account && (
								<span onClick={() => handleDeleteMember(index)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</span>
							)}
						</div>
					))}
					<div
						onClick={handleAddMember}
						className={`flex items-center space-x-2 cursor-pointer my-2 p-2  rounded-md transition-all ease-in-out ${
							canAddNewMembers
								? "hover:bg-indigo-100 "
								: "bg-gray-200 cursor-not-allowed"
						}`}
					>
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<span>Add new member</span>
					</div>
				</div>
				<button
					type="button"
					disabled={!canAddNewMembers}
					onClick={handleCreateGroup}
					className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white  mt-4 ${
						canAddNewMembers && members.length > 1
							? " bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
							: "cursor-not-allowed bg-gray-400"
					}`}
				>
					{loading ? (
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					) : (
						<div className="text-center w-full text-base">
							Create group
						</div>
					)}
				</button>
			</div>
			<div className="mt-8">
				<span>Existing groups</span>
				<div className="flex flex-wrap space-x-4">
					{cleanedGroups.map((group) => (
						<div
							key={group.id}
							onClick={() => router.push(`/${group.id}`)}
							className="rounded-md border-2 group border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-white cursor-pointer mt-4"
						>
							<div className="p-4 border-b-2 group-hover:border-white border-blue-600 text-6xl font-bold flex items-baseline space-x-2">
								<div>{group.members.length}</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
								</svg>
							</div>
							<div className="px-4 py-2">{group.name}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Members;
