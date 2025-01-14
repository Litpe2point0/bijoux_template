import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CCard,
    CCardBody,
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
    CFormInput,
} from '@coreui/react'
import { ArrowCircleUp, CurrencyCircleDollar, ClipboardText, ListPlus, UserCirclePlus, CheckCircle } from "phosphor-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import MetalCard from "./widget/MetalCard";
import DiamondCard from "./widget/DiamondCard";
import UploadSingle from "./widget/UploadSingle";
import ModelDetailCard from "./widget/ModelDetailCard";
import ShapeCard from "../../../component_items/miniCard/items";
import MainUpload from "./MainUpload";
import RelatedUpload from "./RelatedUpload";
import { get } from "jquery";
import { get_missing_image, get_model_detail, set_available_model } from "../../../../api/main/items/Model_api";

const state_creator = (table, handleMainUpload, handleRelatedUpload) => {
    const state = {
        columnDefs: [
            {
                headerName: "Metal 1",
                field: "metal_1.name",
                cellRenderer: (params) => {
                    return (
                        <div className="d-flex align-items-center">
                            <img className="rounded-3" width={'30px'} src={params.data.metal_1.imageUrl} />
                            <span className="text-dark ms-2">{params.data.metal_1.name}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Metal 2",
                field: "metal_2.name",
                cellRenderer: (params) => {
                    return (
                        <div className="d-flex align-items-center">
                            <img className="rounded-3" width={'30px'} src={params.data.metal_2 && params.data.metal_2.imageUrl} />
                            <span className="text-dark ms-2">{params.data.metal_2 ? params.data.metal_2.name : 'X'}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Shape",
                field: "diamond_shape.name",
                cellRenderer: (params) => {
                    return (
                        <span className="bg-light rounded h-auto text-dark p-2" style={{ height: '100%', fontSize: 'small' }}>
                            <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="20" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={params.data.diamond_shape.drawing_path} />
                            </svg>
                            {params.data.diamond_shape.name}</span>
                    )

                },
            },
            {
                flex: 1.5,
                filter: false,
                headerName: "Image Sets",
                cellClass: 'd-flex align-items-center py-1',
                cellRenderer: (params) => {
                    //console.log('params', params)
                    return (
                        <CRow className="d-flex ">
                            <CCol xs={12}>
                                <MainUpload key={`main-${params.rowIndex}`} handleMainUpload={handleMainUpload} rowIndex={params.rowIndex} />

                            </CCol>
                            <CCol xs={12}>
                                <RelatedUpload key={`main-${params.rowIndex}`} handleRelatedUpload={handleRelatedUpload} rowIndex={params.rowIndex} />

                            </CCol>

                        </CRow>
                    )
                }
            },

        ],
        rowData: table,


    }
    return state
}

const CustomForm = ({ modelInfo, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [model, setModel] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    const [state, setState] = useState(null);
    //report
    const [mainImages, setMainImages] = useState([]);
    const [relatedImages, setRelatedImages] = useState([]);



    const handleMainUpload = (index, base64) => {
        setMainImages((prev) => {
            const updatedImages = prev.filter(img => img.index !== index);
            return [...updatedImages, { index: index, main_image: base64 }];
        });
    };

    const handleRelatedUpload = (index, base64) => {
        setRelatedImages((prev) => {
            const updatedImages = prev.filter(img => img.index !== index);
            return [...updatedImages, { index: index, related_image: base64 }];
        });
    };

    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append('model_id', JSON.stringify(modelInfo.id));
            const data_detail = await get_missing_image(formData);
            const model_detail = data_detail.data
            setModel(model_detail.model)

            //console.log("ẢNH THIẾU", model_detail.missing_image)
            setState(state_creator(model_detail.missing_image, handleMainUpload, handleRelatedUpload))
            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleModelComplete = async () => {
        await get_account_list()
        const new_model = {


        }
        //console.log('update_model', new_model)

        window.location.reload();
        // set toast
        dispatch(setToast({ color: 'success', title: 'Model id' + model.id, mess: "Add successfully !" }))
        onClose();
    }

    const defaultColDef = useMemo(() => {
        return {
            flex: 0.5,
            filter: true,
            autoHeight: true,
            wrapText: true,
            cellClass: 'd-flex align-items-center',
        };
    }, [])
    const onGridReady = (type) => (params) => {
        if (type === 'customize') {
            setGridApi(params.api);
        }
    };

    const handleSubmit = async () => {
        setUploadLoading(true); 
        const image_list = [];
        gridApi.forEachNode((node) => {

            const rowData = node.data;
            // console.log('row data', rowData)

            // const imageArray = [rowData.metal_1.imageUrl, rowData.metal_2.imageUrl]; 
            //console.log('ẢNH MAINNNNNNN', mainImages)
            const main_image = mainImages.find((item) => item.index == node.rowIndex).main_image;
            const related_image = relatedImages.find((item) => item.index == node.rowIndex).related_image;

            const newRowData = {
                metal_1_id: rowData.metal_1.id,
                metal_2_id: rowData.metal_2 ? rowData.metal_2.id : null,
                diamond_shape_id: rowData.diamond_shape.id,
                main_image: main_image,
                related_image: related_image
            };

            image_list.push(newRowData);
        });

        //image_list([...rowData, ...newData]);
        //console.log('OH SHIT BRO', image_list)

        const set_available = {
            model_id: modelInfo.id,
            image_list: image_list
        }

        const formData = new FormData();
        formData.append('set_available', JSON.stringify(set_available));
        const response = await set_available_model(formData, 'Model ID ' + modelInfo.id);

        if (response.success) {
            window.location.reload();
        }
        dispatch(setToast(response.mess))
        setUploadLoading(false)

    };
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    {loading ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>Fill Form</strong> <small><ClipboardText size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >

                                    <CCol md={6} style={{ height: 'fit-content' }}>

                                        <div className="d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Base Image</span>

                                            <UploadSingle defaultImage={model ? model.imageUrl : process.env.REACT_APP_BACKEND_IMAGE_URL + "/Metal/1/main.jpg"} disabled={true} />

                                        </div>
                                    </CCol>
                                    <CCol md={6} >
                                        <ModelDetailCard title={'MODEL INFORMATION'} model={model} />
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Fill All Image Set  <span className="text-danger">(*required)</span></h2>
                                </div>
                                <div className="my-4 ag-theme-quartz"  >

                                    <AgGridReact
                                        enableColResize={true}
                                        columnDefs={state.columnDefs}
                                        rowData={state.rowData}
                                        defaultColDef={defaultColDef}
                                        rowHeight={35}
                                        headerHeight={30}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady('customize')}
                                    />
                                </div>

                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={uploadLoading || mainImages.length != state.rowData.length || relatedImages.length != state.rowData.length}
                                        onClick={()=>handleSubmit()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        {uploadLoading ?
                                            <CSpinner as="span" size="sm" aria-hidden="true" />
                                            :
                                            <>
                                                Upload All Image Set <CheckCircle size={30} color="lime" weight="duotone" />

                                            </>
                                        }
                                    </Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}

const ModelComplete = ({ modelInfo, onClose }) => {

    return (
        <CustomForm modelInfo={modelInfo} onClose={onClose} />
    );

};

export default ModelComplete;

