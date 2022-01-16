import React from "react";
import moment from "moment";
import human from "human-time";
import Button from "../Button";

const RequestNotification = () => {
	return (
		<div className="button-gradient p-0.5 rounded-lg">
			<div className="bg-white rounded-md p-4 border-none">
				<div className="w-full flex justify-between items-center">
					<span className="text-gray-400">{human(new Date())}</span>
					<span className="cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</span>
				</div>
				<div className="flex items-end justify-between mt-4">
					<div className="mr-4">
						0xBhaisaab requested 0.05 ETH from you
					</div>
					<Button size="sm">Settle</Button>
				</div>
			</div>
		</div>
	);
};

export default RequestNotification;
