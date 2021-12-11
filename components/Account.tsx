import { useState } from "react";
import { useERC20Balances, useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import Address from "./Address";
import { getExplorer } from "../helpers/networks";
const styles = {
	account: {
		height: "42px",
		padding: "0 15px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "fit-content",
		borderRadius: "12px",
		backgroundColor: "rgb(244, 244, 244)",
		cursor: "pointer",
	},
	text: {
		color: "#21BF96",
	},
};

function Account() {
	const { authenticate, isAuthenticated, logout, account, chainId } =
		useMoralis();

	const { fetchERC20Balances } = useERC20Balances({
		address: "0xAD6561E9e306C923512B4ea7af902994BEbd99B8",
	});

	const [isModalVisible, setIsModalVisible] = useState(false);

	if (!isAuthenticated) {
		return (
			<div
				style={styles.account}
				onClick={() => authenticate({ signingMessage: "Hello World!" })}
			>
				<p style={styles.text}>Authenticate</p>
			</div>
		);
	}

	return (
		<>
			<div style={styles.account} onClick={() => setIsModalVisible(true)}>
				<p style={{ marginRight: "5px", ...styles.text }}>
					{getEllipsisTxt(account, 6)}
				</p>
				<Blockie currentWallet scale={3} />
			</div>
			<Modal
				visible={isModalVisible}
				footer={null}
				onCancel={() => setIsModalVisible(false)}
				bodyStyle={{
					padding: "15px",
					fontSize: "17px",
					fontWeight: 500,
				}}
				style={{ fontSize: "16px", fontWeight: 500 }}
				width="400px"
			>
				Account
				<Card
					style={{
						marginTop: "10px",
						borderRadius: "1rem",
					}}
					bodyStyle={{ padding: "15px" }}
				>
					<Address avatar="left" size={6} copyable />
					<div style={{ marginTop: "10px", padding: "0 10px" }}>
						<a
							href={`${getExplorer(chainId)}/address/${account}`}
							target="_blank"
							rel="noreferrer"
						>
							{/* <SelectOutlined style={{ marginRight: "5px" }} /> */}
							View on Explorer
						</a>
					</div>
				</Card>
				<Button
					size="large"
					type="primary"
					style={{
						width: "100%",
						marginTop: "10px",
						borderRadius: "0.5rem",
						fontSize: "16px",
						fontWeight: 500,
					}}
					onClick={() => {
						logout();
						setIsModalVisible(false);
					}}
				>
					Disconnect Wallet
				</Button>
			</Modal>
		</>
	);
}

export default Account;