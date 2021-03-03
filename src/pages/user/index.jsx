/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/LinkButton";
import { PAGE_SIZE } from "../../utils/constants";
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import UserForm from "./UserForm";

export default function User() {
  let formIns;
  const [users, setUsers] = useState([]),
    [curUser, setCurUser] = useState(),
    [isShow, setIsShow] = useState(false),
    [roleNames, setRoleNames] = useState({}),
    [roles, setRoles] = useState([]);

  const title = (
    <Button type="primary" onClick={showAdd}>
      创建用户
    </Button>
  );

  const columuns = [
    { title: "用户名", dataIndex: "username" },
    { title: "邮箱", dataIndex: "email" },
    { title: "电话", dataIndex: "phone" },
    { title: "注册时间", dataIndex: "create_time", render: formateDate },
    {
      title: "所属角色",
      dataIndex: "role_id",
      render: (role_id) => {
        const role = roleNames[role_id];
        return role ? role : "无所属用户";
      },
    },
    {
      title: "操作",
      render: (user) => (
        <span>
          <LinkButton onClick={() => updateUser(user)}>修改</LinkButton>
          <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
        </span>
      ),
    },
  ];

  const updateUser = (user) => {
    setCurUser(user);
    setIsShow(true);
  };

  const addOrUpdate = async () => {
    try {
      const formRes = await formIns.validateFields();
      setIsShow(false);
      if (curUser) {
        formRes._id = curUser._id;
      }
      formIns.resetFields();
      const addUserRes = await reqAddOrUpdateUser(formRes);
      if (addUserRes.status === 0) {
        message.success(`${curUser ? "修改" : "添加"}用户成功！`);
        getUsers();
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsShow(false);
  };

  function showAdd() {
    setCurUser();
    setIsShow(true);
  }

  const getUsers = async () => {
    const usersRes = await reqUsers();
    if (usersRes.status === 0) {
      const { users, roles } = usersRes.data;
      ininRoleNames(roles);
      setRoles(roles);
      setUsers(users);
    }
  };

  const ininRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    setRoleNames(roleNames);
  };

  const deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const delUserRes = await reqDeleteUser(user._id);
        if (delUserRes.status === 0) {
          message.success("删除用户成功！");
          getUsers();
        }
      },
    });
  };

  useEffect(() => getUsers(), []);

  return (
    <Card title={title}>
      <Table
        rowKey="_id"
        bordered
        columns={columuns}
        dataSource={users}
        pagination={{ defaultPageSize: PAGE_SIZE }}
      />

      <Modal
        title={curUser ? "修改用户" : "添加用户"}
        visible={isShow}
        onOk={addOrUpdate}
        onCancel={handleCancel}
      >
        <UserForm
          getForm={(form) => (formIns = form)}
          roles={roles}
          user={curUser}
        />
      </Modal>
    </Card>
  );
}
