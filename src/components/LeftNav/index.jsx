import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
import logo from "../../assets/img/logo.png";
import "./index.less";

const { SubMenu } = Menu;

export default class LeftNav extends Component {
  // eslint-disable-next-line no-undef
  getMenuNodes = (list, path) => {
    return list.map((item) => {
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
    });
  };

  render() {
    let path = this.props.location.pathname;
    if(path.indexOf('/product') === 0){
      path = '/product'
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
