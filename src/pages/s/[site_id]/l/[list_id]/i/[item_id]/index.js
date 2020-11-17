import DefaultLayout from "../../../../../../../components/default_layout/default_layout";
import React, { useContext, useEffect, useState } from "react";
import { getItem, updatePage } from "../../../../../../../service/listitem_service";
import { PageContext } from "../../../../../../../service/util_service";
import { Form, message, Spin } from "antd";
import * as queryString from "query-string";
// noinspection ES6CheckImport
import dynamic from "next/dynamic";
import { ComponentMessage, MessageType } from "../../../../../../../domain/component_message";
import { setWelcomePage } from "../../../../../../../service/site_service";


export default function Index() {
  let { siteInfo, eventBus } = useContext(PageContext);
  const [form] = Form.useForm();
  const edit = queryString.parse(location.search).edit === "true";
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const DynamicComponent = dynamic(() => import(`../../../../../../../components/page_layouts/${item.layout}`));

  useEffect(() => {
    const onSave = async (item) => {
      try {
        const values = await form.validateFields();
        await updatePage(siteInfo.listId, {
          item: {
            id: item.id,
            ...values
          },
          elements: []
        });
        message.success("保存成功");
        location.href = window.location.href.substr(0, location.href.lastIndexOf("?"));
      } catch (e) {
        message.error(e);
      }
    };

    const setWelcome = async () => {
      await setWelcomePage(window.location.pathname);
      message.success("设置成功");
    };

    const onEdit = () => {
      location.href += "?edit=true";
    };

    async function fetch() {
      const itemInfo = await getItem(siteInfo.listId, siteInfo.itemId);
      setItem(itemInfo);
      eventBus.next(new ComponentMessage(MessageType.menu, {
        edit,
        component: "page_menu",
        onSave: () => {
          onSave(itemInfo);
        },
        setWelcome,
        onEdit
      }));
      setLoading(false);
    }

    fetch().catch((e) => {
      message.error(e + "");
    });
  }, []);
  return <DefaultLayout>
    <Spin spinning={loading}>
      {
        !loading && (
          edit ? <Form form={form}>
            <DynamicComponent edit={edit} item={item}/>
          </Form> : <div className={"pageWrapperRead"}>
            <DynamicComponent edit={edit} item={item}/>
          </div>
        )
      }
    </Spin>
  </DefaultLayout>;
}