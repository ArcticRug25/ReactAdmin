/* eslint-disable no-undef */
import React, { Component } from "react";
import menuList from "../../config/menuConfig";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../LinkButton";
import "./index.less";

export default class Header extends Component {
  
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
        if(path.indexOf('/product')===0){
          path = '/product';
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
        memoryUtils.user = {};
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
    const { currentTime } = this.state;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {memoryUtils.user.username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{this.getTitle()}</div>
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
