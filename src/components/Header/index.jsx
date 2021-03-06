/* eslint-disable no-undef */
import React, { Component } from "react";
import menuList from "../../config/menuConfig";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import storageUtils from "../../utils/storageUtils";
import {logout} from '../../redux/actions';
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../LinkButton";
import "./index.less";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    weather: "",
  };

  getTime = () => {
    this.timer = setInterval(() => {
      this.setState((state) => (state.currentTime = formateDate(Date.now())));
    }, 1000);
  };

  getTitle = () => {
    let path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        if (path.indexOf("/product") === 0) {
          path = "/product";
        }
        const cItem = item.children.find((item) => item.key === path);
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  logout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "确定退出吗",
      onOk: () => {
        storageUtils.removeUser();
        this.props.logout();
        this.props.history.replace("/login");
      },
    });
  };

  componentDidMount() {
    this.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { currentTime } = this.state,
      { headTitle,user } = this.props;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {user.username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{headTitle}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img
              src="http://api.map.baidu.com/images/weather/day/qing.png"
              alt="weather"
            />
            <span>晴</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({ user:state.user,headTitle: state.headTitle }),{
  logout
})(Header);
