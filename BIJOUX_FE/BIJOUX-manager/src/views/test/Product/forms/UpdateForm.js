import React, { useContext, useEffect, useState, useRef } from "react";

import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster
} from '@coreui/react'
import { update_product_list } from "../../../../api/ProductApi";
import { get_product_list } from "../../../../api/ProductApi";
import { MyContext } from "../ProductTable";
import { toastFormat } from "../../../component_items/toast/toast";
import ImgUploadPreview from "./ImgUploadPreview";
import { setToast } from "../../../../redux/notification/toastSlice";
import { useDispatch } from "react-redux";
const status = ["warning", "danger", "success", "secondary"];

const tag = ["primary", "secondary", "info"];

const CustomStyles = ({ product }) => {
  const dispatch= useDispatch();
  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const update_id = useRef();
  const update_name = useRef();
  const update_price = useRef();
  const update_quantity = useRef();
  const { onDataChange} = useContext(MyContext);
  
  
  const handleFileBase64 = (base64) => {
    setImageBase64(base64)
    //console.log(base64)
  }
  const handleFileUpload = (file) => {
    setImageFile(file)
    //console.log(file)
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true)
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else if (form.checkValidity() === true) {
      const new_product = {
        id: update_id.current.value,
        name: update_name.current.value,
        price: update_price.current.value,
        quantity: update_quantity.current.value,
        image: imageBase64
      }
      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('new_product', JSON.stringify(new_product));
      formData.append('old_product', JSON.stringify(product));
      let response = await update_product_list(formData);

      
      let mess='';
      let mess_color='';

      if (response.success) {
        onDataChange();
        mess= response.success
        mess_color='success'
      } else if (response.error) {
        onDataChange();
        mess= response.error;
        mess_color='danger'
      }
      //setToast(toastFormat({ color: mess_color,title: 'Product id '+product.id, mess: mess }))
      dispatch(setToast({ color: mess_color,title: 'Product id '+product.id, mess: mess }))
    }
    

  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        
        <CFormLabel htmlFor="validationCustom01">Product id</CFormLabel>
        <CFormInput type="text" id="validationCustom01" defaultValue={product.id} ref={update_id} disabled />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Product name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" defaultValue={product.name} ref={update_name} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Product price</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={product.price} ref={update_price} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Product quantity</CFormLabel>
        <CFormInput type="number" id="validationCustom02" defaultValue={product.quantity} ref={update_quantity} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
        <ImgUploadPreview handleFileUpload={handleFileUpload} handleFileBase64={handleFileBase64} />
      <CCol xs={12} >
        <CButton color="primary" type="submit" disabled={disabled}>
          Submit form
        </CButton>
      </CCol>
    </CForm>
  )
}

const UpdateForm = (props) => {


  return (

    <CustomStyles product={props.product} />
  )

};

export default UpdateForm;
