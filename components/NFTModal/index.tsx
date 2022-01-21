import React from "react";
import { importTransaction } from "../../utils";
import Modal from "../Modal";

const NFTModal = ({
	addNftTransactionModal,
	setAddNftTransactionModal,
	group,
}) => {
	const [transactionId, setTransactionId] = React.useState("");

	const handleImportTransaction = async () => {
		console.log("here");
		await importTransaction(transactionId, group);
	};

	return (
		<Modal
			open={addNftTransactionModal}
			onClose={() => setAddNftTransactionModal(false)}
			title="Add NFT Transaction"
			onOk={handleImportTransaction}
			okText="Add"
		>
			<div>
				<label
					htmlFor="text"
					className="block text-sm font-medium text-gray-700"
				>
					Transaction id
				</label>
				<div className="mt-1">
					<input
						value={transactionId}
						onChange={(e) => setTransactionId(e.target.value)}
						type="text"
						name="text"
						id="text"
						className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						placeholder="you@example.com"
					/>
				</div>
			</div>
		</Modal>
	);
};

export default NFTModal;
