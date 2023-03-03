import React, {useEffect} from 'react';
import { Container, Row, Col, Form, FormLabel, Button } from 'react-bootstrap';
import '../../App.js';
import '../../index.css';
import {InputNumber, InputGroup} from 'rsuite';
import './inputnumber.less'

export default function MyCart() {
  useEffect(() => {
    document.title = 'My Cart';
  }, []);

  // State to keep track of the number of items in the cart
  const [value, setValue] = React.useState(0);
  const handleMinus = () => {
    setValue(parseInt(value, 10) - 1);
  };
  const handlePlus = () => {
    setValue(parseInt(value, 10) + 1);
  };

  // Number of items in the cart
  let numItems = 6;
  return (
    <>
    <Container className="mt-5">
        <Row>
            <Col>
                <p>Checking out items - You have {numItems} items in your cart</p>
                <table className='table align-middle'> 
                   <thead>
                    <tr className="text-center">
                        <th scope="col"></th>
                        <th scope="col">QTY</th>
                        <th scope="col" >Unit</th>
                        <th scope="col">Total</th>
                    </tr>
                   </thead>           
                   <tbody>
                    <tr>
                    <td>Top Paw® Valentine's Day Single Dog Sweater</td>
                    <td width="120px"><InputGroup>
        <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
        <InputNumber className="custom-input-number" value={3} onChange={setValue} />
        <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
      </InputGroup></td>
                    <td width="120px" className="text-center">$ 14.99</td>
                    <td width="120px" className="text-center">$ 44.97</td>
                    </tr>
                    
                    <tr>
                    <td>Arcadia Trail™ Dog Windbreaker</td>
                    <td width="120px"><InputGroup>
        <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
        <InputNumber className="custom-input-number" value={3} onChange={setValue} />
        <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
      </InputGroup></td>
                    <td width="120px" className="text-center">$ 29.99</td>
                    <td width="120px" className="text-center">$ 89.97</td>
                    </tr>

                   </tbody>          
                </table>
            </Col>
            <Col className="col-4 bg-primary p-4 text-white rounded-3"><h2>Card Details</h2>
                <Form>
                    <Row>
                    <Form.Group className="mb-3" controlId="formNameOnCard">
                        <FormLabel>Name on Card</FormLabel>
                        <Form.Control type="text" placeholder="Enter full name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCardNumber">
                        <FormLabel>Card Number</FormLabel>
                        <Form.Control type="text" placeholder="Enter card number" />
                    </Form.Group>
                    </Row>
                    <Row><Col>
                    <Form.Group className="mb-3" controlId="formExpirationDate">
                        <FormLabel>Expiration Date</FormLabel>
                        <Form.Control type="text" placeholder="Expiration Date" />
                    </Form.Group></Col>
                    <Col>
                    <Form.Group className="mb-3" controlId="formCVV">
                        <FormLabel>CVV</FormLabel>
                        <Form.Control type="text" placeholder="CVV" />
                    </Form.Group></Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Subtotal</Col>
                        <Col className="col-2 d-flex justify-content-right">$134.97</Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Shipping</Col>
                        <Col className="col-2 d-flex justify-content-right">$20</Col>
                    </Row>
                    <Row className="p-2">
                        <Col c>Tax</Col>
                        <Col className="col-2 d-flex justify-content-right">$10.34</Col>
                    </Row>

                    <Row className="p-2">
                        <Col>Total (inc. tax)</Col>
                        <Col className="col-2 d-flex justify-content-right">$165.31</Col>
                    </Row>
                    <Row className="d-flex justify-content-center p-3">
                        <Button variant="warning" type="submit" size="lg">
        Place Order
      </Button>
                        </Row>
                </Form>
            </Col>
        </Row>
        
    </Container>
    </>
  );
}