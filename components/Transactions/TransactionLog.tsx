import { Menu, Switch, Transition } from "@headlessui/react";
import { ChevronDownIcon, DotsVerticalIcon, ExternalLinkIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import { default as classnames, default as classNames } from "classnames";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import {
	deleteTransaction,
	hideTransaction,
} from "../../utils/firebaseQueries";
import Note from "./Note";

const TransactionLog = ({
	txn,
	account,
}: {
	txn: Transaction;
	account: string;
}) => {
	const isDebited = txn.from.toLowerCase() === account;

	const [expand, setExpand] = useState(false)

	const handleHide = async (hide: boolean) => {
		try {
			await hideTransaction(txn.id, hide);
			toast.success("Transaction hidden successfully");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};
	const handleDelete = async () => {
		try {
			await deleteTransaction(txn.id);
			toast.success("Transaction deleted successfully");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	return (
		<div key={txn.id} className="mb-4">
			<div
				key={txn.id}
				className="relative hover:shadow-md transition-all ease-in-out p-4 rounded-md -mx-4 group"
			>
				<div className=" text-gray-400 text-xs flex items-center justify-between">
					{moment(new Date(txn.createdAt)).format("DD MMM, YYYY")}
					<div className="space-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all ease-in-out">
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400"
							href={`https://etherscan.io/tx/${txn.id}`}
						>
							<ExternalLinkIcon className="h-6 w-6" />
						</a>
						<Menu as="div" className="relative inline-block text-left">
							<div>
								<Menu.Button className="">
									<DotsVerticalIcon className="h-6 w-6" />
								</Menu.Button>
							</div>

							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
									<Menu.Item>
										<div
											className={classNames(
												"cursor-pointer text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 rounded-t-md flex items-center justify-between w-full"
											)}
										>
											<span>Skip Tx</span>
											<Switch
												checked={!!txn.skipped}
												onChange={(e) => handleHide(e)}
												className={classNames(
													txn.skipped
														? "bg-indigo-600"
														: "bg-gray-200",
													"relative inline-flex flex-shrink-0 h-4 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												)}
											>
												<span className="sr-only">
													Use setting
												</span>
												<span
													aria-hidden="true"
													className={classNames(
														txn.skipped
															? "translate-x-4"
															: "translate-x-0",
														"pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
													)}
												/>
											</Switch>
										</div>
									</Menu.Item>
									<Menu.Item>
										<div
											onClick={() => handleDelete()}
											className={classNames(
												"cursor-pointer text-orange block px-4 py-2 text-sm hover:text-white hover:bg-orange rounded-b-md"
											)}
										>
											Delete
										</div>
									</Menu.Item>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				</div>

				<div
					className={classnames(
						"text-xl font-medium flex items-center",
						txn.skipped ? 'text-black' : isDebited ? "text-orange" : " text-green"
					)}
				>
					{txn.skipped ? '' : isDebited ? "- " : "+ "}{" "}
					{(txn.amount + txn.gas).toPrecision(3)} ETH
					{txn.skipped && (
						<div className="text-sm px-2 py-1 bg-gray-200 text-gray-500 rounded-md ml-4">
							Skipped
						</div>
					)}
				</div>

				<div className="mt-1 text-gray-500">
					<Note txn={txn} />
				</div>

				<div onClick={() => setExpand(!expand)} className="absolute right-3 opacity-0 cursor-pointer group-hover:opacity-100 bottom-4 bg-gray-200 px-2 py-1 rounded-md flex items-center justify-center transition-all ease-in-out">
					<ChevronDownIcon className={`w-6 h-6 transition-all ease-in-out duration-200 ${expand ? 'rotate-180' : ''}`} />
					<p className="transition-all ease-in-out">{expand ? "Collapse" : "Expand"}</p>
				</div>

			</div>
			<div className={`flex justify-between transition-all duration-200 ease-in-out rounded-b-md bg-gray-100 -mx-4 text-gray-400 ${expand ? "h-auto px-4 py-2" : "h-0 p-0"}`}>
				<p className={`flex items-center ${expand ? 'opacity-100' : 'opacity-0'}`}> <SwitchHorizontalIcon className="w-4 h-4 mr-1" /> Txn.Amount: <span className={`text-black`}>{txn.amount.toPrecision(3)} ETH</span></p>
				<p className={`flex items-center ${expand ? 'opacity-100' : 'opacity-0'}`}>
					<svg className="mr-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.1798 4.82L13.1898 4.81L10.7065 2.33333L9.99984 3.04L11.4065 4.44667C10.7798 4.68667 10.3332 5.29 10.3332 6C10.3332 6.92 11.0798 7.66667 11.9998 7.66667C12.2365 7.66667 12.4632 7.61667 12.6665 7.52667V12.3333C12.6665 12.7 12.3665 13 11.9998 13C11.6332 13 11.3332 12.7 11.3332 12.3333V9.33333C11.3332 8.59667 10.7365 8 9.99984 8H9.33317V3.33333C9.33317 2.59667 8.7365 2 7.99984 2H3.99984C3.26317 2 2.6665 2.59667 2.6665 3.33333V14H9.33317V9H10.3332V12.3333C10.3332 13.2533 11.0798 14 11.9998 14C12.9198 14 13.6665 13.2533 13.6665 12.3333V6C13.6665 5.54 13.4798 5.12333 13.1798 4.82ZM7.99984 6.66667H3.99984V3.33333H7.99984V6.66667ZM11.9998 6.66667C11.6332 6.66667 11.3332 6.36667 11.3332 6C11.3332 5.63333 11.6332 5.33333 11.9998 5.33333C12.3665 5.33333 12.6665 5.63333 12.6665 6C12.6665 6.36667 12.3665 6.66667 11.9998 6.66667Z" fill="#7E7E8F"/>
					</svg>
					Gas Fees: <span className={`text-black`}>{txn.gas.toPrecision(3)} ETH</span>
				</p>
			</div>
		</div>
	);
};

export default TransactionLog;
