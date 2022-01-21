import { Menu, Switch, Transition } from "@headlessui/react";
import { DotsVerticalIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import classnames from "classnames";
import moment from "moment";
import React, { Fragment } from "react";
import TransactionLog from "./TransactionLog";

const TransactionLogList = ({ transactions, account }) => {
	return (
		<div>
			{transactions
				.sort((a, b) => b.createdAt - a.createdAt)
				.map((txn) => (
					<TransactionLog txn={txn} key={txn.id} account={account} />
				))}
		</div>
	);
};

export default TransactionLogList;
