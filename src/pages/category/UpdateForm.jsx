/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

const Item = Form.Item;

export default function Update(props) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    props.getForm(form);
    form.setFieldsValue({categoryName:props.curCategory.name})
  },[form, props]);

  return (
    <Form form={form}>
      <Item
        name="categoryName"
        initialValue={props.curCategory.name}
        rules={[
          { required: true, whitespace: true, message: "分类名称必须输入" },
        ]}
      >
        <Input placeholder="请输入分类名称" />
      </Item>
    </Form>
  );
}

Update.propTypes = {
  curCategory: PropTypes.object.isRequired,
  getForm: PropTypes.func.isRequired,
};
