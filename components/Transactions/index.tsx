import { PlusIcon } from "@heroicons/react/outline";
import classnames from "classnames";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Group, Transaction } from "../../contracts";
import { importTransaction } from "../../utils";
import Button from "../Button";

// humanise datestring using intl
// const humaniseDate = (date: Date) => {
// 	return new Intl.DateTimeFormat("en-US").format(date);
// };

const Transactions = ({
	transactions,
	account,
	group,
}: {
	transactions: Transaction[];
	account: string;
	group: Group;
}) => {
	// state loading
	const [loading, setLoading] = useState(false);
	// transaction id state
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
			<h3 className="text-2xl font-bold">Transactions</h3>
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
				<div>
					{transactions
						.sort((a, b) => b.createdAt - a.createdAt)
						.map((txn) => {
							const isDebited =
								txn.from.toLowerCase() === account;

							return (
								<div
									key={txn.id}
									className="mb-4 hover:bg-gray-100 p-4 rounded-md -mx-4"
								>
									<div className=" text-gray-400 text-xs">
										{moment(new Date(txn.createdAt)).format(
											"DD MMM, YYYY"
										)}
									</div>

									<div
										className={classnames(
											"text-xl font-medium",
											isDebited
												? "text-orange"
												: " text-green"
										)}
									>
										{isDebited ? "- " : "+ "}{" "}
										{txn.amount.toPrecision(2)} ETH
									</div>
									{!!txn.message?.length && (
										<div className="mt-1">
											{txn.message}
										</div>
									)}

									<div className="mt-1 text-gray-500">
										{!!txn.message
											? txn.message
											: "Add Note"}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</section>
	);
};

export default Transactions;
