import { Container, Row, Col, Button }  from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';

const itemPrice = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '50px'
  };

export default function CatalogItem(props) {
    var product = props.product != undefined ? props.product : {};
    return(
        <>
            <Col>
            <img src={require('./item-3.png')} width="300" alt="dog-bandana"/><br />
            <h4>{product.title}</h4>
            <p>{product.dscription}</p>
            <p>
              <b>Includes: </b> {product.include}<br />
              <b>Intended For:</b> {product.inc_for}<br />
              <b>Color:</b> {product.color}<br />
              <b>Material: </b> {product.material}<br />
            </p>
            <br />
            <span style={itemPrice}>{product.unit_price}</span> <Button variant="danger">Add to cart</Button>
            <br /><br />
            Follow updates &nbsp;&nbsp;<FontAwesomeIcon icon={regThumbsUp} /> 
          </Col>
        </>
    );
}