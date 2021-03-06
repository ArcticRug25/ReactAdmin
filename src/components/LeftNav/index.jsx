/* eslint-disable no-useless-constructor */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
import logo from "../../assets/img/logo.svg";
import "./index.less";
import { connect } from "react-redux";
import { setHeaderTitle } from "../../redux/actions";

const { SubMenu } = Menu;

class LeftNav extends Component {
  
  constructor(props){
    super(props);
    this.menuListNodes = this.getMenuNodes(menuList);
  }

  // eslint-disable-next-line no-undef
  getMenuNodes = (list) => {
    const path = this.props.location.pathname;
    return list.map((item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          if (item.key === path || (path && path.indexOf(item.key) !== -1)) {
            console.log(1);
            this.props.setHeaderTitle(item.title);
          }
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link
                to={item.key}
                onClick={() => this.props.setHeaderTitle(item.title)}
              >
                {item.title}
              </Link>
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
    const { key, isPublic } = item,
          {user} = this.props;

    const menus = user.role.menus;
    const username = user.username;
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

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>React后台</h1>
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

export default connect((state) => ({user:state.user}), { setHeaderTitle })(LeftNav);
