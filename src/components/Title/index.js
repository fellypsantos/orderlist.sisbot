import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Title = (props) => {
  const {text} = props;

  return (
    <Row>
      <Col>
        <h4 className="mb-3">{text}</h4>
      </Col>
    </Row>
  );
};

export default Title;
