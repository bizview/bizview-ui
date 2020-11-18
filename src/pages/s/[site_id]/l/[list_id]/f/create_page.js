import React, { useContext, useEffect, useState } from "react";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { getList } from "../../../../../../service/list_service";
import { createPage } from "../../../../../../service/listitem_service";
import { PageContext } from "../../../../../../service/util_service";
import { Spin, Button, Select, Input, Form, message } from "antd";
import { getLayouts } from "../../../../../../service/site_service";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};


const PageForm = (props) => {
  const list = props.list;
  const [loading, setLoading] = useState(false);
  const [layouts, setLayouts] = useState([]);

  const back = () => {
    window.location.href = list.listUrl;
  };


  const handleSubmit = async (values) => {
    try {
      await createPage(list.staticName, values);
      message.success("保存成功");
      back();
    } catch (e) {
      message.error("保存失败," + e);
    }
  };

  useEffect(() => {
    async function fetch() {
      const layouts = await getLayouts();
      setLayouts(layouts);
      setLoading(false);
    }

    fetch().catch(e => {
      message.error(e.toString());
    });
  }, []);

  return (
    <Spin spinning={loading}>
      <Form layout="vertical" {...layout} onFinish={handleSubmit} grid={{}}>
        <Form.Item label={"名称"} name={"name"} rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label={"布局"} name={"layout"} rules={[{ required: true }]}>
          <Select>
            {
              layouts.map(v => (<Select.Option key={v.name} value={v.path}>{v.name}</Select.Option>))
            }
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <a onClick={back} style={{ marginLeft: "8px" }}>
            <Button type="primary">
              取消
            </Button>
          </a>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default function CreatePage() {
  const [list, setList] = useState({
    properties: {
      views: []
    }
  });
  const { siteInfo } = useContext(PageContext);
  useEffect(() => {
    const fetch = async () => {
      const list = await getList(siteInfo.listId);
      setList(list);
    };
    fetch().then();
  }, []);
  return <DefaultLayout>
    <div className={"table-toolbar"}>
      <div className="table-toolbar-title">{list.title} - 创建页面</div>
    </div>
    <div className={"ant-table-wrapper"}>
      <PageForm list={list}/>
    </div>
  </DefaultLayout>;
};