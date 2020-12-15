import React, { useContext } from "react";
import { getList } from "../../../../../service/list_service";
import DefaultLayout from "../../../../../components/default_layout/default_layout";
import ShareViewRoute from "../../../../../components/share_view/share_view";
import {
  createRoleAssignmentsByListId, deleteRoleAssignmentsByListId,
  getPermissionGroups,
  getRoleAssignmentsByListId
} from "../../../../../service/share_service";
import { PageContext } from "../../../../../service/util_service";


export default function ListShareView({ list, roleAssignments, permissions }) {
  const { siteInfo } = useContext(PageContext);
  const deleteShare = async (id) => {
    await deleteRoleAssignmentsByListId(siteInfo.siteId, siteInfo.listId, [id]);
  };
  const createRoleAssignments = async (assignments) => {
    await createRoleAssignmentsByListId(siteInfo.siteId, siteInfo.listId, assignments);
  };
  return <DefaultLayout>
    <ShareViewRoute title={list.title} roleAssignments={roleAssignments}
                    deleteShare={deleteShare}
                    createRoleAssignments={createRoleAssignments}
                    permissions={permissions}/>
  </DefaultLayout>;
};

ListShareView.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  const roleAssignments = await getRoleAssignmentsByListId(query.site_id, query.list_id, req.cookies.access_token);
  const permissions = await getPermissionGroups();
  return { list, roleAssignments, permissions };
};