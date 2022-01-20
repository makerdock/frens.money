import { DotsVerticalIcon, ExternalLinkIcon } from "@heroicons/react/solid";
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
							className="mb-4 hover:bg-gray-100 p-4 rounded-md -mx-4 group"
						>
							<div className=" text-gray-400 text-xs flex items-center justify-between">
								{moment(new Date(txn.createdAt)).format(
									"DD MMM, YYYY"
								)}
								<div className="space-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all ease-in-out">
									<a
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-400"
										href={`https://etherscan.io/tx/${txn.id}`}
									>
										<ExternalLinkIcon className="h-6 w-6" />
									</a>
									<DotsVerticalIcon className="h-6 w-6" />
								</div>
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
