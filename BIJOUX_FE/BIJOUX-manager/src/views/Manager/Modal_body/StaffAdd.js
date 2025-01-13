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
import { get_account_list, get_staff_role_list, register } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import { get } from "jquery";
import { StaffPageContext } from "../Staff_Page";


const CustomForm = () => {
  const dispatch = useDispatch();
  const { handleDataChange } = useContext(StaffPageContext);


  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const [imageBase64, setImageBase64] = useState(process.env.REACT_APP_BACKEND_IMAGE_URL+'/Account/unknown.jpg');
  const [roles, setRoles] = useState([]);  


  const [selectedRole, setSelectedRole] = useState(null);

  const fullname = useRef();
  const dob = useRef();
  const email = useRef();
  const phone = useRef();
  const address = useRef();
  const username = useRef();
  const password = useRef();


  const empty_input = () => {
    username.current.value = "";
    password.current.value = 123;
    dob.current.value = "";
    email.current.value = "";
    fullname.current.value = "";
    phone.current.value = "";
    address.current.value = "";
    setImageBase64(process.env.REACT_APP_BACKEND_IMAGE_URL+'/Account/unknown.jpg');

  }
  const handleSingleFileBase64 = (base64) => {
    setImageBase64(base64)
    console.log(base64)
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
        username: username.current.value,
        password: password.current.value,
        imageUrl : imageBase64.includes('unknown.jpg') ? null : imageBase64,
        dob: dob.current.value,
        email: email.current.value,
        fullname: fullname.current.value,
        role: selectedRole,
        phone: phone.current.value,
        address: address.current.value
      }

      console.log("add account", new_account)

      const formData = new FormData();
      formData.append('new_account', JSON.stringify(new_account));
      let response = await register(formData,'New Staff');
      


      if (response.success) {
        handleDataChange();
        //onClose();
        setValidated(false)
      }
      dispatch(setToast(response.mess))
      setValidated(false)
      empty_input()
    }

    setDisabled(false)
  }

  

  const handleRoleChange = (role) => {
    console.log(role)
    setSelectedRole(role)
  }
  useEffect( ()=>{
    const get_roles = async () => {
      const roleList=await get_staff_role_list()
      setRoles(roleList.data)
      setSelectedRole(roleList.data[0])
    }
    get_roles();
    
  },[])
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}

    >
      <CCol md={12}>
        Staff role:
        <span className="d-flex justify-content-around border border-2 border-primary p-2 rounded-3">

          {(selectedRole !=null ) && roles.map((role, index) => (
            <div key={role.id} className="d-flex align-items-center">
              <CFormCheck

                key={role.id}
                button={{
                  color: selectedRole.id && selectedRole.id === role.id ? 'success' : 'danger',
                  variant: 'outline',
                  width: '100px'
                }}
                type="radio"
                name="roles"
                id={role.id}
                autoComplete="off"
                label={selectedRole.id === role.id ? <><FaUserCheck size={20} color="mediumspringgreen" /> {role.name}</> : role.name}
                value={role.name}
                defaultChecked={role === selectedRole}
                onChange={() => handleRoleChange(role)}
                checked={selectedRole.id === role.id}
              />

            </div>



          )) }
        </span>
      </CCol>

      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Full Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" ref={fullname} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Date Of Birth</CFormLabel>
        <CFormInput type="date" id="validationCustom02" ref={dob} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Personal Email</CFormLabel>
        <CFormInput type="email" id="validationCustom02" ref={email} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Contact Phone Number</CFormLabel>
        <CFormInput type="text" id="validationCustom02" ref={phone} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Address</CFormLabel>
        <CFormInput type="text" id="validationCustom02" ref={address} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Username</CFormLabel>
        <CFormInput type="text" id="validationCustom02" ref={username} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Password (default: 123)</CFormLabel>
        <CFormInput type="password" id="validationCustom02" defaultValue={'123'} ref={password} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Avatar</CFormLabel>
        <AvatarUpload defualtImage={imageBase64} handleSingleFileBase64={handleSingleFileBase64} />
      </CCol>
      <CCol xs={12} className="d-flex justify-content-center">
        <CButton color="success" type="submit" disabled={disabled}>
          Confirm add
        </CButton>
      </CCol>
    </CForm>
  )
}

const StaffAdd = () => {
  return (
    <CustomForm  />
  );
};

export default StaffAdd;
