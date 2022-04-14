import "antd/dist/antd.css";
import Head from "next/head";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import "tailwindcss/tailwind.css";
import Account from "../components/Account";
import Logo from "../components/Logo";
import MetaHead from "../components/MetaHead";
import Notification from "../components/Notification";
import "./globals.css";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const GTag = "G-4HENSLHDZS";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const hideNavbar = pageProps.hideNavbar;


	return (
		<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
			{/* <NextNProgress height={7} color="#9366F9" /> */}
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

				{process.env.NODE_ENV === "production" &&
					typeof window !== "undefined" && (
						<>
							<script
								async
								type="text/javascript"
								src={`https://www.googletagmanager.com/gtag/js?id=${GTag}`}
							/>
							{/* <!-- Google Tag Manager --> */}
							<script
								dangerouslySetInnerHTML={{
									__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','GTM-PWX4GJW');`,
								}}
							/>
							{/* <!-- End Google Tag Manager --> */}
							<script
								dangerouslySetInnerHTML={{
									__html: `
										window.dataLayer = window.dataLayer || [];
										function gtag(){dataLayer.push(arguments);}
										gtag('js', new Date());
										gtag('config', '${GTag}', { page_path: window.location.pathname });
										`,
								}}
							/>
						</>
					)}
			</Head>

			{!hideNavbar && (
				<header>
					<div className="container xs:px-0">
						<div className="flex items-center justify-between py-5">
							<div className="flex px-2 lg:px-0">
								<div className="flex-shrink-0 flex items-center">
									<Link href="/">
										<div className="inline-flex items-center cursor-pointer">
											<Logo />
											<h1 className="text-2xl xs:text-sm ml-2 font-bold m-0 flex items-center">
												Frens.money
												<span className="text-xs xs:hidden ml-2 bg-gray-200 text-gray-500 font-light rounded-md px-2 py-1">
													Beta
												</span>
											</h1>
										</div>
									</Link>
								</div>
							</div>
							<div className="flex space-x-6 sm:space-x-0 items-center">
								<Notification />
								{/* <Chains /> */}
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
