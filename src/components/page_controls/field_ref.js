import React, { useEffect, useRef, useState } from "react";
import { Input, InputNumber, Form } from "antd";


function HtmlEditor(props) {
  const editorRef = useRef({});
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };
    setEditorLoaded(true);
  }, []);

  return props.value !== undefined && editorLoaded ? <CKEditor editor={ClassicEditor} {...props.config}
                                                               data={props.value} onChange={(event, editor) => {
    const data = editor.getData();
    props.onChange(data);
  }}/> : <div/>;
}

function DisplayField({ field, value }) {
  const fieldProps = JSON.parse(field.props);
  switch (fieldProps.type) {
    case "HTML":
      return <HtmlEditor config={{
        config: { toolbar: [] },
        disabled: "disabled"
      }} value={value}/>;
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
  const { fieldName, showLabel } = props;
  const { item } = props;
  const { fields } = item.list;
  const field = fields.find(f => f.name === fieldName);
  const value = item[fieldName];
  if (edit) {
    return <Form.Item name={field.name} initialValue={value === undefined ? "" : value}
                      label={showLabel && field.title}><EditField
      field={field}/></Form.Item>;
  } else {
    return <DisplayField field={field} value={value}/>;
  }
}