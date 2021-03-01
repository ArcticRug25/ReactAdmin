import React from "react";
import { Card, Form, Input, Cascader, Button } from "antd";
import LinkButton from "../../components/LinkButton";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { reqCategorys } from "../../api";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";

const { Item } = Form,
  { TextArea } = Input;

export default function ProductAddUpdate(props) {
  const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    },
    [form] = Form.useForm(),
    [product] = React.useState(() => {
      const updateProduct = props.history.location.state;
      if (!!updateProduct) {
        const productDetail = updateProduct.product;
        if (productDetail.pCategoryId === "0") {
          productDetail.categoryIds = [productDetail.categoryId];
        } else {
          productDetail.categoryIds = [
            productDetail.pCategoryId,
            productDetail.categoryId,
          ];
        }
        return productDetail;
      }
      return {};
    }),
    [isUpdate] = React.useState(() =>
      props.history.location.state ? true : false
    ),
    [options, setOptions] = React.useState([]),
    title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{ marginRight: 10, fontSize: 20 }}
            onClick={() => props.history.goBack()}
          />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    ),
    pw = React.createRef(),
    editor = React.createRef();

  const onFinish = (...args) => {
    console.log(args);
    const imgs = pw.current.getImgs();
    const details = editor.current.getDetails();
    console.log(imgs);
    console.log(details);
  };

  const getCategorys = async (parentId) => {
    const categorysRes = await reqCategorys(parentId);
    if (categorysRes.status === 0) {
      const categorys = categorysRes.data;
      if (parentId === "0") {
        initOptions(categorys);
      } else {
        return categorys;
      }
    }
  };

  const initOptions = async (categorys) => {
    const options = categorys.map((item) => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }));
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      const subCategorys = await getCategorys(pCategoryId);
      const childOptions = subCategorys.map((item) => ({
        value: item._id,
        label: item.name,
        isLeaf: false,
      }));

      const targetOption = options.find((item) => item.value === pCategoryId);
      targetOption.children = childOptions;
    }
    setOptions([...options]);
  };

  const validatePrice = (_, value) =>
    value * 1 > 0 ? Promise.resolve() : Promise.reject("商品价格必须大于0");

  const onChange = () => {};

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    const subCategory = await getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategory && subCategory.length > 0) {
      const childOptions = subCategory.map((item) => ({
        value: item._id,
        label: item.name,
        isLeaf: true,
      }));
      targetOption.children = childOptions;
    } else {
      targetOption.isLeaf = true;
    }

    setOptions([...options]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => getCategorys("0"), []);

  React.useEffect(() => form.resetFields(), [form, product]);

  return (
    <Card title={title}>
      <Form {...layout} form={form} onFinish={onFinish}>
        <Item
          label="商品名称"
          name="name"
          initialValue={product.name}
          rules={[{ required: true, message: "必须输入商品名称" }]}
        >
          <Input placeholder="请输入商品名称" />
        </Item>
        <Item
          label="商品描述"
          name="desc"
          initialValue={product.desc}
          rules={[{ required: true, message: "必须输入商品描述" }]}
        >
          <TextArea
            placeholder="请输入商品描述"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Item>
        <Item
          label="商品价格"
          name="price"
          initialValue={product.price}
          rules={[
            { required: true, message: "必须输入商品价格" },
            {
              validator: (_, value) => validatePrice(_, value),
            },
          ]}
        >
          <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
        </Item>
        <Item
          label="商品分类"
          initialValue={product.categoryIds}
          name="category"
          rules={[{ required: true, message: "必须选择商品分类" }]}
        >
          <Cascader
            options={options}
            loadData={loadData}
            onChange={onChange}
            changeOnSelect
            placeholder="请选择商品分类"
          />
        </Item>
        <Item label="商品图片">
          <PicturesWall ref={pw} imgs={product.imgs} />
        </Item>
        <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <RichTextEditor ref={editor} detail={product.detail} />
        </Item>
        <Item>
          <Button style={{ marginLeft: 18 }} type="primary" htmlType="submit">
            {isUpdate ? "修改" : "提交"}
          </Button>
        </Item>
      </Form>
    </Card>
  );
}
