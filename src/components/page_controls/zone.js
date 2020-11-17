import React from "react";
import { Button, Card, Drawer, Table, message, Row, Col } from "antd";
import { getControls } from "../../service/site_service";
import { uuid } from "../../service/util_service";

export class Zone extends React.PureComponent {
  state = { visible: false, editorTitle: "", elements: [] };
  showControls = async () => {
    this.setState({
      visible: true,
      editorTitle: "选择显示控件",
      editor: await this.getEditor()
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  componentDidMount() {
    this.fetch().catch((e) => {
      message.error("加载内容失败:" + e);
    });
  }

  async fetch() {

  }

  getEditor = async () => {
    const controls = await getControls();
    const columns = [{
      title: "名称",
      key: "name",
      render: (c) => (<a onClick={() => {
        this.addIn(c);
      }}>{c.name}</a>)
    }];
    return <Table columns={columns} dataSource={controls} rowKey={"path"} size="small" pagination={false}/>;
  };

  addIn = async (element) => {

  };


  render() {
    const { editor, editorTitle, elements } = this.state;
    if (this.props.edit) {
      return <div className={"zone"}>
        <Card
          extra={<div><Button type="primary" shape="circle" icon="plus" size={"small"} onClick={this.showControls}/>
          </div>}>
          {
            elements.map((e, i) => <Row key={i} gutter={8}><Col span={24}>{e}</Col></Row>)
          }
        </Card>
        <Drawer
          title={editorTitle}
          placement={"bottom"}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {editor}
        </Drawer>
      </div>;
    } else {
      return <div className={"zone"}>{
        elements.map((e, i) => <Row key={i} gutter={8}><Col span={24}>{e}</Col></Row>)
      }</div>;
    }
  }
}