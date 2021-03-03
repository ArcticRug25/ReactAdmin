import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";

const { Item } = Form,
  { Option } = Select;

const UserForm = (props) => {
  const [form] = Form.useForm(),
    { roles } = props;

  const [user, setUser] = useState(() => (props.user ? props.user : {}));

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => props.getForm(form), [form, props]);

  useEffect(() => {
    setTimeout(() => {
      setUser(props.user ? props.user : {});
      form.resetFields();
    }, 0);
  }, [form, props.user]);

  return (
    <Form form={form} {...formItemLayout}>
      <Item
        label="用户名"
        name="username"
        initialValue={user.username}
        rules={[
          { required: true, whitespace: true, message: "用户名必须输入" },
          { min: 4, message: "用户名至少4位" },
          { max: 12, message: "用户名最多12位" },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Item>
      {user._id ? null : (
        <Item
          label="密码"
          name="password"
          initialValue={user.password}
          rules={[
            { required: true, message: "密码必须输入" },
            { min: 6, message: "密码至少6位" },
            { max: 15, message: "密码最多15位" },
          ]}
        >
          <Input type="password" placeholder="请输入密码" />
        </Item>
      )}
      <Item
        label="手机号"
        name="phone"
        initialValue={user.phone}
        rules={[{ required: true, message: "手机号必须输入" }]}
      >
        <Input placeholder="请输入手机号" />
      </Item>
      <Item
        label="邮箱"
        name="email"
        initialValue={user.email}
        rules={[{ required: true, message: "邮箱必须输入" }]}
      >
        <Input placeholder="请输入邮箱" />
      </Item>
      <Item
        label="角色"
        name="role_id"
        initialValue={user.role_id}
        rules={[{ required: true, message: "角色必须选择" }]}
      >
        <Select placeholder="请选择角色">
          {roles.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Item>
    </Form>
  );
};

UserForm.propTypes = {
  getForm: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  user: PropTypes.object,
};

export default UserForm;
