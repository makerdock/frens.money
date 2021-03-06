import { ethers } from "ethers";
import CryptoWise from "../abis/CryptoWise.json";

declare let window: any;

const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'testnet';

export const getSignedNonce = async (nonce: string) => {
	const { ethereum } = window;

	if (!ethereum) {
		console.log("Make sure you have metamask!");
		return;
	} else {
		console.log("We have the ethereum object");
	}

	const hexNonce = ethers.utils.hexlify(Number(nonce));

	console.log({ hexNonce });

	const signature = await ethereum.request({
		method: "personal_sign",
		params: [hexNonce, ethereum.selectedAddress],
	});

	console.log({ signature, nonce });

	return signature;
};

export const checkIfWalletIsConnected = async (): Promise<string> => {
	try {
		if (!window) {
			throw new Error("No window object");
		}

		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have metamask!");
			return;
		} else {
			console.log("We have the ethereum object");
		}

		/*
		 * Check if we're authorized to access the user's wallet
		 */

		let chainId = await ethereum.request({ method: "eth_chainId" });

		// String, hex code of the chainId of the Rinkebey test network
		// const rinkebyChainId = "0x4";
		const mainnetChainId = "0x1";
		if (chainId !== mainnetChainId) {
			throw new Error("Please connect to the mainnet");
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });

		/*
		 * User can have multiple authorized accounts, we grab the first one if its there!
		 */

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account:", account);
			return account;
		} else {
			console.log("No authorized account found");
		}
	} catch (error) {
		console.error(error);
	}
};

export const connectWallet = async () => {
	try {
		if (!window) {
			throw new Error("No window object");
		}

		const { ethereum } = window;

		if (!ethereum) {
			alert("Get MetaMask!");
			return;
		}

		/*
		 * Fancy method to request access to account.
		 */

		// let chainId = await ethereum.request({ method: "eth_chainId" });
		// console.log(chainId);
		// console.log("Connected to chain " + chainId);

		// // String, hex code of the chainId of the Rinkebey test network
		// const rinkebyChainId = "0x4";
		// if (chainId !== rinkebyChainId) {
		// 	alert("You are not connected to the Rinkeby Test Network!");
		// 	throw new Error(
		// 		"You are not connected to the Rinkeby Test Network!"
		// 	);
		// }

		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});

		/*
		 * Boom! This should print out public address once we authorize Metamask.
		 */
		console.log({ accounts });
		console.log("Connected", accounts[0]);

		return accounts[0];
	} catch (error) {
		console.log(error);
	}
};

export const sendTransaction = async (
	addr: string,
	message: string,
	ether: string
) => {
	await window.ethereum.send("eth_requestAccounts");
	console.log("here", ethers);
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	console.log({ provider });
	const signer = provider.getSigner();
	ethers.utils.getAddress(addr);
	console.log({ signer });
	const hexaMessage = ethers.utils.formatBytes32String(message);
	console.log({ hexaMessage });
	const tx = await signer.sendTransaction({
		to: addr,
		value: ethers.utils.parseEther(ether),
		data: hexaMessage,
	});

	return tx;
};

export interface ENSResponse {
	address?: string | null;
	name?: string | null;
	avatar?: string | null;
	error?: string | null;
}
export const validateAndResolveAddress = async (
	userAddress: string,
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
): Promise<ENSResponse | undefined> => {
	try {
		let address, name, avatar;

		if (userAddress.includes(".")) {
			const ensResolver = await provider.resolveName(userAddress);

			if (!ensResolver) {
				// toast.error("This address is not valid");
				throw new Error("This address is not valid");
			}

			address = ensResolver;
			name = userAddress;
		}

		if (!userAddress.includes(".")) {
			ethers.utils.getAddress(userAddress);

			name = await provider.lookupAddress(userAddress);

			address = userAddress;
		}

		if (name) {
			avatar = await provider.getAvatar(name);
		}

		return { address, name, avatar };
	} catch (error) {
		console.error(error);
		return {};
	}
};

export const nftContract = (walletAddress?: string, externalProvider?: ethers.providers.JsonRpcProvider) => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = (externalProvider ?? provider).getSigner(walletAddress);
    const contractReader = new ethers.Contract(
      isDevelopment ? "0x022635A0A3f14Eab0A8B97ee6aB7Ed1D710EFfb0" : "0x56bD9ec2b3ED99204a28a45D00C2e427513eb9d9",
      CryptoWise,
      signer
    );
    return contractReader;
  }

  return null;
};
