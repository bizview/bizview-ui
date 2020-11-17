import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../service/util_service";
import dynamic from "next/dynamic";
import { filter } from "rxjs/operators";
import { MessageType } from "../../domain/component_message";
import { Divider } from "antd";

export default function MenuBar() {
  const { eventBus } = useContext(PageContext);
  const [component, setComponent] = useState(null);
  const [componentProps, setComponentProps] = useState({});
  const DynamicComponent = dynamic(() => import(`./${component}`));
  useEffect(() => {
    eventBus.pipe(filter(m => m.type === MessageType.menu)).subscribe(({ message }) => {
      setComponent(message.component);
      setComponentProps(message);
    });
  }, []);
  return DynamicComponent && <>
    <DynamicComponent {...componentProps}/>
    <Divider type="vertical"/>
  </>;
}