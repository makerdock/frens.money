import React from "react";
import Members from "../components/Members";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div className="max-h-screen">
			<div className="max-w-3xl flex justify-center items-center max-h-screen space-x-4 bg-white my-0 mx-auto py-12 pb-0">
                <div className="w-full rounded-t-3xl flex justify-center items-center space-x-4 bg-dark-black py-12">
                    <span className="text-2xl text-white font-medium">Overall, You are Owed</span>
                </div>
			</div>
		</div>
	);
};

export default Dashboard;
