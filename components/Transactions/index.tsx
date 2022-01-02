import React from "react";
import { Transaction } from "../../contracts";
import { minimizeAddress } from "../../utils";

const Transactions = ({
	transactions,
	account,
}: {
	transactions: Transaction[];
	account: string;
}) => {
	console.log({ account });
	return (
		<section aria-labelledby="notes-title">
			<div className="bg-white mt-8 sm:rounded-lg sm:overflow-hidden">
				<div>
					{transactions.map((txn) => {
						const isDebited = txn.from.toLowerCase() === account;

						return (
							<div
								key={txn.id}
								className="mb-4 hover:bg-gray-100 p-4 rounded-md -mx-4"
							>
								<div className="flex items-center justify-between space-x-2">
									<div className="flex items-center space-x-2">
										<div>
											{minimizeAddress(txn.from, account)}
										</div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
										<div>
											{minimizeAddress(txn.to, account)}{" "}
										</div>
									</div>
									<a
										href={`https://etherscan/tx/${txn.id}`}
										target="_blank"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-blue-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</a>
								</div>
								<div
									className={`${
										isDebited
											? "text-red-600"
											: "text-green-600"
									}`}
								>
									{isDebited ? "- " : "+ "} {txn.amount} ETH
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
