import React, { useContext, useEffect, useState, useRef } from "react";

import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormCheck
} from '@coreui/react'
import { account_set_deactivate, account_update, get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import { StaffPageContext } from "../Staff_Page";


const CustomForm = ({ account, onClose }) => {
  const dispatch = useDispatch();
  const { handleDataChange } = useContext(StaffPageContext);


  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  // const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [deactivated, setDeactivated] = useState(account.deactivated);

  const dobDefaultValue = convertDateToYYYYMMDD(account.dob)

  const [selectedRole, setSelectedRole] = useState(account.role);

  const fullname = useRef();
  const dob = useRef();
  const email = useRef();
  const phone = useRef();
  const address = useRef();
  const username = useRef();
  const password = useRef();

  function convertDateToYYYYMMDD(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  const empty_input = () => {
    add_name.current.value = "";
    add_price.current.value = "";
    add_quantity.current.value = "";
    setImageBase64(null);
    setImageFile(null)

  }
  const handleSingleFileBase64 = (base64) => {
    setImageBase64(base64)
    //console.log(base64)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
    setDisabled(true);
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else if (form.checkValidity() === true) {

      const new_account = {
        id: account.id,
        username: username.current.value,
        password: password.current.value ? password.current.value : null,
        imageUrl: imageBase64,
        dob: dob.current.value,
        email: email.current.value,
        fullname: fullname.current.value,
        role: selectedRole,
        phone: phone.current.value,
        address: address.current.value
      }

      //console.log("new_account", new_account)

      const formData = new FormData();
      formData.append('new_account', JSON.stringify(new_account));

      let response = await account_update(formData, 'Account ID ' + account.id);

      if (response.success) {
        handleDataChange();
        onClose();
        setValidated(false)
      }
      dispatch(setToast(response.mess))
    }

    setDisabled(false)
  }
  const handleActivate = async (new_activate) => {
    const deactivate= {
        account_id: account.id,
        deactivate: new_activate 
    }
    const formData = new FormData();
    formData.append('deactivate', JSON.stringify(deactivate));
    const response= await account_set_deactivate(formData, 'Account ID ' + account.id);

    handleDataChange();

    dispatch(setToast(response.mess))

    onClose();
  }


  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}

    >


      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Full Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" defaultValue={account.fullname} ref={fullname} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Date Of Birth</CFormLabel>
        <CFormInput type="date" id="validationCustom02" defaultValue={dobDefaultValue} ref={dob} required />
        {/* <DateTimePicker ref={dob} required/> */}
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Personal Email</CFormLabel>
        <CFormInput type="email" id="validationCustom02" defaultValue={account.email} ref={email} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Contact Phone Number</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.phone} ref={phone} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Address</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.address} ref={address} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Username</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.username} ref={username} required disabled />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Password (default: 123)</CFormLabel>
        <CFormInput type="text" id="validationCustom02" ref={password} />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Avatar</CFormLabel>
        <AvatarUpload defualtImage={account.imageUrl} handleSingleFileBase64={handleSingleFileBase64} />
      </CCol>

      <CCol xs={12} className="d-flex justify-content-center align-items-center">
        <CButton className="mx-2" color={account.deactivated == 0 ? "danger" : "info"} value={account.deactivated == 0 ? 1 : 0} onClick={(e) => handleActivate(e.target.value)}  >
          {account.deactivated == 0 ? 'Deactivate' : 'Activate'}
        </CButton>
        |
        <CButton className="mx-2" color="success" type="submit" disabled={disabled}>
          Confirm Update
        </CButton>

      </CCol>
    </CForm>
  )
}

const StaffUpdate = ({ account, onClose }) => {
  return (
    <CustomForm account={account} onClose={onClose} />
  );
};

export default StaffUpdate;
