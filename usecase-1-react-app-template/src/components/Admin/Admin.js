import React, { useEffect, useState } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import ItemRow from './ItemRow';

export default function Admin({ items, onSaveProduct, onDeleteProduct }) {

    const [newProduct, setNewProduct] = useState({});
    const [rows, setRows] = useState([]);

    var itemRows = <ItemRow />;

    if (items != undefined && Array.isArray(items)) {

        var initState = "edit";
        itemRows = items.map((product, i) => {
            
            return (
                <ItemRow key={i} product={product} onSaveProduct={onSaveProduct} onDeleteProduct={onDeleteProduct}/>
            )
        });
    }

    const handleAddNewProduct = (e) => {
        var newProduct = {};
        newProduct.id = -1;
        setNewProduct(newProduct);
        items.push(newProduct);
    }

    useEffect(() => {
        
    }, [itemRows]);

    return (
        <>
            <Container className="mt-5">
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th scope="col" width="150px">Title</th>
                            <th scope="col" width="400px">Description</th>
                            <th scope="col">Includes</th>
                            <th scope="col">Intended For</th>
                            <th scope="col" width="50px">Color</th>
                            <th scope="col">Material</th>
                            <th scope="col">Price</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                        {itemRows}
                        <tr className="text-end">
                            <td colSpan="8"><Button onClick={(e) => handleAddNewProduct(e)} variant="primary" className="float-right">Add New Product</Button></td>
                        </tr>
                    </thead>
                </Table>
            </Container>
        </>
    );
}