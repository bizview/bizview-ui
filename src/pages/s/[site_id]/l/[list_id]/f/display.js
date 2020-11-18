import React, { useContext, useEffect, useState } from "react";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { Col, message, Row, Spin } from "antd";
import { getItem } from "../../../../../../service/listitem_service";
import queryString from "query-string";
import { PageContext } from "../../../../../../service/util_service";
import FieldRef from "../../../../../../components/page_controls/field_ref";
import { ComponentMessage, MessageType } from "../../../../../../domain/component_message";

export default function DisplayForm() {
  const itemId = queryString.parse(location.search).id;
  const { siteInfo, eventBus } = useContext(PageContext);
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    async function fetch() {
      const itemInfo = await getItem(siteInfo.listId, itemId);
      setItem(itemInfo);

      eventBus.next(new ComponentMessage(MessageType.menu, {
        edit: false,
        component: "item_view_menu",
        onEdit: () => {
          window.location.href = itemInfo.list.listUrl + `/f/${itemInfo.list.properties.forms.editForm}?id=${itemInfo.id}`;
        }
      }));

      setLoading(false);
    }

    fetch().catch((e) => {
      message.error(e + "");
    });
  }, []);
  return <DefaultLayout>
    <div className={"pageWrapperRead"}>
      {
        loading ? <Spin/> : item.list.fields.filter(f => f["fieldType"] !== "SYSTEM").map(f => {
          return <Row gutter={16} key={f.name}>
            <Col span={6}>
              <label>{f.title}</label>
            </Col>
            <Col span={18}>
              <FieldRef fieldName={f.name} item={item} edit={false}/>
            </Col>
          </Row>;
        })
      }
    </div>
  </DefaultLayout>;
}