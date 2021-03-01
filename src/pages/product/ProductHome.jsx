/* eslint-disable no-undef */
import React, { Component } from "react";
import { Card, Select, Input, Button, Table, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";

const Option = Select.Option;

export default class ProductHome extends Component {
  state = {
    loading: false,
    products: [],
    total: 0,
    currentPage: 1,
  };

  formRef = React.createRef();

  updateStatus = async (productId, status) => {
    const res = await reqUpdateStatus(productId, status);
    if (res.status === 0) {
      message.success("更新商品成功");
      this.getProducts(this.state.currentPage);
    }
  };

  initColumns = () => {
    this.columns = [
      { title: "商品名称", dataIndex: "name" },
      { title: "商品描述", dataIndex: "desc" },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "￥" + price,
      },
      {
        title: "状态",
        // dataIndex: "status",
        width: 100,
        render: (product) => {
          const { status, _id } = product,
            newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        title: "操作",
        width: 100,
        render: (product) => (
          <span>
            <LinkButton
              onClick={() =>
                this.props.history.push("/product/detail", { product })
              }
            >
              详情
            </LinkButton>
            <LinkButton
              onClick={() =>
                this.props.history.push("/product/addupdate", { product })
              }
            >
              修改
            </LinkButton>
          </span>
        ),
      },
    ];
  };

  getProducts = async (pageNum) => {
    const { searchType, searchName } = this.formRef.current.getFieldsValue();
    this.setState({ loading: true, currentPage: pageNum });
    if (!searchName) {
      const productsRes = await reqProducts(pageNum, PAGE_SIZE);
      if (productsRes.status === 0) {
        const { total, list } = productsRes.data;
        this.setState({ total, products: list });
      }
    } else {
      const searchRes = await reqSearchProducts(
        pageNum,
        PAGE_SIZE,
        searchName,
        searchType
      );
      if (searchRes.status === 0) {
        const { total, list } = searchRes.data;
        this.setState({ total, products: list });
      }
    }
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products, total, loading, currentPage } = this.state,
      title = (
        <span>
          <Form
            style={{ display: "flex" }}
            ref={this.formRef}
            onFinish={() => this.getProducts(1)}
          >
            <Form.Item
              name="searchType"
              initialValue="productName"
              style={{ marginBottom: 0 }}
            >
              <Select style={{ width: 150, marginBottom: 0 }}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
            </Form.Item>
            <Form.Item name="searchName" style={{ margin: "0 15px" }}>
              <Input placeholder="请输入关键字" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </span>
      ),
      extra = (
        <Button
          type="primary"
          onClick={() => this.props.history.push("/product/addupdate")}
        >
          <PlusOutlined />
          添加商品
        </Button>
      );

    this.initColumns();

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            current: currentPage,
            onChange: (pageNum) => this.getProducts(pageNum),
          }}
        />
      </Card>
    );
  }
}
