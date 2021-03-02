import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { reqRoles, reqAddRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";

export default function Role() {
  const [roles, setRoles] = useState(),
    [loading, setLoading] = useState(false),
    [status, setStatus] = useState(0),
    [role, setRole] = useState({});

  let formIns;

  const title = (
    <span>
      <Button type="primary" onClick={() => setStatus(1)}>
        创建角色
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        disabled={role._id ? false : true}
        onClick={() => setStatus(2)}
      >
        设置角色权限
      </Button>
    </span>
  );

  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
    },
    {
      title: "授权人",
      dataIndex: "auth_name",
    },
  ];

  const onRow = (role) => {
    return {
      onClick: () => {
        setRole(role);
      },
    };
  };

  const handleCancel = () => {
    setStatus(0);
  };

  const addRole = async () => {
    setStatus(0);
    try {
      const formRes = await formIns.validateFields();
      const addRoleRes = await reqAddRole(formRes.roleName);
      if (addRoleRes.status === 0) {
        message.success("添加角色成功");
        setRoles([...roles, addRoleRes.data]);
      } else {
        message.error("添加角色失败");
      }
    } catch (error) {}
    formIns.resetFields();
  };

  const updateRole = () => {};

  const getRoles = async () => {
    setLoading(true);
    const rolesRes = await reqRoles();
    setLoading(false);
    if (rolesRes.status === 0) {
      setRoles(rolesRes.data);
    }
  };

  useEffect(() => getRoles(), []);

  return (
    <Card title={title}>
      <Table
        bordered
        rowKey="_id"
        loading={loading}
        rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
        dataSource={roles}
        columns={columns}
        pagination={{ defaultPageSize: PAGE_SIZE }}
        onRow={onRow}
      />

      <Modal
        title="添加角色"
        visible={status === 1}
        onOk={addRole}
        onCancel={handleCancel}
      >
        <AddForm role={role} getForm={(form) => (formIns = form)} />
      </Modal>

      <Modal
        title="设置角色权限"
        visible={status === 2}
        onOk={updateRole}
        onCancel={handleCancel}
      >
        <AuthForm role={role} />
      </Modal>
    </Card>
  );
}
