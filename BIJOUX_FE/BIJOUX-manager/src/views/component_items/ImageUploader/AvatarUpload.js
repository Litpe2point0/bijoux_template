
import styled from "styled-components";
import { FiCamera } from "react-icons/fi";
import { useEffect, useState } from "react";
import ReactFileReader from "react-file-reader";
import { Button } from '@mui/material';
import {
    CFormInput,
    CButton
} from '@coreui/react'
import AvatarInput from "../Avatar/Avatar";
import { FolderPlus } from "phosphor-react";



export default function AvatarUpload({ handleSingleFileBase64 , defualtImage }) {
    const [url, setUrl] = useState(defualtImage); //"https://i.imgur.com/ndu6pfe.png"

    const handleFile = (files) => {
        const file = files[0];
        // console.log("FILE NÀ", files.base64);
        handleSingleFileBase64(files.base64);
        setUrl(files.base64);
    };
    useEffect(()=>{
        setUrl(defualtImage)
    },[defualtImage])
    
    
   

    return (
        <div  className="border border-2 border-primary rounded-4 p-2 d-flex flex-column align-items-center"  >
            <ReactFileReader
                fileTypes={[".png", ".jpg"]}
                base64={true}
                handleFiles={handleFile}

            >
                <CButton color="primary" className="d-flex align-items-center" >
                <FolderPlus size={20} color="white" weight="duotone" />
                 Upload File
                </CButton>
            </ReactFileReader>
            <AvatarInput size={300} src={url} />
        </div>
    );
}
