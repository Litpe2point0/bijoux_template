
import styled from "styled-components";
import { FiCamera } from "react-icons/fi";
import { useEffect, useState } from "react";
import ReactFileReader from "react-file-reader";
import { Button } from '@mui/material';
import {
    CFormInput,
    CButton
} from '@coreui/react'


export default function UploadPreviewMultiple({handleMultiFileBase64 }) {
    const [urls, setUrls] = useState([]);

    
    const handleFilesMultiple = (files) => {
        const newUrls = [];
        
        //console.log('new url,', files)
        for (let i = 0; i < files.base64.length; i++) {
            newUrls.push(files.base64[i]); 
        }
        //console.log('new url,', newUrls)
        setUrls([...newUrls]);
        
    };
    
    

    return (
        <div >
            <ReactFileReader
                fileTypes={[".png", ".jpg"]}
                base64={true}
                multipleFiles={true}
                handleFiles={handleFilesMultiple}
            >
                <CButton color="success" style={{ width: 'fit-content', height: 'auto' }}>
                    {urls.length != 0 ?
                        
                            urls.map((url, index) => (
                                <img key={index} width={'30%'} src={url} alt={`Uploaded ${index}`} />
                            ))
                        
                        : 'Upload Files'
                    }


                </CButton>
            </ReactFileReader>
        </div>
    );
}
