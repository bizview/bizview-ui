import React, { useContext } from "react";
import {
  getPermissionGroups,
  deleteRoleAssignments, createRoleAssignmentsBySiteId, getRoleAssignmentsBySiteId
} from "../../../service/share_service";
import { PageContext } from "../../../service/util_service";
import DefaultLayout from "../../../components/default_layout/default_layout";
import ShareViewRoute from "../../../components/share_view/share_view";

export default function ListShareView({ title, roleAssignments, permissions }) {
  const { siteInfo } = useContext(PageContext);
  const deleteShare = async (id) => {
    await deleteRoleAssignments(siteInfo.siteId, siteInfo.listId, [id]);
  };
  const createRoleAssignments = async (assignments) => {
    await createRoleAssignmentsBySiteId(siteInfo.siteId, assignments);
  };
  return <DefaultLayout>
    <ShareViewRoute title={"站点共享"} roleAssignments={roleAssignments}
                    deleteShare={deleteShare}
                    createRoleAssignments={createRoleAssignments}
                    permissions={permissions}/>
  </DefaultLayout>;
};

ListShareView.getInitialProps = async ({ query, req }) => {
  const roleAssignments = await getRoleAssignmentsBySiteId(query.site_id, req.cookies.access_token);
  const permissions = await getPermissionGroups();
  return { roleAssignments, permissions };
};