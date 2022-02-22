import Moralis from 'moralis';
import React from 'react';
import { useChain } from 'react-moralis';
import { useMoralisData } from '../hooks/useMoralisData';
const POLYGON_CHAIN_ID = "0x89";
const POLYGON_CHAIN_ID_TESTNET = "0x13881";
const ETH_MAINNET_CHAIN_ID = "0x1";
const ETH_RINKBY_CHAIN_ID = "0x4";

const useChainId = (isForNft: boolean) => {
     const {
		authenticate,
		isAuthenticated,
		account: walletAddress,
		user,
        isWeb3Enabled
	} = useMoralisData();
    const { chainId: connectedChainId, switchNetwork } = useChain();
    const isDevelopment = process.env.NODE_ENV === 'development';
    const [chainId, setChainId] = React.useState(null);
    // need to change to isDevelopment
    const desiredChainId = true
    ? isForNft ? POLYGON_CHAIN_ID_TESTNET : ETH_RINKBY_CHAIN_ID
    : isForNft ? POLYGON_CHAIN_ID : ETH_MAINNET_CHAIN_ID;

    const checkChainId = async () => {
        // need to change to isDevelopment
        if(true) {
            setChainId(isForNft ? POLYGON_CHAIN_ID_TESTNET : ETH_RINKBY_CHAIN_ID);
            return;
        }
        setChainId(isForNft ? POLYGON_CHAIN_ID : ETH_MAINNET_CHAIN_ID);
    }

    const switchToDesiredChainId = async () => {
        if(!chainId) return;
        await switchNetwork(chainId);
    }

    React.useEffect(() => {
        checkChainId();
    }, [connectedChainId])

    React.useEffect(() => {
        Moralis.Web3.enableWeb3();
    }, [])

    return {
        chainId,
        desiredChainId,
        switchToDesiredChainId,
        isOnDesiredChainId: chainId === connectedChainId,
    };
}

export {
    useChainId
}