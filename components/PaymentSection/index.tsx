import Moralis from "moralis";
import { useRouter } from "next/router";
import React, { ReactText, useEffect, useState } from "react";
import { useChain, useERC20Balances, useNativeBalance } from "react-moralis";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import { useMoralisData } from "../../hooks/useMoralisData";
import { saveTransaction } from "../../utils";
import { chainLogo, tokenMetadata } from "../../utils/tokens";
import AddressInput from "../AddressInput";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
	readonly logo?: string;
}

const PaymentSection = ({}) => {
	const { account: address, user, web3, chainId, sendTx } = useMoralisData();
	const {
		query: { id },
	} = useRouter();

	const { switchNetwork } = useChain();

	const [price, setPrice] = useState(0);
	const [message, setMessage] = useState("");
	const [receiverAddress, setReceiverAddress] = useState<string>("");

	const [selectedToken, setSelectedToken] = useState<string>();
	const [isLoading, setIsLoading] = React.useState(false);

	const {
		getBalances,
		data: nativeData,
		isFetching: isFetchingNative,
		isLoading: isLoadingNative,
		error: errorNative,
	} = useNativeBalance({
		address,
		chain: chainId as any,
	});

	const fetchBalances = async () => {
		await getBalances();
	};
	const nativeTokenName = nativeData?.formatted?.split(" ")[1] ?? "";
	const cleanedNativeTokens = {
		symbol: nativeTokenName,
		balance:
			nativeData.formatted ??
			`${(nativeData.balance
				? Number(nativeData.balance) / 10 ** 18
				: 0
			).toFixed(4)} MATIC`,
		name: nativeTokenName,
		decimals: 18,
		tokenAddress: null,
		logo: tokenMetadata[nativeTokenName]?.logoURI,
	};

	const handleTransaction = async () => {
		try {
			setIsLoading(true);
			const tx = await sendTx(receiverAddress, price, message);
			toast.success(`Transaction sent! Tx hash: ${tx.hash}`);

			const newTx: Transaction = {
				...new Transaction(),
				id: tx.hash,
				groupId: String(id),
				from: address,
				to: receiverAddress,
				amount: price,
				createdAt: new Date().getTime(),
			};

			await saveTransaction(newTx);
		} catch (error) {
			if (error?.data?.message) {
				toast.error(error.data.message);
			}
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const tokensArray: Token[] = [cleanedNativeTokens];

	const disableDonateButton = isLoadingNative || isFetchingNative || !price;

	const selectedTokenData =
		tokensArray.find((token) => token.name === selectedToken) ??
		cleanedNativeTokens;

	const handleMax = () => {
		setPrice(
			Number((selectedTokenData.balance as string)?.split(" ")[0] ?? 0)
		);
	};

	const handleChangeToMatic = () => {
		switchNetwork("0x1");
	};

	const { symbol } = selectedTokenData;

	useEffect(() => {
		if (!!address) {
			fetchBalances();
		}
	}, [address]);

	return (
		<div className="grid gap-6 w-full">
			{/* {!isMainnet && (
				<>
					<h3 className="text-xl ">
						You are not currently linked to matic network
					</h3>
					<button
						type="button"
						disabled={isLoading}
						onClick={handleChangeToMatic}
						className={`justify-center h-14 text-black mt-3 rounded-full inline-flex items-center px-4 py-2 border border-transparent text-base font-medium shadow-sm bg-gradient-to-r from-brand-gradient-blue via-brand-gradient-pink to-brand-gradient-orange w-full`}
					>
						Link to matic network
					</button>
				</>
			)} */}

			{
				<>
					<AddressInput
						defaultValue={receiverAddress}
						onChange={setReceiverAddress}
					/>

					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						rows={4}
						name="comment"
						id="comment"
						placeholder="Enter a message for your fren"
						className=" shadow-sm placeholder-opacity-50 placeholder-white block w-full sm:text-sm border border-solid  border-gray-600 border-opacity-20 bg-white bg-opacity-10 rounded-md p-4"
					/>

					<div className="rounded-md mt-2 ">
						<div className="flex items-center justify-between border border-solid  border-gray-600 border-opacity-20 bg-white bg-opacity-10 rounded-md">
							<input
								type="number"
								name="amount"
								id="amount"
								min="0"
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
								style={{
									appearance: "none",
								}}
								className="block text-2xl w-full font-bold border-none  border-gray-600 border-opacity-20 bg-transparent rounded-md text-right focus:ring-0 shadow-none cursor-pointer transition duration-300 ease-in-out"
								placeholder="Enter amount in ETH"
							/>
							<button
								className="mr-4 opacity-80 rounded-lg"
								onClick={handleMax}
							>
								MAX
							</button>
						</div>
						<div className="mt-2 text-xs text-right">
							BALANCE: {selectedTokenData?.balance ?? 0}
						</div>
					</div>

					<button
						type="button"
						disabled={isLoading}
						onClick={handleTransaction}
						className={`justify-center h-14 text-white bg-blue-600 mt-3 rounded-md inline-flex items-center px-4 py-2 border border-transparent text-base font-medium shadow-sm bg-gradient-to-r from-brand-gradient-blue via-brand-gradient-pink to-brand-gradient-orange w-full ${
							isLoading
								? "opacity-50 cursor-not-allowed "
								: " hover:bg-brand-maximum-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-maximum-red "
						}`}
					>
						{!isLoading ? (
							`Send ${!!symbol ? `( ${price} ${symbol} )` : ""} `
						) : (
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 "
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
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						)}
					</button>
				</>
			}
		</div>
	);
};

export default PaymentSection;
