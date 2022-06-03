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
    const [totalMinted, setTotalMinted] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'testnet';

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
				isDevelopment ? mumbaiNode : polygonMainnetNode;
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

    const fetchTotalMinted = async () => {
        try {
            const totalMinted = await nftContract().totalMinted();
            setTotalMinted(totalMinted.toNumber());
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        checkMembership();
        fetchTotalMinted();
    }, [walletAddress, isAuthenticated])

    return {
        access,
        isAccessLoading: loading,
        totalMinted
    };
}

export {
    useWalletMembershipAccess
}