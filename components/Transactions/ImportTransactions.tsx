import { PlusIcon } from "@heroicons/react/outline";
import {
	CheckCircleIcon,
	CheckIcon,
	PlusCircleIcon,
} from "@heroicons/react/solid";
import classnames from "classnames";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import { TransactionLog } from "../../contracts";
import useTransactions from "../../hooks/useTransactions";
import { importTransactionLog } from "../../utils";

const ImportTransactions = ({
	account,
	friendAddress,
	transactions,
	group,
}) => {
	const { result, isLoading } = useTransactions(friendAddress);

	// state loading
	const [loading, setLoading] = React.useState(false);

	const handleImportTransaction = async (transaction: TransactionLog) => {
		try {
			setLoading(true);
			await importTransactionLog(transaction, group);
			toast.success("Transaction imported successfully");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{isLoading ? (
				<div className="flex items-center justify-center">
					<svg
						className={`animate-spin h-8 w-8`}
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
							stroke-width="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			) : (
				result
					.sort((a, b) => b.createdAt - a.createdAt)
					.map((txn) => {
						const isDebited = txn.from.toLowerCase() === account;
						const isImported = transactions.find(
							(transaction) => transaction.id === txn.txId
						);

						return (
							<div
								key={txn.txId}
								className="mb-4 hover:bg-gray-100 p-4 rounded-md -mx-4"
							>
								<div className=" text-gray-400 text-xs">
									{moment(new Date(txn.createdAt)).format(
										"DD MMM, YYYY"
									)}
								</div>

								<div
									className={classnames(
										"text-xl font-medium flex items-center justify-between",
										isDebited
											? "text-orange"
											: " text-green"
									)}
								>
									<div>
										{isDebited ? "- " : "+ "}
										{(Number(txn.amount) + txn.gas).toFixed(
											5
										)}
										ETH
									</div>
									{!isImported ? (
										<div
											onClick={() =>
												handleImportTransaction(txn)
											}
											className={`h-12 w-12 cursor-pointer rounded-full border-4 flex items-center justify-center ${
												isDebited
													? "bg-lightOrange"
													: "bg-lightGreen"
											} ${
												isDebited
													? "border-lightOrange"
													: " border-lightGreen"
											}`}
										>
											<PlusIcon className="h-6 w-6" />
										</div>
									) : (
										<div className="h-12 w-12 bg-blue-200 rounded-full text-blue-400 flex items-center justify-center">
											<CheckIcon className="h-8 w-8" />
										</div>
									)}
								</div>
								<div className="text-sm text-gray-400 space-x-4">
									<span>+{txn.amount.toFixed(5)} ETH</span>
								</div>
								<div className="text-sm text-gray-400 space-x-4">
									<span>+{txn.gas.toFixed(5)} ETH gas</span>
								</div>
								{!!txn.message?.length && (
									<div className="mt-1">{txn.message}</div>
								)}
							</div>
						);
					})
			)}
		</div>
	);
};

export default ImportTransactions;
