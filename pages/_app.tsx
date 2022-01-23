import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import "tailwindcss/tailwind.css";
import "./globals.css";
import Account from "../components/Account";
import Chains from "../components/Chains";
import Logo from "../components/Logo";

import NextNProgress from "nextjs-progressbar";
import MetaHead from "../components/MetaHead";
import "antd/dist/antd.css";
import dynamic from "next/dynamic";
import Button from "../components/Button";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const hideNavbar = pageProps.hideNavbar;
	return (
		<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
			<NextNProgress height={7} color="#9366F9" />
			<MetaHead />
			<Head key="main-head">
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Space+Grotesk:wght@300;400;500;700&display=swap"
					rel="stylesheet"
				/>
			</Head>

			{!hideNavbar && (
				<header>
					<div className="container lg:px-8">
						<div className="flex items-center justify-between py-5">
							<div className="flex px-2 lg:px-0">
								<div className="flex-shrink-0 flex items-center">
									<Link href="/">
										<div className="inline-flex items-center">
											<Logo />
											<h1 className="text-2xl ml-2 font-bold m-0 flex items-center">
												Cryptowise
												<span className="text-xs ml-2 bg-gray-200 text-gray-500 font-light rounded-md px-2 py-1">
													Beta
												</span>
											</h1>
										</div>
									</Link>
								</div>
							</div>
							<div className="flex space-x-6 items-center">
								<Chains />
								<Account />
							</div>
						</div>
					</div>
				</header>
			)}

			<div className="yellow-blur"></div>
			<div className="pink-blur"></div>

			<Component {...pageProps} />
			<ToastContainer />
			<ReactTooltip effect="solid" />
		</MoralisProvider>
	);
}

export default MyApp;
