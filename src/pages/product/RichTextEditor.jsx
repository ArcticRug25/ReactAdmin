/* eslint-disable no-useless-constructor */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { reqUploadImg } from "../../api";

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);

    const html = this.props.detail;
    if (html) {
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = { editorState };
    } else {
      this.state = { editorState: EditorState.createEmpty() };
    }
  }

  static propTypes = {
    detail: PropTypes.string,
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getDetails = () => {
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  };

  uploadImageCallBack = (file) => {
    return new Promise(async (resolve, reject) => {
      let formData = new FormData();
      formData.append("image", file);
      const uploadImgRes = await reqUploadImg(formData);
      if (uploadImgRes.status === 0) {
        const link = uploadImgRes.data.url.replace('localhost','zlx.cool');
        resolve({ data: { link } });
      } else {
        reject("出错了");
      }
    });
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorStyle={{
            border: "1px solid black",
            minHeight: 200,
            paddingLeft: 10,
          }}
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: { present: true, mandatory: true },
            },
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
