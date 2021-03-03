/* eslint-disable no-unused-vars */
import React, { useEffect, useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";

const { Item } = Form;

const AuthForm = forwardRef((props, ref) => {
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
        { title: "平台权限", key: "all", children: getMenuList(menuList) },
      ];
    }),
    [checkedKeys, setCheckedKeys] = useState(props.role.menus);

  const onCheck = (checkedKeys) => setCheckedKeys(checkedKeys);

  useEffect(() => setCheckedKeys(props.role.menus), [props.role]);

  return (
    <Form {...formItemLayout}>
      <Item label="角色名称">
        <Input value={props.role.name} disabled />
      </Item>

      <Tree
        checkable
        defaultExpandAll
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        ref={ref}
      >
        {/* <TreeNode title="平台权限" key="all">
          {getMenuList(menuList)}
        </TreeNode> */}
      </Tree>
    </Form>
  );
});

AuthForm.propTypes = {
  role: PropTypes.object,
};

export default AuthForm;
