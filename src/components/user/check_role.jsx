import { PageContext } from "../../service/util_service";
import React, { useContext } from "react";


const recursivelyMapChildren = (children, addedProperties) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    return React.cloneElement(child, {
      ...child.props,
      ...addedProperties,
      children: recursivelyMapChildren(child.props.children, addedProperties)
    });
  });
};

export default function CheckRole(props) {
  const { roles } = props;
  let { user } = useContext(PageContext);
  const y = roles.find(r => user.rawPermissions.indexOf(r) >= 0);
  return y ? recursivelyMapChildren(props.children, props) : null;
}