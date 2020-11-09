import React, { useContext, useEffect, useState } from "react";
import { getThemes, setTheme } from "../service/site_service";
import { Button, Card, List, Spin, message } from "antd";
import { PageContext } from "../service/util_service";
import DefaultLayout from "../components/default_layout/default_layout";

const location = typeof window !== "undefined" ? window.location : {};
export default function() {
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  const { siteInfo } = useContext(PageContext);

  useEffect(() => {
    async function fetch() {
      const themes = await getThemes();
      setThemes(themes);
      setLoading(false);
    }

    fetch().then();
  }, []);

  const onThemeChange = async name => {
    setLoading(true);
    await setTheme(siteInfo.siteId, name);
    setLoading(false);
    message.success("激活成功!");
    location.reload();
  };

  return <DefaultLayout>
    <Card title="主题" bordered={false}>
      <Spin spinning={loading}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 6,
            xl: 6,
            xxl: 6
          }}
          dataSource={themes}
          renderItem={theme => (
            <List.Item key={theme.name}>
              <Card
                title={theme.title}
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      onThemeChange(theme.name).then();
                    }}>
                    {siteInfo.theme === theme.name ? "停止" : "启用"}
                  </Button>
                }/>
            </List.Item>
          )}/>
      </Spin>
    </Card>
  </DefaultLayout>;
};