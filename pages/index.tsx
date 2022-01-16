import React from "react";
import Members from "../components/Members";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div className="max-h-screen">
			<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex max-h-screen space-x-4 items-center font-urbanist py-12 pb-0">
				<Members />
			</div>
		</div>
	);
};

export default Dashboard;
