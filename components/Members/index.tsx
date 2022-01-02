import React, { useEffect, useState } from "react";
import { useMoralisData } from "../../hooks/useMoralisData";
import axios from "axios";

const Members = () => {
	// state to store array of addresses

	const { account } = useMoralisData();

	const [members, setMembers] = useState([]);
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
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
			console.log(group);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setMembers([account]);
	}, [account]);

	return (
		<div>
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Add members
				</label>
				<div className="mt-1 space-y-2">
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
				</div>
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
				Create group
			</button>
		</div>
	);
};

export default Members;
