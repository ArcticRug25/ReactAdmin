import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

const { Item } = Form;

const AddForm = (props) => {
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => props.getForm(form), [form, props]);

  return (
    <Form form={form} {...formItemLayout}>
      <Item
        label="角色名称"
        name="roleName"
        initialValue=""
        rules={[{ required: true, message: "角色名称必须输入" }]}
      >
        <Input placeholder="请输入角色名称" />
      </Item>
    </Form>
  );
};

AddForm.propTypes = {
  getForm: PropTypes.func,
};

export default AddForm;
