import { formatTimeStr } from "antd/lib/statistic/utils";
import React from "react";
import { Transaction } from "../../contracts";
import { minimizeAddress } from "../../utils";
import classnames from "classnames";

// humanise datestring using intl
const humaniseDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US").format(date);
};

const Transactions = ({
	transactions,
	account,
}: {
	transactions: Transaction[];
	account: string;
}) => {
	return (
		<section aria-labelledby="notes-title">
			<h3 className="text-2xl font-bold">Transactions</h3>
			<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
				<div>
					{transactions.map((txn) => {
						const isDebited = txn.from.toLowerCase() === account;

						return (
							<div
								key={txn.id}
								className="mb-4 hover:bg-gray-100 p-4 rounded-md -mx-4"
							>
								<div className=" text-gray-400 text-xs">
									{humaniseDate(new Date(txn.createdAt))}
								</div>

								<div
									className={classnames(
										"text-lg font-medium",
										isDebited
											? "text-red-600"
											: "text-green-600"
									)}
								>
									{isDebited ? "- " : "+ "}{" "}
									{txn.amount.toPrecision(2)} ETH
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
