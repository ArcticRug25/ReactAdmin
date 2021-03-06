import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import logo from "../../assets/img/logo.svg";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { login } from "../../redux/actions";
import "./index.less";

class Login extends Component {
  render() {
    const { user, errorMsg } = this.props;
    if (user && user._id) {
      return <Redirect to="/home" />;
    }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={errorMsg !== "" ? "error-msg show" : "error-msg"}>
            {errorMsg}
          </div>
          <h2>用户登陆</h2>
          <NormalLoginForm {...this.props} />
        </section>
      </div>
    );
  }
}

const NormalLoginForm = (props) => {
  const { login } = props;

  const onFinish = async (val) => {
    const { username, password } = val;
    login(username, password);
  };

  return (
    <Form onFinish={onFinish} className="login-form">
      <Form.Item
        name="username"
        rules={[
          { required: true, whitespace: true, message: "用户名必须输入" },
          { min: 4, message: "用户名至少4位" },
          { max: 12, message: "用户名最多12位" },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "用户名必须是英文、数字或下划线组成",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登陆
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(
  (state) => ({ user: state.user, errorMsg: state.errorMsg }),
  {
    login,
  }
)(Login);
