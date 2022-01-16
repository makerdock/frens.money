import React, { useEffect, useState } from "react";
import { useMoralisData } from "../../hooks/useMoralisData";
import axios from "axios";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, firestoreCollections } from "../../utils/firebaseClient";
import { Group } from "../../contracts";
import Account from "../Account";
import Chains from "../Chains";
import Image from "next/image";
import wallet from "../../assets/Wallet.svg";
import illustration from "../../assets/illustration.png";
import Button from "../Button";

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
			router.push(`/groups/${group.data.id}`);
			console.log(group);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

    const isWalletConnected = async () => {
        if (account) {
            router.push(`/dashboard`);
        }
    }

	const cleanedGroups =
		snapshot?.docs.map((doc) => doc.data() as Group) ?? [];

	useEffect(() => {
		setMembers([account]);
	}, [account]);

	return (

        <div className="w-full h-full flex justify-between items-center flex-col">
            <div>
                <div className="flex justify-center items-center mb-8">
                    <Image src={wallet}/>
                    <h1 className="text-3xl ml-4 mb-0 font-bold">Cryptowise</h1>
                </div>
                <div className="flex justify-center items-center flex-col mb-10">
                    <p className="text-6xl text-center font-bold leading-tight mb-8">Crypto is Expensive 🤑, Manage all transactions with Cryptowise </p>
                    <div className="flex space-x-6 items-center">
                        <Button onClick={isWalletConnected}>
							<Account />
                        </Button>
					</div>
                </div>
            </div>
            <div>
                <Image src={illustration} />
            </div>
        </div>
	);
};

export default Members;
