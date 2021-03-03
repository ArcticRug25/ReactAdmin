/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
import logo from "../../assets/img/logo.png";
import "./index.less";
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

export default class LeftNav extends Component {
  // eslint-disable-next-line no-undef
  getMenuNodes = (list, path) => {
    return list.map((item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          const cItem = item.children.find((it) => it.key === path);
          if (cItem) {
            this.openKeys = item.key;
          }

          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
    });
  };

  hasAuth = (item) => {
    const { key, isPublic } = item;

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      return !!item.children.find((item) => menus.indexOf(item.key) !== -1);
    }
    return false;
  };

  render() {
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }
    this.menuListNodes = this.getMenuNodes(menuList, path);

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[this.openKeys]}
          mode="inline"
          theme="dark"
        >
          {this.menuListNodes}
        </Menu>
      </div>
    );
  }
}
