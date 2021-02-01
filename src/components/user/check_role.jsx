import { PageContext } from "../../service/util_service";
import { useContext } from "react";

export default function CheckRole({ roles, children }) {
  let { user } = useContext(PageContext);
  const y = user.rawPermissions.every(p => roles.find(r => p === r));
  return y && <>
    {children}
  </>;
}