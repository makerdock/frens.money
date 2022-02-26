import { Switch } from "@headlessui/react";
import React, { useState } from "react";
import TransactionLog from "./TransactionLog";

const TransactionLogList = ({ transactions, account }) => {
	const [skipped, setSkipped] = useState(true);

	return (
		<div>
			<div className="relative flex items-start my-2">
				<div className="flex items-center justify-center h-5 cursor-pointer">
					<label
						className="font-medium text-gray-700 cursor-pointer mr-2"
					>
						Show Skipped txn.
					</label>
					<Switch
						checked={skipped}
						onChange={setSkipped}
						className={`${skipped ? "bg-gray-800" : "bg-gray-400"}
						relative inline-flex flex-shrink-0 h-4 w-7 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
					>
						<span className="sr-only">Use setting</span>
						<span
						aria-hidden="true"
						className={`${skipped ? 'translate-x-3' : 'translate-x-0'}
							pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
						/>
					</Switch>
				</div>
			</div>
			{transactions
				.sort((a, b) => b.createdAt - a.createdAt)
				.filter((t) => (skipped ? !t.skipped : true))
				.map((txn) => (
					<TransactionLog txn={txn} key={txn.id} account={account} />
				))}
		</div>
	);
};

export default TransactionLogList;
