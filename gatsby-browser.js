import "./src/styles/global.less";
import React from "react";
import PageProvider from "./src/components/page_provider/page_provider";

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return <PageProvider {...props}>{element}</PageProvider>;
};