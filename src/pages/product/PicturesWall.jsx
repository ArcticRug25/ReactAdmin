/* eslint-disable no-useless-constructor */
/* eslint-disable no-undef */
import React from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../api";
import PropTypes from "prop-types";
import { BASE_IMG_URL } from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  constructor(props) {
    super(props);

    let fileList = [];
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item, index) => ({
        uid: -index,
        name: item,
        status: "done",
        url: BASE_IMG_URL + item,
      }));
    }

    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList,
    };
  }

  static propTypes = {
    imgs: PropTypes.array,
  };

  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  getImgs = () => {
    return this.state.fileList.map((item) => item.name);
  };

  handleChange = async ({ file, fileList }) => {
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("上传图片成功");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url.replace("localhost", "zlx.cool");
      } else {
        message.error("上传图片失败");
      }
    } else if (file.status === "removed") {
      const delImgRes = await reqDeleteImg(file.name);
      if (delImgRes.status === 0) {
        message.success("删除图片成功");
      } else {
        message.error("删除图片失败");
      }
    }
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/api1/manage/img/upload"
          accept="image/*"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
