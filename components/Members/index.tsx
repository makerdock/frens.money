import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import illustration from "../../assets/illustration.png";
import wallet from "../../assets/Wallet.svg";
import { useMoralisData } from "../../hooks/useMoralisData";
import Button from "../Button";

const Members = () => {
	// state to store array of addresses

	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const {
		authenticate,
		isAuthenticated,
		account: walletAddress,
		user,
	} = useMoralisData();

	const queriedAddress = user?.get("ethAddress");
	const account = walletAddress ?? queriedAddress;

	const handleAuth = async () => {
		try {
			setLoading(true);
			const options: AuthenticateOptions = {
				signingMessage: `
					Get your audience support with crypto!\n
					With BuyMeACryptoCoffee your audience can support you with cryptocurrency.\n
					How does it work?\n
					- Supporter connects their Wallet on Crypto Coffee
					- They enter their favorite creator’s wallet address and donate crypto.
					- Creators can create their own crypto coffee page and share with their audience too
				`,
				chainId: process.env.NODE_ENV === "development" ? 4 : 1,
			};

			if (!(window as any).ethereum) {
				options.provider = "walletconnect";
			}

			await authenticate(options);

			router.push("/dashboard");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated]);

	return (
		<div className="w-full min-h-full flex justify-between items-center flex-col">
			<div>
				<div className="flex justify-center items-center mb-8">
					<Image src={wallet} />
					<h1 className="text-3xl ml-4 mb-0 font-bold">Cryptowise</h1>
				</div>
				<div className="flex justify-center items-center flex-col mb-10">
					<p className="text-6xl text-center font-bold leading-tight mb-8">
						Crypto is Expensive 🤑, Manage all transactions with
						Cryptowise{" "}
					</p>
					<div className="flex space-x-6 items-center">
						{!loading && (
							<Button size="lg" onClick={handleAuth}>
								Connect your wallet
							</Button>
						)}

						{!!loading && <span>loading...</span>}
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
