/* eslint-disable no-undef */
import React, { Component } from "react";
import { Card, List } from "antd";
import { connect } from "react-redux";
import { setProduct } from "../../redux/actions";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

const Item = List.Item;

class ProductDetail extends Component {
  state = {
    cName1: "",
    cName2: "",
  };

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.product;
    if (pCategoryId === "0") {
      // 一级分类下的商品
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      // 二级分类下的商品
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({
        cName1,
        cName2,
      });
    }
  }
  componentWillUnmount() {
    this.props.setProduct({});
  }

  render() {
    const title = (
        <span>
          <LinkButton>
            <ArrowLeftOutlined
              style={{ marginRight: 10, fontSize: 20 }}
              onClick={() => this.props.history.goBack()}
            />
          </LinkButton>
          <span>商品详情</span>
        </span>
      ),
      { name, desc, price, detail, imgs } = this.props.product,
      { cName1, cName2 } = this.state;

    return (
      <Card title={title} className="product-detail">
        <List className="rac">
          <Item>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            <span>
              {cName1}
              {cName2 ? "-->" + cName2 : ""}
            </span>
          </Item>
          <Item>
            <span className="left">商品图片：</span>
            <span>
              {imgs && imgs.length === 0 ? (
                <span>暂无图片</span>
              ) : (
                imgs.map((item, index) => (
                  <img
                    src={BASE_IMG_URL + item}
                    alt="img"
                    key={index}
                    className="product-img"
                  />
                ))
              )}
            </span>
          </Item>
          <Item>
            <span className="left">商品详情：</span>
            <span
              className="details"
              dangerouslySetInnerHTML={{ __html: detail }}
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}

export default connect((state) => ({ product: state.product }), { setProduct })(
  ProductDetail
);
