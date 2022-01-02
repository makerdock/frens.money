import React from "react";
import Members from "../components/Members";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div className="min-h-screen">
			<div className="h-154 bg-lightpurple">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex h-full bg-lightpurple space-x-4 items-center font-urbanist">
					<Members />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
