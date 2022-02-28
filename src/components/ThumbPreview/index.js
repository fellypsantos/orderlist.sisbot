import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {OrderListContext} from '../../contexts/OrderListContext';
import {Container, Thumbnail} from './styles';

const ThumbPreview = ({image, index, handleDelete}) => {
  const {Translator} = useContext(OrderListContext);

  return (
    <Container className="mt-4">
      <Thumbnail src={image} alt="" />

      <div className="d-grid gap-2 mt-1">
        <Button
          variant="outline-danger"
          size="sm"
          className="w-100"
          onClick={() => handleDelete(index)}>
          {Translator('DELETE')}
        </Button>
      </div>
    </Container>
  );
};

export default ThumbPreview;
