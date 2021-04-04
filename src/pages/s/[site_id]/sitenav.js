import React, { useCallback, useContext, useEffect, useState } from "react";
import { getNavigator, setSiteNavigator } from "../../../service/site_service";
import { Form, Spin, Radio, Input, Button, Card, Tree, Modal, message } from "antd";
import { PageContext } from "../../../service/util_service";
import DefaultLayout from "../../../components/default_layout/default_layout";

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

class NavigatorTreeView extends React.Component {
  state = {
    defaultExpandedKeys: [],
    visible: false,
    loading: false
  };

  renderTreeNode(node, i, parent) {
    return (
      <TreeNode
        key={node.name}
        title={node.name}
        onSelect={() => {
          this.selectedIndex = i;
          this.selectedNode = node;
          this.selectedNodeParent = parent;
        }}>
        {node.children &&
        node.children.map((subNode, i) => {
          return this.renderTreeNode(subNode, i, node);
        })}
      </TreeNode>
    );
  }

  // noinspection DuplicatedCode
  delete = () => {
    this.setState({ loading: true });
    const nodes = this.props.value;
    if (this.selectedNodeParent) {
      this.selectedNodeParent.children.splice(this.selectedIndex, 1);
    } else {
      nodes.splice(this.selectedIndex, 1);
    }
    this.selectedNode = null;
    this.setState({ loading: false });
  };

  render() {
    const nodes = this.props.value;
    const { defaultExpandedKeys } = this.state;
    return (
      <Card
        extra={
          <div>
            <Button onClick={this.delete} style={{ marginRight: "5px" }} disabled={!this.selectedNode}>
              删除
            </Button>
            <Button onClick={this.createTreeNode}>创建</Button>
          </div>
        }>
        <CreateForm
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleInsertAddress}
        />
        {nodes.length > 0 && (
          <Tree defaultExpandedKeys={defaultExpandedKeys} onSelect={this.onSelect}>
            {nodes.map((node, i) => this.renderTreeNode(node, i))}
          </Tree>
        )}
      </Card>
    );
  }

  onSelect = (selectedKeys, info) => {
    if (info.selectedNodes.length > 0) {
      info.selectedNodes.forEach(node => {
        node.onSelect();
      });
    } else {
      this.selectedNode = null;
    }
    this.setState({ defaultExpandedKeys: selectedKeys });
  };

  createTreeNode = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleInsertAddress = (values) => {
    const node = { name: values.name, url: values.url, children: [] };
    const nodes = this.props.value;
    if (this.selectedNode) {
      this.selectedNode.children = [...(this.selectedNode.children || []), node];
    } else {
      nodes.push(node);
    }
    this.setState({ nodes, visible: false });
    this.props.onChange(nodes);
  };
}

export default function() {
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(false);
  const [navigator, setNavigator] = useState({
    links: []
  });
  const handleSubmit = async (values) => {
    navigator.links = values.links;
    navigator.siteMap = values.siteMap;
    await setSiteNavigator(navigator);
    message.success("保存成功!");
  };

  const fetchNavigator = useCallback(async (siteMap) => {
    const navigator = await getNavigator(siteInfo.siteId, 2, siteMap);
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