import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { getEllipsisTxt } from "../helpers/formatters";
import { useMoralisData } from "../hooks/useMoralisData";
import { useChainId } from "../utils/useChainId";
import { useEnsAddress } from "../utils/useEnsAddress";
import Blockie from "./Blockie";
import Loader from "./Loader";

function Account() {
	const router = useRouter();
	const {
		authenticate,
		isAuthenticated,
		account: walletAddress,
		user,
		logout,
	} = useMoralisData();
	const [loading, setLoading] = useState(false);
	const isOnMintPage = router.pathname.includes("/mint");

	const queriedAddress = user?.get("ethAddress");
	const account = walletAddress ?? queriedAddress;

	const { name: ensAddress, avatar } = useEnsAddress(account);
	const { switchToDesiredChainId, isOnDesiredChainId } = useChainId(isOnMintPage);

	const handleAuth = async () => {
		try {
			setLoading(true);
			if(!isOnDesiredChainId) {
				await switchToDesiredChainId();
			}
			const options: AuthenticateOptions = {
				signingMessage: `
					Get your audience support with crypto!\n
					With BuyMeACryptoCoffee your audience can support you with cryptocurrency.\n
					How does it work?\n
					- Supporter connects their Wallet on Crypto Coffee
					- They enter their favorite creator’s wallet address and donate crypto.
					- Creators can create their own crypto coffee page and share with their audience too
				`,
			};

			if (!(window as any).ethereum) {
				options.provider = "walletconnect";
			}

			await authenticate(options);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	if(!isAuthenticated) {
		return (
			<button
				type="button"
				onClick={handleAuth}
				className="relative inline-flex h-14 w-48 justify-center backdrop-blur-lg items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple to-pink border-opacity-10 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cryptopurple"
			>
				Connect Wallet
			</button>
		);
	}

	if (loading) {
		return (
			<div className=" bg-gray-200 rounded-lg px-2 py-3 w-48 flex justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<>
			<Menu as="div" className="relative inline-block text-left z-40">
				<div>
					<Menu.Button className="inline-flex bg-gradient-to-r from-purple to-pink justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cryptopurple">
						{!!avatar && (
							<img src={avatar} className="h-6 w-6 rounded-lg" />
						)}
						{!avatar && <Blockie currentWallet scale={3} />}
						<p className="my-0">
							{ensAddress || getEllipsisTxt(account, 6)}
						</p>
						<ChevronDownIcon
							className="-mr-1 ml-2 h-5 w-5"
							aria-hidden="true"
						/>
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
					<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
						<div className="py-1 z-20">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => {
											logout()
											router.push('/')
										}}
										type="submit"
										className={`${
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700"
										} block w-full text-left px-4 py-2 text-sm
										`}
									>
										Sign out
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	);
}

export default Account;
