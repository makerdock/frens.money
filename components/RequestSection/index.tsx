import { useRouter } from "next/router";
import React, { ReactText, useEffect, useState } from "react";
import { useChain, useNativeBalance } from "react-moralis";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import { useMoralisData } from "../../hooks/useMoralisData";
import { saveTransaction } from "../../utils";
import { tokenMetadata } from "../../utils/tokens";
import Button from "../Button";

interface Token {
	readonly name: string;
	readonly symbol: string;
	readonly balance: ReactText;
	readonly decimals: number;
	readonly tokenAddress: string | null;
	readonly logo?: string;
}

const RequestSection = ({}) => {
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

	const handleRequest = async () => {
		try {
			setIsLoading(true);
			// const tx = await sendTx(receiverAddress, price, message);
			// toast.success(`Transaction sent! Tx hash: ${tx.hash}`);

			// const newTx: Transaction = {
			// 	...new Transaction(),
			// 	id: tx.hash,
			// 	groupId: String(id),
			// 	from: address,
			// 	to: receiverAddress,
			// 	amount: price,
			// 	createdAt: new Date().getTime(),
			// };

			// await saveTransaction(newTx);
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

	const disableRequestButton = isLoadingNative || isFetchingNative || !price;

	const selectedTokenData =
		tokensArray.find((token) => token.name === selectedToken) ??
		cleanedNativeTokens;

	const { symbol } = selectedTokenData;

	useEffect(() => {
		if (!!address) {
			fetchBalances();
		}
	}, [address]);

	return (
		<div className="grid gap-6 w-full">
			<textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				rows={4}
				name="comment"
				id="comment"
				placeholder="Add notes to request"
				className=" shadow-sm placeholder-opacity-50 placeholder-border-gray-600 block w-full sm:text-sm border border-solid  border-gray-600 border-opacity-20 bg-white bg-opacity-10 rounded-md p-2"
			/>

			<div className="rounded-md mt-2 ">
				<div className="flex items-center justify-between border border-solid  border-gray-600 border-opacity-20 bg-white bg-opacity-10 rounded-md">
					<input
						type="number"
						name="amount"
						id="amount"
						min="0"
						value={price}
						onChange={(e) => setPrice(Number(e.target.value))}
						style={{
							appearance: "none",
						}}
						className="block text-2xl w-full font-bold border-none  border-gray-600 border-opacity-20 bg-transparent rounded-md text-right focus:ring-0 shadow-none cursor-pointer transition duration-300 ease-in-out"
						placeholder="Enter amount in ETH"
					/>
				</div>
				<div className="mt-2 text-xs text-right">
					BALANCE: {selectedTokenData?.balance ?? 0}
				</div>
			</div>

			<Button
				type="button"
				disabled={isLoading || disableRequestButton}
				onClick={handleRequest}
				loading={isLoading}
				size="lg"
			>
				Request {!!symbol ? `( ${price} ${symbol} )` : ""}
			</Button>
		</div>
	);
};

export default RequestSection;