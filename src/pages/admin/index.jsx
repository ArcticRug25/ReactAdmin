import React, { Component } from "react";
import memoryUtils from "../../utils/memoryUtils";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import Header from "../../components/Header";
import LeftNav from "../../components/LeftNav";
import Home from "../home";
import Category from "../category";
import Product from "../product";
import Role from "../role";
import User from "../user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    if (!user || !user._id) {
      return <Redirect to="/login" />;
    }

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <LeftNav {...this.props} />
        </Sider>
        <Layout>
          <Header {...this.props}>Header</Header>
          <Content style={{ margin: 20, backgroundColor: "#fff" }}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path={`/category`} component={Category} />
              <Route path={`/product`} component={Product} />
              <Route path={`/user`} component={User} />
              <Route path={`/role`} component={Role} />
              <Route path={`/charts/bar`} component={Bar} />
              <Route path={`/charts/pie`} component={Pie} />
              <Route path={`/charts/line`} component={Line} />
              <Redirect from="/" to={`/home`} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#ccc" }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
