
import styled from "styled-components";
import { FiCamera } from "react-icons/fi";
import { useEffect, useState } from "react";
import ReactFileReader from "react-file-reader";
import { Button } from '@mui/material';
import {
    CFormInput,
    CButton
} from '@coreui/react'


export default function ImgUploadPreview({ handleFileUpload, handleFileBase64 }) {
    const [url, setUrl] = useState();//"https://i.imgur.com/ndu6pfe.png"
    const [urls, setUrls] = useState([]);

    const handleFiles = (files) => {
        const file = files[0];
        //console.log("FILE NÀ", file);
        handleFileBase64(files.base64);
        handleFileUpload(null);



        setUrl(files.base64);
    };
    const handleFilesMultiple = (files) => {
        const newUrls = [];

        //console.log('new url,', files)
        for (let i = 0; i < files.base64.length; i++) {
            newUrls.push(files.base64[i]); 
        }
        //console.log('new url,', newUrls)
        setUrls([...newUrls]);
        
    };
    
    const handleFileChange = (event) => {

        const file = event.target.files[0];
        //console.log("FILE NÀ", file);
        handleFileUpload(file);
        handleFileBase64("");


        const tempUrl = URL.createObjectURL(file);
        setUrl(tempUrl);

    };

    return (
        <div className="App">
            <ReactFileReader
                fileTypes={[".png", ".jpg"]}
                base64={true}
                handleFiles={handleFiles}


            >
                <CButton color="success" style={{ width: 'fit-content', height: 'auto' }}>
                    {url ?
                        <img width={'100%'} src={url} alt="Avatar Placeholder" />
                        : 'Upload File'
                    }

                </CButton>
            </ReactFileReader>
            <img width={'30%'} src={url} alt="Avatar Placeholder" />
            <input type="file" onChange={handleFileChange} />
            <br />
            <br />
            <br />
            <br />
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
