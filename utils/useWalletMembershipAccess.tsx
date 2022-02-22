import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useChain } from 'react-moralis';
import { toast } from 'react-toastify';
import { useMoralisData } from '../hooks/useMoralisData';
import { nftContract } from './crypto';

const mumbaiNode = "https://speedy-nodes-nyc.moralis.io/d3fb7f6ee224bc9e52bb5075/polygon/mumbai";
const polygonMainnetNode = "https://speedy-nodes-nyc.moralis.io/d3fb7f6ee224bc9e52bb5075/polygon/mainnet"

const useWalletMembershipAccess = () => {
    const [access, setAccess] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const isDevelopment = process.env.NODE_ENV === 'development';

    const {
		authenticate,
		isAuthenticated,
		account: walletAddress,
		user,
	} = useMoralisData();

    const checkMembership = async () => {
        if(!walletAddress) return;
        setLoading(true);
        try{
            // need to change to isDevelopment
            const endpoint =
				true ? mumbaiNode : polygonMainnetNode;
			const rpcProvider = new ethers.providers.JsonRpcProvider(
                endpoint
            );
            const quantity = await nftContract(walletAddress, rpcProvider).balanceOf(walletAddress, 0);
            setAccess(!!quantity?.toNumber());
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkMembership();
    }, [walletAddress, isAuthenticated])

    return {
        access,
        isAccessLoading: loading,
    };
}

export {
    useWalletMembershipAccess
}