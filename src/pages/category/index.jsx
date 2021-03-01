/* eslint-disable no-undef */
import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { reqCategorys, reqUpdateCategorys, reqAddCategorys } from "../../api";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";

export default class Category extends Component {
  state = {
    category: [],
    subCategory: [],
    loading: false,
    parentId: "0",
    parentName: "",
    curCategory: {},
    showStatus: 0,
  };

  initColumns = () => {
    this.columns = [
      { title: "分类的名称", dataIndex: "name" },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategory(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  showSubCategory = ({ _id, name }) => {
    this.setState(
      {
        parentId: _id,
        parentName: name,
      },
      () => this.getCategory()
    );
  };

  showUpdate = (category) => {
    this.setState({ showStatus: 2, curCategory: category });
  };

  showCategory = () => {
    this.setState({
      subCategory: [],
      parentId: "0",
      parentName: "",
    });
  };

  handleCancel = () => {
    this.form.resetFields();
    this.setState({ showStatus: 0 });
  };

  addCategory = async () => {
    try {
      const { categorySelect, categoryName } = await this.form.validateFields();
      this.handleCancel();
      const reqRes = await reqAddCategorys(categoryName, categorySelect);
      if (reqRes.status === 0) {
        if (categorySelect === this.state.parentId) {
          this.getCategory();
        } else if (categorySelect === "0") {
          this.getCategory("0");
        }
      }
    } catch (error) {}
  };

  updateCategory = async () => {
    try {
      const res = await this.form.validateFields();
      this.handleCancel();
      const categoryId = this.state.curCategory._id;
      const reqRes = await reqUpdateCategorys(categoryId, res.categoryName);
      if (reqRes.status === 0) {
        this.getCategory();
      }
    } catch (err) {}
  };

  getCategory = async (id) => {
    this.setState({ loading: true });
    let parentId = id || this.state.parentId;
    console.log(parentId);
    const res = await reqCategorys(parentId);
    if (res.status === 0) {
      parentId === "0"
        ? this.setState((state) => (state.category = res.data))
        : this.setState((state) => (state.subCategory = res.data));
    } else {
      message.error("获取分类列表失败");
    }
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getCategory();
  }

  render() {
    const {
        category,
        loading,
        subCategory,
        parentId,
        parentName,
        curCategory,
        showStatus,
      } = this.state,
      title =
        parentId === "0" ? (
          "一级分类列表"
        ) : (
          <span>
            <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
            <ArrowRightOutlined style={{ marginRight: 5 }} />
            <span>{parentName}</span>
          </span>
        ),
      extra = (
        <Button type="primary" onClick={() => this.setState({ showStatus: 1 })}>
          <PlusOutlined />
          添加
        </Button>
      );

    this.initColumns();

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={parentId === "0" ? category : subCategory}
          columns={this.columns}
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true,
          }}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            category={category}
            parentId={parentId}
            getForm={(form) => (this.form = form)}
          />
        </Modal>

        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            curCategory={curCategory}
            getForm={(form) => (this.form = form)}
          />
        </Modal>
      </Card>
    );
  }
}
