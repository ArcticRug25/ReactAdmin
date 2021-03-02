/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";

const { Item } = Form;

export default function AuthForm(props) {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const getMenuList = (menuList) => {
    const treeData = menuList.reduce((pre, item) => {
      if (item.children) {
        pre.push({
          title: item.title,
          key: item.key,
          children: getMenuList(item.children),
        });
      } else {
        pre.push({ title: item.title, key: item.key });
      }
      return pre;
    }, []);
    return treeData;
  };

  const [treeData] = useState(() => {
    return [
      { title: "平台权限", key: "/index", children: getMenuList(menuList) },
    ];
  });

  return (
    <Form {...formItemLayout}>
      <Item label="角色名称">
        <Input value={props.role.name} disabled />
      </Item>

      <Tree checkable defaultExpandAll={true} treeData={treeData}>
        {/* <TreeNode title="平台权限" key="all">
          {getMenuList(menuList)}
        </TreeNode> */}
      </Tree>
    </Form>
  );
}

AuthForm.propTypes = {
  role: PropTypes.object,
};
