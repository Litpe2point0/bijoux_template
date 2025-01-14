import { useDispatch } from "react-redux";
import { getUserFromToken, login } from "../../api/login/LoginApi";
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from "../../redux/auth/authSlice";
import { useCallback } from "react";
import { setToast } from "../../redux/notification/toastSlice";




const save_login = (dispatch,token, user) => {
    
    const saveInfo = {
        token: token,
        user: user,
        //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE3MDAwMDAwMDB9.-hpZsJmY7MhbyY1fbC0O_t_PYfKkZZKq7MD_LhERm8k",
        //user: getUserFromToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE3MDAwMDAwMDB9.-hpZsJmY7MhbyY1fbC0O_t_PYfKkZZKq7MD_LhERm8k"),
    };

    dispatch(setAuthToken(saveInfo))
}

export const proccess_login = async (dispatch, navigate, login_information) => {
    
    const formData = new FormData();
    formData.append('login_information', JSON.stringify(login_information));

    let response = await login(formData);
    if (response.success) {
        
        const token=response.jwt_token
        const user = getUserFromToken(token)
        //console.log("User From JWT", user)
        dispatch(setToast({ color: "success",title: 'Login Successfully !', mess: 'Welcome '+ user.fullname}))
        //sessionStorage.setItem('user', JSON.stringify(user));
        save_login( dispatch,token, user)

        navigate('/dashboard');
        

    } else if (response.error) {
        dispatch(setToast({ color: "danger",title: 'Login Failed !', mess: 'Wrong username or password '}))
        console.log(response.error)
    }

}






export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login_with_info = useCallback(async (login_information) => {
        const formData = new FormData();
        formData.append('login_information', JSON.stringify(login_information));
    
        let response = await login(formData);
        if (response.success) {
            const user = getUserFromToken(response.jwt_token);
            //console.log("User From JWT", user);
            dispatch(setAuthToken({ token: response.jwt_token, user: user }));
            navigate('/dashboard');
        } else if (response.error) {
            //console.log(response.error);
        }
    }, [dispatch, navigate]);

    return login_with_info;
};