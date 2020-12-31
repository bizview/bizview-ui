import React, { useEffect, useState } from "react";
import DefaultLayout from "../../../../../components/default_layout/default_layout";
import { getList, saveList } from "../../../../../service/list_service";
import {
  Space,
  Button,
  Table,
  Card,
  Divider,
  Form,
  Input,
  Select,
  InputNumber,
  Transfer,
  message,
  Checkbox
} from "antd";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};

function SortableList({ keys, onItemSelect, selectedKeys, onChange }) {
  const [filteredItems, setFilteredItems] = useState(keys);

  useEffect(() => {
    if (filteredItems !== keys) {
      setFilteredItems(keys);
    }
  }, [keys]);

  function onItemChange(key, e) {
    onItemSelect(key, e.target.checked);
  }

  const SortableItemWrap = SortableElement(({ value }) =>
    <li className={"ant-transfer-list-content-item"}><Checkbox onChange={(e) => {
      onItemChange(value.key, e);
    }} checked={selectedKeys.indexOf(value.key) >= 0}>{value.title}</Checkbox></li>);

  const SortableContainerWrap = SortableContainer(({ children }) => {
    return <ul className={"ant-transfer-list-content"}>{children}</ul>;
  });

  const onSortEnd = (items, { oldIndex, newIndex }) => {
    const sortedItems = arrayMove(items, oldIndex, newIndex);
    onChange(sortedItems.map(i => i.key));
  };

  return <SortableContainerWrap onSortEnd={(pos) => {
    onSortEnd(filteredItems, pos);
  }}>
    {
      filteredItems.map((field, i) => {
        return <SortableItemWrap key={field.key} index={i} value={field}/>;
      })
    }
  </SortableContainerWrap>;
}

function FieldSelector({ list, value, onChange }) {
  const [targetKeys, setTargetKeys] = useState(value);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    if (targetKeys !== value) {
      setTargetKeys(value);
    }
  }, [value]);

  const onTransferChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    onChange(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return <Transfer
    dataSource={list.fields.map(f => ({ key: f.name, title: f.title }))}
    titles={["列表", "视图"]}
    targetKeys={targetKeys}
    selectedKeys={selectedKeys}
    listStyle={{
      width: 300,
      height: 500
    }}
    onChange={onTransferChange}
    onSelectChange={onSelectChange}
    render={item => item.title}
  >
    {({
        direction, filteredItems, selectedKeys, onItemSelectAll,
        onItemSelect
      }) => {
      if (direction === "right") {
        return <SortableList keys={filteredItems} selectedKeys={selectedKeys} onItemSelectAll={onItemSelectAll}
                             onItemSelect={onItemSelect} onChange={onChange}/>;
      }
    }}
  </Transfer>;
}

/**
 * 视图表单
 * @constructor
 */
function ViewForm({ list, name }) {
  console.log(list);
  const view = name === undefined ? {
    filter: {}
  } : list.properties.views.find(o => o.name === name);
  const [loading, setLoading] = useState(false);
  return <DefaultLayout>
    <Card title={`${list.title} 视图 ${view.title} 编辑`}>
      <Form onFinish={async (values) => {
        if (list.properties.views.find(o => o.name === name)) {
          list.properties.views.splice(list.properties.views.indexOf(o => o.name === name), 1);
        }
        if (values.defaultView) {
          list.properties.defaultView = values.name;
        }
        list.properties.views.push({
          ...values,
          filter: {
            ...values
          }
        });
        await saveList(list);
        message.success("保存成功!");
        setLoading(false);
        window.location.href = "#/";
      }} {...layout} initialValues={{
        ...view,
        ...view.filter,
        defaultView: list.properties.defaultView === view.name
      }}>
        <Form.Item name={"name"} label={"名称"}>
          <Input disabled={name !== undefined}/>
        </Form.Item>
        <Form.Item name={"title"} label={"标题"}>
          <Input/>
        </Form.Item>
        <Form.Item name={"defaultView"} label={"默认视图"} valuePropName={"checked"}>
          <Checkbox/>
        </Form.Item>
        <Form.Item name={"path"} label={"模板"}>
          <Select>
            <Select.Option value={"default_view"}>默认视图</Select.Option>
            <Select.Option value={"document_view"}>文档视图</Select.Option>
            <Select.Option value={"page_view"}>网页视图</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={"orderBy"} label={"排序"}>
          <Input/>
        </Form.Item>
        <Form.Item name={"limit"} label={"每页显示数"}>
          <InputNumber/>
        </Form.Item>
        <Form.Item name={"where"} label={"过滤条件"}>
          <Input/>
        </Form.Item>
        <Form.Item name={"fields"} label={"显示字段"}>
          <FieldSelector list={list} view={view}/>
        </Form.Item>
        <Form.Item  {...tailLayout}>
          <Button style={{ marginRight: "5px" }} htmlType="submit" loading={loading}>保存</Button>
          <a href={"#/"}><Button>返回</Button></a>
        </Form.Item>
      </Form>
    </Card>
  </DefaultLayout>;
}


async function deleteView(list, name) {
  if (list.properties.views.find(o => o.name === name)) {
    list.properties.views.splice(list.properties.views.indexOf(o => o.name === name), 1);
  }
  await saveList(list);
  message.success("删除成功!");
}

function ViewList({ list }) {
  const columns = [
    {
      title: "名称",
      key: "name",
      dataIndex: "name"
    },
    {
      title: "显示名",
      key: "title",
      dataIndex: "title"
    },
    {
      title: "操作",
      key: "op",
      render: (item) => (
        <Space><a href={`#/edit/${item.name}`}>编辑</a><Divider type="vertical"/><Button type={"link"}
                                                                                       onClick={() => {
                                                                                         deleteView(list, item.name).then();
                                                                                       }}>删除</Button></Space>)
    }
  ];
  return <DefaultLayout>
    <Card title={`${list.title} 视图管理`} extra={<a href={"#/new"}>新建</a>}>
      <Table columns={columns} dataSource={list.properties.views} rowKey={"name"}/>
    </Card>
  </DefaultLayout>;
};


export default function ViewListRoute(props) {
  return <Router>
    <Switch>
      <Route exact path="/" render={(routeProps) => {
        return <ViewList {...props} {...routeProps}/>;
      }}>
      </Route>
      <Route path="/:type" exact render={(routeProps) => {
        return <ViewForm history={routeProps.history} {...props}/>;
      }}/>
      <Route path="/:type/:name" render={(routeProps) => {
        return <ViewForm history={routeProps.history} name={routeProps.match.params.name} {...props}/>;
      }}/>
    </Switch>
  </Router>;
}

ViewListRoute.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  return { list };
};