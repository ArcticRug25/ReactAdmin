/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";

const Item = Form.Item,
  Option = Select.Option;

export default class AddForm extends Component {
  static propTypes = {
    category: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    getForm: PropTypes.func.isRequired,
  };

  formRef = React.createRef();

  componentDidMount() {
    this.props.getForm(this.formRef.current);
  }
  componentDidUpdate() {
    this.formRef.current.setFieldsValue({
      categorySelect: this.props.parentId,
    });
  }

  render() {
    const { category, parentId } = this.props;

    return (
      <Form ref={this.formRef}>
        <Item name="categorySelect" initialValue={parentId}>
          <Select>
            <Option value="0">一级分类</Option>
            {category.map((item, index) => (
              <Option key={index + 1} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          name="categoryName"
          initialValue=""
          rules={[
            { required: true, whitespace: true, message: "分类名称必须输入" },
          ]}
        >
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>
    );
  }
}
