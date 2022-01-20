import classnames from "classnames";
import moment from "moment";
import React from "react";

const TransactionLog = ({ transactions, account }) => {
	return (
		<div>
			{transactions
				.sort((a, b) => b.createdAt - a.createdAt)
				.map((txn) => {
					const isDebited = txn.from.toLowerCase() === account;

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
									isDebited ? "text-orange" : " text-green"
								)}
							>
								{isDebited ? "- " : "+ "}{" "}
								{txn.amount.toPrecision(2)} ETH
							</div>

							<div className="mt-1 text-gray-500">
								{!!txn.message ? txn.message : "Add Note"}
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default TransactionLog;
