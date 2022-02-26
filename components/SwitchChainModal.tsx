import React from 'react';
import Modal from './Modal';

export interface SwitchChainModalProps {
    visible: boolean;
    onSwitch: () => Promise<void>;
    switchingTo: string;
}

const SwitchChainModal: React.FC<SwitchChainModalProps> = ({
    visible,
    onSwitch,
    switchingTo
}) => {
    return (
        <Modal
            open={visible}
            onClose={() => null}
            showCTA={false}
        >
            <div className='flex flex-col'>
                <p>Switch to {switchingTo} to use this page</p>
                <button onClick={onSwitch} className='bg-gradient-to-r from-purple to-pink rounded-xl py-2 mt-2'>
                    Switch Chain
                </button>
            </div>
        </Modal>
    )
}

export default SwitchChainModal;
