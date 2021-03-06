import React ,{useEffect} from "react";
import { Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { setHeaderTitle } from "../../redux/actions";
import "./not-found.less";

function NotFound(props) {
  const goHome = () => {
    props.setHeaderTitle("首页");
    props.history.replace("/home");
  };
  useEffect(()=>props.setHeaderTitle(""),[props])

  return (
    <Row className="not-found">
      <Col span={12} className="left"></Col>
      <Col span={12} className="right">
        <h1>404</h1>
        <h2>抱歉，你访问的页面不存在</h2>
        <div>
          <Button type="primary" onClick={goHome}>
            回到首页
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default connect(null, {
  setHeaderTitle,
})(NotFound);
