import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CatalogItem from './CatalogItem';
// import PetStoreNav from '../../App.js';

// Component to render the item list
const PetItemList = ({items}) => {
  const itemPrice = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '50px'
  };

  var itemRows = <CatalogItem />;

  if (items != undefined && Array.isArray(items)) {
    itemRows = items.map((product, i) => {
      return (
        <CatalogItem key={i} product={product}/>
      )
    });
  }
  
  return (
    <>
      <Container>
        <Row>
          {itemRows}
        </Row>
      </Container>
    </>
  );

}

export default function Catalog({items}) {
  return (
    <>
      <PetItemList items={items} />
    </>
  );
}