import React from "react";
import { Row } from "antd";
import Col from "antd/es/grid/col";
import Divider from "antd/es/divider";
import FieldRef from "../page_controls/field_ref";
import { Zone } from "../page_controls/zone";

export default function DefaultPageLayout(props) {
  return <Row gutter={16}>
    <Col span={18}>
      <FieldRef fieldName={"title"} item={props.item} edit={props.edit}/>
      <Divider/>
      <FieldRef fieldName={"body"} item={props.item} edit={props.edit}/>
    </Col>
    <Col span={6}>
      <Zone id={"right-zone"}/>
    </Col>
  </Row>;
}