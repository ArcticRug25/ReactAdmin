import React, { useState, useEffect, useRef } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";
import storageUtils from "../../utils/storageUtils";

export default function Role({ history }) {
  const [roles, setRoles] = useState(),
    [loading, setLoading] = useState(false),
    [status, setStatus] = useState(0),
    [role, setRole] = useState({});

  const authForm = useRef();

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
      render: formateDate,
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
      render: formateDate,
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
    if (status === 2) {
      let a = { ...role };
      setRole(a);
    }
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

  const updateRole = async () => {
    setStatus(0);
    const menus = authForm.current.props.checkedKeys;
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = memoryUtils.user.username;
    const updateRoleRes = await reqUpdateRole(role);
    if (updateRoleRes.status === 0) {
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {};
        storageUtils.removeUser();
        history.replace("/login");
        message.info("角色权限已变更，请重新登录");
      } else {
        getRoles();
        message.success("设置角色权限成功");
      }
    } else {
      message.error("设置角色权限失败");
    }
  };

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
        rowSelection={{
          type: "radio",
          selectedRowKeys: [role._id],
          onSelect: (role) => setRole(role),
        }}
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
        <AuthForm ref={authForm} role={role} />
      </Modal>
    </Card>
  );
}
