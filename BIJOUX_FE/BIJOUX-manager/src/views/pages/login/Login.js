import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import * as jwtDecode from 'jwt-decode';

import { login, getUserFromToken } from '../../../api/main/accounts/Login'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthToken, setAuthToken } from '../../../redux/auth/authSlice'
import { proccess_login, useLogin } from './proccesslogin'
import { getTokenFromPersist, getUserFromPersist } from '../../../api/instance/axiosInstance'
import { checkTokenValidity } from '../../../useSyncTabs'
import { clearToast } from '../../../redux/notification/toastSlice'


const Login = () => {
  const username = useRef();
  const password = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);


  const [validated, setValidated] = useState(false)

  const [toast, setToast] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const new_toast = useSelector((state) => state.toast.toast_component);
  const handleLogout = () => {
    dispatch(clearAuthToken());
    dispatch(clearToast());
  }
  useEffect(() => {
    handleLogout()
  },[])
  
  useEffect(() => {
    //console.log(new_toast)
    setToast(new_toast);
  }, [new_toast]);

  useEffect(() => {
    //alert("Token trong login: "+auth.token)
    if (auth.token != null && checkTokenValidity(auth.token)) {
      //alert("trong login: "+auth.token)
      const user = getUserFromToken(auth.token)
      if (user.role_id == 1) {
        navigate('/dashboard');
      } else if (user.role_id == 2) {
        navigate('/orders_sale_staff/table');
      } else if (user.role_id == 3) {
        navigate('/orders_design_staff/table');
      } else if (user.role_id == 4) {
        navigate('/orders_production_staff/table');
      }
      //navigate('/dashboard');
    }
  }, [auth])



  const handleSubmit = async (event) => {
    setValidated(true)
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault();
      setDisabled(true);
      const login_information = {
        username: username.current.value,
        password: password.current.value
      }
      await proccess_login(dispatch, navigate, login_information);
      setDisabled(false)
    }
  }



  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CToaster push={toast} placement="top-end" />

        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput disabled={disabled} ref={username} placeholder="Username" autoComplete="username" required />
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput disabled={disabled} ref={password}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                      />
                      <CFormFeedback valid>Looks good!</CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton type='submit' color="primary" className="px-4" disabled={disabled}>
                          Login
                        </CButton>
                      </CCol>
                      
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
