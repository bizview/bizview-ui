import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getItems } from "../../service/listitem_service";

export default function PageView({ list, view }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  console.log("aaa");
  // noinspection DuplicatedCode
  const columns = view.fields.map(n => {
    const field = list.fields.find(f => f.name === n);
    return {
      title: field.title,
      dataIndex: field.name,
      width: field.name === "id" ? 80 : 0,
      render: (prop, values) => {
        if (field.name === "name") {
          // noinspection JSUnresolvedVariable
          return <a href={values.itemUrl}>{prop}</a>;
        } else {
          return prop;
        }
      }
    };
  });
  useEffect(() => {
    const fetch = async () => {
      const items = await getItems(list["staticName"], view.filter);
      setItems(items);
      setLoading(false);
    };
    fetch().then();
  }, []);

  return <Table columns={columns} rowKey={"id"} dataSource={items}/>;
};