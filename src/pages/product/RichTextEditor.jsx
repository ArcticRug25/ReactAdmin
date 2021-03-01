/* eslint-disable no-useless-constructor */
/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

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
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
