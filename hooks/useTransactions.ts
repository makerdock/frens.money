import React from "react";

import { useChain, useNativeTransactions } from "react-moralis";
import { useMoralisData } from "./useMoralisData";

const useTransactions = (
	toAddress: string
): {
	result: any[];
} => {
	const { account } = useMoralisData();

	const { chainId } = useChain();

	const { getNativeTransations, data, error, isLoading, isFetching } =
		useNativeTransactions({
			chain: chainId as any,
			address: account,
		});

	const result = data.result.reduce();

	return {};
};

export default useTransactions;
