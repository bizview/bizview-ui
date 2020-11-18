import React from "react";
import { Button } from "antd";
import { CheckOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";

const buttonStyle = {
  marginRight: "5px"
};

export default function ItemViewMenu(props) {
  return <div style={{ display: "flex" }}
              className={"pageContainerToolbar"}>
    {
      props.edit ?
        <Button style={buttonStyle} icon={<CheckOutlined/>} onClick={props.onSave} size={"small"}>保存</Button> :
        <Button style={buttonStyle} icon={<EditOutlined/>} onClick={props.onEdit} size={"small"}>编辑</Button>
    }
    <Button style={buttonStyle} icon={<EditOutlined/>} onClick={props.onEdit} size={"small"}>返回</Button>
  </div>;
}