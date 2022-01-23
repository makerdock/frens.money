import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import illustration from "../assets/illustration.png";
import wallet from "../assets/Wallet.svg";
import Button from "../components/Button";
import { useMoralisData } from "../hooks/useMoralisData";
import { getSignedNonce } from "../utils/crypto";
import firebaseClient from "../utils/firebaseClient";

declare let window: any;

const Dashboard: React.FC = () => {
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

			const nonce = await axios.get(
				`/api/auth/getNonce?address=${account}`
			);

			console.log({ nonce: nonce.data });

			const signature = await getSignedNonce(nonce.data.nonce);

			console.log({ signature });

			const token = await axios.post(`/api/auth/verifyNonce`, {
				address: account,
				signature,
			});

			console.log({ token: token.data });

			// await firebaseClient.default
			// 	.auth()
			// 	.signInWithCustomToken(token.data.token);

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
		<div className="flex justify-center items-center">
			<div className="max-w-7xl flex space-x-4 justify-center items-center font-urbanist py-12 pb-0">
				<div className="w-full min-h-full flex justify-between items-center flex-col">
					<div>
						<div className="flex justify-center items-center mb-8">
							<Image src={wallet} />
							<h1 className="text-3xl ml-4 mb-0 font-bold">
								Cryptowise
							</h1>
						</div>
						<div className="flex justify-center items-center flex-col mb-10">
							<p className="text-6xl text-center font-bold leading-tight mb-8">
								Crypto is Expensive 🤑, Manage all transactions
								with Cryptowise{" "}
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
			</div>
		</div>
	);
};

export default Dashboard;

export const getStaticProps = async () => {
	return { props: { hideNavbar: true } };
};

/**
 *
 *
 * nonce ->
 * FE gets nonce -> metamask -> signature
 * BE verifies signature -> and check address
 * user gets nonce in DB
 *
 *
 *
 *
 *
 *
 */
