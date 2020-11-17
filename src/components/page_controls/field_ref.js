import React, { useEffect } from "react";
import { Input, InputNumber, Form } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function HtmlEditor(props) {
  return props.value !== undefined ? <CKEditor editor={ClassicEditor}
                                               data={props.value} onChange={(event, editor) => {
    const data = editor.getData();
    props.onChange(data);
  }}/> : <div/>;
}

function DisplayField({ field, value }) {
  const fieldProps = JSON.parse(field.props);
  switch (fieldProps.type) {
    case "HTML":
      return <CKEditor config={{ toolbar: [] }} disabled editor={ClassicEditor} data={value}/>;
    case "Text":
    default:
      return value ? <span>{value}</span> : <div/>;
  }
}

function EditField(props) {
  const { field } = props;
  const fieldProps = JSON.parse(field.props);
  switch (fieldProps.type) {
    case "TEXT":
      return <Input {...props}/>;
    case "NUMBER":
      return <InputNumber {...props}/>;
    case "HTML":
      return <HtmlEditor {...props}/>;
    default:
      return <Input {...props}/>;
  }
}

export default function FieldRef(props) {
  const edit = props.edit;
  const { fieldName } = props;
  const { item } = props;
  const { fields } = item.list;
  const field = fields.find(f => f.name === fieldName);
  const value = item[fieldName];
  if (edit) {
    return <Form.Item name={field.name} initialValue={value === undefined ? "" : value}><EditField
      field={field}/></Form.Item>;
  } else {
    return <DisplayField field={field} value={value}/>;
  }
}