import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ProductAddUpdate from "./ProductAddUpdate";
import ProductDetail from "./ProductDetail";
import ProductHome from "./ProductHome";
import './index.less'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product/addupdate" component={ProductAddUpdate} />
        <Route path="/product/detail" component={ProductDetail} />
        <Route path="/product" component={ProductHome} exact />
        <Redirect to="/product" />
      </Switch>
    );
  }
}
