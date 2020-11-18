import React, { useState, useEffect, useContext } from "react";
import { Card, Spin, List, Switch } from "antd";
import DefaultLayout from "../../../components/default_layout/default_layout";
import { getFeatures, setEnable } from "../../../service/feature_service";
import { PageContext } from "../../../service/util_service";

export default function Feature() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let { siteInfo } = useContext(PageContext);

  const onChange = async (feature, v) => {
    feature.enabled = v;
    setLoading(true);
    await setEnable(siteInfo.siteId, feature.name, v);
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getFeatures(siteInfo.siteId);
      setData(data);
      setLoading(false);
    };

    fetch().then();
  }, [siteInfo]);

  return <DefaultLayout>
    <Card title="功能" bordered={false}>
      <Spin spinning={loading}>
        <List>
          {data.map(feature => (
            <List.Item
              key={feature.name}
              actions={[
                <Switch
                  onChange={v => {
                    onChange(feature, v).then();
                  }}
                  checked={feature.enabled}
                />
              ]}>
              <List.Item.Meta title={feature.name} description={feature.description}/>
            </List.Item>
          ))}
        </List>
      </Spin>
    </Card>
  </DefaultLayout>;
};