import { NextPage } from "next";
import { ThirdwebSDK } from "@3rdweb/sdk";
import Button from "../components/Button";
import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { useMoralisData } from "../hooks/useMoralisData";

const sdk = new ThirdwebSDK(process.env.NEXT_PUBLIC_CRYPTOWISE_CONTRACT_CHAIN);
const bundleDropModule = sdk.getBundleDropModule(
	process.env.NEXT_PUBLIC_CRYPTOWISE_CONTRACT_ADDRESS
);

const MintPage: NextPage = () => {
	const [isClaiming, setIsClaiming] = useState(false);
	const [hasClaimedNFT, sethasClaimedNFT] = useState(false);

	const { address, provider } = useWeb3();

	// The signer is required to sign transactions on the blockchain.
	// Without it we can only read data, not write.
	const signer = provider ? provider.getSigner() : undefined;

	useEffect(() => {
		// We pass the signer to the sdk, which enables us to interact with
		// our deployed contract!
		if (!signer) return;
		sdk.setProviderOrSigner(signer);
	}, [signer]);

	const checkHasClaimedNFT = async () => {
		try {
			const results = await bundleDropModule.getOwned();
			const hasClaimedNFT = !!results.length;
			sethasClaimedNFT(hasClaimedNFT);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		checkHasClaimedNFT();
	}, [address]);

	const claimNFT = async () => {
		setIsClaiming(true);
		try {
			await bundleDropModule.claim("0", 1);
		} catch (error) {
			console.error(error.message);
		} finally {
			setIsClaiming(false);
			sethasClaimedNFT(true);
		}
	};

	const renderMintButton = () => {
		return hasClaimedNFT ? (
			<Button fullWidth disabled={hasClaimedNFT}>
				You have already claimed the NFT!
			</Button>
		) : (
			<Button fullWidth loading={isClaiming} onClick={claimNFT}>
				Mint now
			</Button>
		);
	};

	return <div className="max-w-3xl mx-auto">{renderMintButton()}</div>;
};

export default MintPage;
