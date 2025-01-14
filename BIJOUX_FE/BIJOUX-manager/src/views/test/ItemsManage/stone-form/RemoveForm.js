import React, { useContext, useEffect, useState, useRef } from "react";

import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
} from '@coreui/react'
import { ItemsManageContext } from "..";
import { StoneShapeContext } from "../StoneShape/table";
import { toastFormat } from "../../../component_items/toast/toast";
import { delete_stoneShape_list } from "../../../../api/StoneApi";


const CustomStyles = ({ shape, onClose }) => {
    
    const [validated, setValidated] = useState(false)
    const [disabled, setDisabled] = useState(false);

    const remove_id = useRef();


    const { onDataChange } = useContext(StoneShapeContext);
    const { setToast } = useContext(ItemsManageContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        setDisabled(true);
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {

            const remove_shape = {
                id: shape.id,
                name: shape.name,
                path: shape.path
            }
            //console.log("removing stone shape", remove_shape)

            const formData = new FormData();

            formData.append('remove_shape', JSON.stringify(remove_shape));
            let response = await delete_stoneShape_list(formData);

            let mess = '';
            let mess_color = '';
            if (response.success) {
                mess = response.success;
                onDataChange();
                setValidated(false);
                onClose();
                mess_color = 'success'
            } else if (response.error) {
                mess = response.error;
                mess_color = 'danger'
            }
            


            setToast(toastFormat({ color: mess_color, title: 'Stone Shape id ' + shape.id, mess: mess }))

        }

        setDisabled(false)
    }
    return (
        <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom01">Removeing stone shape id</CFormLabel>
                <CFormInput type="text" id="validationCustom01" defaultValue={shape.id}  disabled />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol xs={12} >
                <CButton color="primary" type="submit" disabled={disabled}>
                    Confirm update
                </CButton>
            </CCol>
        </CForm>
    )
}

const RemoveForm = (props) => {


    return (

        <CustomStyles shape={props.shape} onClose={props.onClose} />
    )

};

export default RemoveForm;
