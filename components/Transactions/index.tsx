import { PlusIcon } from "@heroicons/react/outline";
import classnames from "classnames";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Group, Transaction } from "../../contracts";
import { importTransaction } from "../../utils";
import Button from "../Button";
import ImportTransactions from "./ImportTransactions";
import TransactionLog from "./TransactionLog";

// humanise datestring using intl
// const humaniseDate = (date: Date) => {
// 	return new Intl.DateTimeFormat("en-US").format(date);
// };

const Transactions = ({
	transactions,
	account,
	group,
	friendAddress,
}: {
	transactions: Transaction[];
	account: string;
	group: Group;
	friendAddress: string;
}) => {
	const [importing, setImporting] = useState(false);

	const [loading, setLoading] = useState(false);
	const [transactionId, setTransactionId] = useState("");

	const handleImportTransaction = async () => {
		try {
			setLoading(true);
			await importTransaction(transactionId, group);
			toast.success("Transaction imported successfully");
			setTransactionId("");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section aria-labelledby="notes-title">
			<h3 className="text-2xl font-bold flex items-center justify-between mb-6">
				Transactions
				{importing ? (
					<Button onClick={() => setImporting(false)}>
						Finish importing
					</Button>
				) : (
					<Button onClick={() => setImporting(true)}>
						<div className="h-4 w-4 mr-2">
							<PlusIcon />
						</div>
						Import from Etherscan
					</Button>
				)}
			</h3>
			<div className="mt-1 flex items-center space-x-2">
				<input
					value={transactionId}
					onChange={(e) => setTransactionId(e.target.value)}
					type="text"
					name="text"
					id="text"
					className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-1.5"
					placeholder="Transaction id or url"
				/>
				<div>
					<Button onClick={handleImportTransaction} loading={loading}>
						<div className="h-4 w-4 mr-2">
							<PlusIcon />
						</div>
						Transaction
					</Button>
				</div>
			</div>
			<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
				{importing ? (
					<ImportTransactions
						transactions={transactions}
						account={account}
						friendAddress={friendAddress}
						group={group}
					/>
				) : (
					<TransactionLog
						transactions={transactions}
						account={account}
					/>
				)}
			</div>
		</section>
	);
};

export default Transactions;
