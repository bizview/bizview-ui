import React, { useCallback, useContext, useEffect, useState } from "react";
import { getNavigator, setSiteNavigator } from "../../../service/site_service";
import { Form, Spin, Radio, Input, Button, Card, Tree, Modal, message } from "antd";
import DefaultLayout from "../../../components/default_layout/default_layout";
import { PageContext } from "../../../service/util_service";

const { TreeNode } = Tree;
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};

function CreateForm(props) {
  const [form] = Form.useForm();
  const { visible, onCancel, onCreate, onFinish } = props;
  return <Modal visible={visible} title="输入地址" okText="添加" onCancel={onCancel} onOk={() => {
    form
      .validateFields()
      .then(values => {
        onCreate(values);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  }}>
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="名称" name={"name"} rules={[{ required: true, message: "Please input the title" }]}>
        <Input/>
      </Form.Item>
      <Form.Item label="链接" name={"url"}><Input/></Form.Item>
    </Form>
  </Modal>;
}

let selectedIndex;
let selectedNode;
let selectedNodeParent;

function NavigatorTreeView(props) {
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [nodes, setNodes] = useState(props.value);

  function renderTreeNode(node, i, parent) {
    return (
      <TreeNode
        key={node.name}
        title={node.name}
        onSelect={() => {
          selectedIndex = i;
          selectedNode = node;
          selectedNodeParent = parent;
        }}>
        {node.children &&
        node.children.map((subNode, i) => {
          return renderTreeNode(subNode, i, node);
        })}
      </TreeNode>
    );
  }

  const deleteNode = () => {
    const nodes = props.value;
    if (selectedNodeParent) {
      selectedNodeParent.children.splice(selectedIndex, 1);
    } else {
      nodes.splice(selectedIndex, 1);
    }
    selectedNode = null;
  };

  const onSelect = (selectedKeys, info) => {
    if (info.selectedNodes.length > 0) {
      info.selectedNodes.forEach(node => {
        node.onSelect();
      });
    } else {
      selectedNode = null;
    }
    setDefaultExpandedKeys(selectedKeys);
  };

  const createTreeNode = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleInsertAddress = (values) => {
    const node = { name: values.name, url: values.url, children: [] };
    if (selectedNode) {
      selectedNode.children = [...(selectedNode.children || []), node];
    } else {
      nodes.push(node);
    }
    setNodes(nodes);
    setVisible(false);
    props.onChange(nodes);
  };

  return (
    <Card
      extra={
        <div>
          <Button onClick={deleteNode} style={{ marginRight: "5px" }} disabled={!selectedNode}>
            删除
          </Button>
          <Button onClick={createTreeNode}>创建</Button>
        </div>
      }>
      <CreateForm
        visible={visible}
        onCancel={handleCancel}
        onCreate={handleInsertAddress}
      />
      {nodes.length > 0 && (
        <Tree defaultExpandedKeys={defaultExpandedKeys} onSelect={onSelect}>
          {nodes.map((node, i) => renderTreeNode(node, i))}
        </Tree>
      )}
    </Card>
  );
}

export default function() {
  const [loading, setLoading] = useState(false);
  const [navigator, setNavigator] = useState({
    links: []
  });
  const { siteInfo } = useContext(PageContext);

  const handleSubmit = async (values) => {
    navigator.links = values.links;
    navigator.siteMap = values.siteMap;
    await setSiteNavigator(navigator);
    message.success("保存成功!");
  };

  const fetchNavigator = useCallback(async (siteMap) => {
    const navigator = await getNavigator(siteInfo.siteId, 1, siteMap);
    setNavigator(navigator);
    setLoading(false);
  }, [siteInfo]);

  const { siteMap, links } = navigator;


  useEffect(() => {
    fetchNavigator().then();
  }, [fetchNavigator]);
  return <DefaultLayout>
    <Spin spinning={loading}>
      {navigator && (
        <Form {...layout} onFinish={handleSubmit} initialValues={{
          links
        }}>
          <Form.Item label="导航类型" name={"siteMap"} rules={[{ required: true }]}>
            <Radio.Group
              onChange={async e => {
                await fetchNavigator(e.target.value);
              }}>
              <Radio.Button value="TOP_SITE">顶级导航</Radio.Button>
              <Radio.Button value="SITE">当前站点</Radio.Button>
              <Radio.Button value="CUSTOM">自定义</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {siteMap === "CUSTOM" && (
            <Form.Item label="导航" name={"links"}>
              <NavigatorTreeView/>
            </Form.Item>
          )}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              保存
            </Button>
          </Form.Item>
        </Form>
      )}
    </Spin>
  </DefaultLayout>;
};