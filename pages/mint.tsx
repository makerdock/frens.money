import { ethers } from 'ethers';
import React from 'react'
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { useMoralisData } from '../hooks/useMoralisData';
import { nftContract } from '../utils/crypto';
import { useChainId } from '../utils/useChainId';
import successAnimation from '../utils/lottie-success.json';
import { useWalletMembershipAccess } from '../utils/useWalletMembershipAccess';
import Lottie from 'lottie-react'
import { useRouter } from 'next/router';
import SwitchChainModal from '../components/SwitchChainModal';

const Mint: React.FC = () => {

    const router = useRouter()

    const {
		authenticate,
		isAuthenticated,
		account: walletAddress,
		user,
	} = useMoralisData();
    const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'testnet';

    const [minted, setMinted] = React.useState(false);
    const [txHash, setTxHash] = React.useState('');

    const {access, isAccessLoading} = useWalletMembershipAccess();
    const { chainId, switchToDesiredChainId, isOnDesiredChainId } = useChainId(true);

    const mintPass = async () => {
        if(!isAuthenticated) {
            toast.error('Please connect to your wallet');
            return;
        }
        try {
            const transaction = await nftContract().mintPass(
                walletAddress,
                {
					value: ethers.utils.parseEther(String(1)),
				}
            );

            setTxHash(transaction.hash);    
            await transaction.wait();
    
            setMinted(true);
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div>
				<div className="max-w-7xl min-h-screen mx-auto px-2 sm:px-4 lg:px-8 flex space-x-4 items-center font-urbanist">
					<div className="flex-1 px-4 md:px-0">
						<h1 className="text-5xl font-bold mb-14">
							Mint your{" "}<br/>
							<span className="bg-gradient-to-r from-purple to-pink text-transparent bg-clip-text">Cryptowise pass</span>
						</h1>
                        <ul className='list-disc py-8 pl-16 pr-8 text-2xl shadow-md rounded-md'>
                            <li>Unlimited groups with your frens</li>
                            <li>Unlimited transaction records</li>
                            <li>Early access to future features</li>
                        </ul>
					</div>
					<div className="md:block xs:hidden flex-1 px-16">
                        <video className="rounded-xl" src="/access-pass.mp4" muted controls={false} autoPlay preload='auto' loop />
                        <button onClick={mintPass} disabled={access || isAccessLoading} className='bg-gradient-to-r from-purple to-pink rounded-xl w-full mt-3 py-4 text-white text-2xl disabled:bg-gray-400 disabled:bg-none'>
                            {!isAuthenticated ? 'Connect Wallet' : isAccessLoading ? 'Loading...' : access ? "Already Minted" : "Mint for 10 $MATIC"}
                        </button>
					</div>
				</div>
			</div>
            <SwitchChainModal 
                visible={!isOnDesiredChainId}
                onSwitch={switchToDesiredChainId}
                switchingTo={'Polygon'}
            />
            <Modal
                showCTA={false}
                open={minted}
                onClose={() => {
                    setTxHash('')
                    setMinted(false)
                }}
            >
                <div className='text-left w-96 p-6'>
                    <Lottie animationData={successAnimation} loop className='w-60 mx-auto' />
                    <h3 className='text-2xl font-bold'>Mint Successful</h3>
                    <p className='my-2'>Cryptowise Pass has been successfully minted to your address. Now you have full access to the app</p>
                    {/* need to add isDevelopment in below condition later on */}
                    <a href={isDevelopment ? `https://mumbai.polygonscan.com/tx/${txHash}` : `https://polygonscan.com/tx/${txHash}`} className='underline hover:text-black hover:underline'>Check on PolygonScan</a>
                    <button onClick={() => router.push('/dashboard')} className=' bg-gradient-to-r from-purple to-pink rounded-xl w-full mt-8 py-2 text-white text-base'>
                        Go to Dashboard
                    </button>
                </div>
            </Modal>
        </div>   
    )
}

export const getStaticProps = async () => {
	return { props: { hideNavbar: false } };
};

export default Mint
