import React from "react";
import Members from "../components/Members";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div className="max-h-screen flex justify-center items-center">
			<div className="max-w-7xl flex max-h-screen space-x-4 justify-center items-center font-urbanist py-12 pb-0">
				<Members />
			</div>
		</div>
	);
};

export default Dashboard;

export const getStaticProps = async () => {
	return { props: { hideNavbar: true } };
};
