import React, { useEffect, useState } from "react";
import { getPageState, PageContext } from "../../service/util_service";
import { Spin } from "antd";

export default function PageProvider(props) {
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState({});

  async function fetch() {
    setPageState(await getPageState());
    setLoading(false);
  }

  useEffect(() => {
    fetch().then();
  }, []);

  return loading ? <Spin spinning={loading}/> :
    <PageContext.Provider value={pageState}>{props.children}</PageContext.Provider>;
}