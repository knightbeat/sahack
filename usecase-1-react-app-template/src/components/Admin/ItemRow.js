import { Container, Button, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

export default function ItemRow({ product, onSaveProduct, onDeleteProduct }) {

    const [currentProduct, setCurrentProduct] = useState(product);

    if (product != undefined) {

        // SET THE INITIAL FIELD VALUES & LABELS 
        // create ids for input text fields e.g <input id="id-title" />
        var inputIds = [currentProduct.id + "-title", currentProduct.id + "-description", currentProduct.id + "-includes", currentProduct.id + "-inc_for", currentProduct.id + "-color", currentProduct.id + "-material", currentProduct.id + "-unit_price"];

        // set the fields to readOnly mode initially when the page loads
        var readOnlyFieldValue = true;
        var classNameFieldValue = "readOnly";
        var modifyButtonText = "Edit";
        var dataSetTxt = "edit";

        // if the product is new, set the fields to editable mode initially on Add New Product click
        if (product.id == -1) {
            readOnlyFieldValue = false;
            classNameFieldValue = "editable";
            modifyButtonText = "Save";
            dataSetTxt = "save";
        }

        // WEB PAGE INTERACTIONS
        // Change the text of the button to "Save" and make the fields editable
        // Change the text of the button to "Edit" and make the fields readOnly
        // call toggleFields() to change the fields to readOnly or editable
        // call onEditItem() to save the changes to the database
        const handleEditSave = (product, e) => {

            var productId = e.target.dataset.prodid;

            if (e.target.dataset.txt == "edit") {
                e.target.dataset.txt = "save";
                e.target.innerHTML = "Save";
            } else {
                e.target.dataset.txt = "edit";
                e.target.innerHTML = "Edit";
                // call the parent component's onSaveProduct() method to save the changes to the database
                onSaveProduct(product, e)
            }
            toggleFields(productId);
        }
        // toggle the fields between readOnly and editable
        function toggleFields(id) {
            var fileds = ["title", "description", "includes", "inc_for", "color", "material", "unit_price"];
            for (var i = 0; i < fileds.length; i++) {
                var field = document.getElementById(id + "-" + fileds[i]);
                if (field.readOnly) {
                    field.readOnly = false;
                    field.className = "editable";
                } else {
                    field.readOnly = true;
                    field.className = "readOnly";
                }
            }
        }

        // modify the product property when the relevant webpage text field value changes
        // to be called on key press event
        const modifyProductPropertyOnFieldValueChange = (field, e) => {
            if (field == "unit_price") {
                currentProduct[field] = parseFloat(e.target.value);
            } else {
                currentProduct[field] = e.target.value;
            }
            setCurrentProduct(currentProduct);
        }
        // WEB PAGE INTERACTIONS - END

        return (
            <tr className="align-middle">
                <td>
                    <input type="text" id={inputIds[0]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('title', e)}
                        defaultValue={currentProduct.title}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} />
                </td>
                <td>
                    <textarea id={inputIds[1]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('description', e)}
                        defaultValue={product.description}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} cols={40} />
                </td>
                <td>
                    <input type="text" id={inputIds[2]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('includes', e)}
                        defaultValue={product.includes}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} />
                </td>
                <td>
                    <input type="text" id={inputIds[3]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('inc_for', e)}
                        defaultValue={product.inc_for}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} style={{ width: 120 }} />
                </td>
                <td>
                    <input type="text" id={inputIds[4]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('color', e)}
                        defaultValue={product.color}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} style={{ width: 80 }} />
                </td>
                <td>
                    <input type="text" id={inputIds[5]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('material', e)}
                        defaultValue={product.material}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} style={{ width: 80 }} />
                </td>
                <td>
                    <input type="text" id={inputIds[6]}
                        onChange={(e) => modifyProductPropertyOnFieldValueChange('unit_price', e)}
                        defaultValue={product.unit_price}
                        readOnly={readOnlyFieldValue} className={classNameFieldValue} style={{ width: 80 }} />
                </td>
                <td>
                    <Button onClick={(e) => handleEditSave(product, e)} variant="primary" size="sm" data-txt={dataSetTxt} data-prodid={currentProduct.id}>{modifyButtonText}</Button>&nbsp;
                    <Button onClick={() => onDeleteProduct(product)} variant="danger" size="sm">Delete</Button></td>
            </tr>
        );

    } else {
        return (<tr className="align-middle"></tr>);
    }
}