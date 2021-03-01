import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import "./index.less";

export default class Login extends Component {
  render() {
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/admin" />;
    }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <NormalLoginForm {...this.props} />
        </section>
      </div>
    );
  }
}

const NormalLoginForm = (props) => {
  const { history } = props;

  const onFinish = async (val) => {
    const { username, password } = val;
    const loginRes = await reqLogin(username, password);
    // console.log(data);
    if (loginRes.status === 0) {
      message.success("登录成功");

      const user = loginRes.data;
      memoryUtils.user = user;
      storageUtils.saveUser(user);
      history.replace("/");
    } else {
      message.error(loginRes.msg);
    }
  };

  //   const [form] = Form.useForm()

  //   React.useEffect(()=>{
  //     console.log(form);
  //   })

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
