import "../styles/global.less";
import React from "react";
import PageProvider from "../components/page_provider/page_provider";

// Wraps every page in a component
export default function App({ Component, pageProps }) {
  return <PageProvider><Component {...pageProps}/></PageProvider>;
};