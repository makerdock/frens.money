import React from "react";
import Members from "../components/Members";
import Image from "next/image";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div>
			<div className="max-w-3xl bg-dark-gray rounded-t-3xl my-0 mx-auto py-12 pb-0">
                <div className="w-full rounded-t-3xl bg-dark-gray p-12">
                    <div className="text-xl text-white font-medium mb-6">Overall, You are Owed <span className="text-sea-green text-2xl ml-2">+ 0.5712 Eth</span></div>
                    <div className="w-full p-3 inline-flex justify-between items-center bg-light-gray rounded-lg">
                        <span className="text-l text-white font-medium">You owe <span className="text-xl font-bold">0.2512 Eth</span> </span>
                        <p className="h-max border-r-2 border-white border-solid"></p>
                        <span className="text-l text-white font-medium">You are owed <span className="text-xl font-bold">0.2512 Eth</span> </span>
                    </div>
                </div>
                <div className="w-full rounded-t-3xl bg-white p-12">
                    <h4 className="text-2xl font-bold">Add Fren</h4>
                    <h4 className="text-2xl font-bold">Existing Frens</h4>
                    <div className="rounded-lg border-solid border-2 border-dark-gray p-6 flex justify-between items-center">
                        <div className="inline-flex justify-center items-center">
                            <div>
                                <Image src={"/../assets/Wallet.svg"} width={32} height={32}/>
                            </div>
                            <h6 className="text-2xl font-bold mb-0">0xAbhishekKumar</h6>
                        </div>
                        <div className="text-base font-medium text-sea-green">+ 0.005 ETH</div>
                    </div>
                </div>
			</div>
		</div>
	);
};

export default Dashboard;
