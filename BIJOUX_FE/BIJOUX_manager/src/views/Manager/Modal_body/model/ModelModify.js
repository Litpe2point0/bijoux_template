import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";

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
} from '@coreui/react'
import { ArrowCircleUp, CurrencyCircleDollar, ClipboardText, ListPlus, UserCirclePlus, CheckCircle } from "phosphor-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { get_account_list } from "../../../../api/accounts/Account_Api";
import MetalCard from "./widget/MetalCard";
import DiamondCard from "./widget/DiamondCard";
import UploadSingle from "./widget/UploadSingle";
import PriceCard from "./widget/PriceCard";
import InfoCard from "./widget/InfoCard";



const data = {
    "model": {
        "id": 1,
        "name": "Elegant Ring",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type": {
            "id": 2,
            "name": "ring"
        },
        "mounting_style": {
            "id": 2,
            "name": "Solitaire"
        },
        "base_width": 2.0,
        "base_height": 1.5,
        "volume": null,
        "isAvailable": 0,
        "deactivated": 0,
        "profit_rate": 25,
        "production_price": 400.00,
        "model_diamond_shape": [
            {

                "id": 1,
                "name": "Round",
                "drawing_path": "https://example.com/shapes/round.svg"

            },
            {

                "id": 5,
                "name": "Princess",
                "drawing_path": "https://example.com/shapes/princess.svg"

            }
        ],
        "model_diamond": [
            {
                "diamond_size_min": 0.5,
                "diamond_size_max": 2.0,
                "count": 1,
                "diamond_shape": {
                    "id": 1,
                    "name": "Round",
                    "drawing_path": "https://example.com/shapes/round.svg"
                },
                "is_editable": 1
            },
            {
                "diamond_size_min": 0.5,
                "diamond_size_max": 2.0,
                "count": 1,
                "diamond_shape": {
                    "id": 2,
                    "name": "Princess",
                    "drawing_path": "https://example.com/shapes/princess.svg"
                },
                "is_editable": 0
            }
        ],
        "model_metal": [
            {
                "metal": {
                    "id": 1,
                    "name": "Gold",
                    "buy_price_per_gram": 50.00,
                    "sale_price_per_gram": 60.00,
                    "imageUrl": "https://example.com/metals/gold.jpg",
                    "specific_weight": 19.32,
                    "deactivated": false,
                    "created": "2024-05-20"
                },
                "is_main": 1,
                "percentage": 90
            },
            {
                "metal": {
                    "id": 2,
                    "name": "Platinum",
                    "buy_price_per_gram": 70.00,
                    "sale_price_per_gram": 80.00,
                    "imageUrl": "https://example.com/metals/platinum.jpg",
                    "specific_weight": 21.45,
                    "deactivated": false,
                    "created": "2024-05-21"
                },
                "is_main": 0,
                "percentage": 10
            }
        ]
    }
}


const AddForm = ({ mounting_type, handleModelAdd, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    //report
    const [info, setInfo] = useState(null);
    const [shapeList, setShapeList] = useState([])

    const [imageBase64, setImageBase64] = useState(null);
    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([]);

    const [profitRate, setProfitRate] = useState(0);
    const [productionPrice, setProductionPrice] = useState(0);


    const handleSingleFileBase64 = (base64) => {
        console.log('file nè', base64)
        setImageBase64(base64)
    }
    const handleInfo = (info) => {
        console.log('info', info)
        setInfo(info)
    }
    const handleMetal = (metal_list) => {
        console.log('metal_list', metal_list)
        setMetalList([...metal_list])
    }
    const handleDiamond = (diamond_list) => {
        console.log('diamond_list', diamond_list)
        setDiamondList([...diamond_list])
    }

    const handlePrice = (profit_rate, production_price) => {
        console.log('profit rate', profit_rate)
        console.log('production price', production_price)
        setProfitRate(profit_rate);
        setProductionPrice(isNaN(production_price) ? 0 : production_price);
    }

    useEffect(() => {
        const setAttribute = async () => {
            await get_account_list();


            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleAddModel = async () => {
        await get_account_list()
        const new_model = {


            name: info.name,
            "imageUrl": imageBase64 ? imageBase64 : null,
            mounting_type_id: mounting_type.id,
            mounting_style_id: info.availableStyle.id,
            base_width: info.baseWidth,
            base_height: info.baseHeight,
            volume: info.volume,
            production_price: productionPrice,
            profit_rate: profitRate,
            model_diamond_shape: info.availableShape,
            model_diamond: diamondList,
            model_metal: metalList,
            isAvailable: false,
            deactivated: 0


        }
        console.log('new_model', new_model)
        handleModelAdd(new_model)
        // set toast
        dispatch(setToast({ color: 'success', title: 'New ' + mounting_type.name, mess: "Add successfully !" }))
        onClose();
    }
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
                                <strong>Information Form</strong> <small><ClipboardText size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >

                                    <CCol xs={12} style={{ height: 'fit-content' }}>

                                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Model Image</span>

                                            <UploadSingle defaultImage={"http://localhost:8000/image/Metal/1/main.jpg"} disabled={false} handleSingleFileBase64={handleSingleFileBase64} />

                                        </div>
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Model Information</h2>
                                </div>
                                <div className="my-4">
                                    <InfoCard handleChange={handleInfo} mounting_type={mounting_type} />
                                </div>
                                <div className="my-4">
                                    <MetalCard handleChange={handleMetal} />
                                </div>
                                <div className="my-4">
                                    <DiamondCard handleChange={handleDiamond} />
                                </div>
                                <CRow>

                                    <CCol xs={12} >

                                        <PriceCard handleChange={handlePrice} />

                                    </CCol>

                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0 || diamondList.length === 0 || info.availableShape.length < 1 || info.name.length == 0 || !info.baseWidth || !info.baseHeight || profitRate === 0 || productionPrice == null || productionPrice === 0 || isNaN(productionPrice) || (mounting_type.id == 3 && !info.volume)}
                                        onClick={() => handleAddModel()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Confirm Add <CheckCircle size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}
const UpdateForm = ({ modelInfo, mounting_type, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [model, setModel] = useState(null);
    //report
    const [info, setInfo] = useState(null);

    const [imageBase64, setImageBase64] = useState(null);
    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([]);

    const [profitRate, setProfitRate] = useState(0);
    const [productionPrice, setProductionPrice] = useState(0);


    const handleSingleFileBase64 = (base64) => {
        console.log('file nè', base64)
        setImageBase64(base64)
    }
    const handleInfo = (info) => {
        console.log('info', info)
        setInfo(info)
    }
    const handleMetal = (metal_list) => {
        console.log('metal_list', metal_list)
        setMetalList([...metal_list])
    }
    const handleDiamond = (diamond_list) => {
        console.log('diamond_list', diamond_list)
        setDiamondList([...diamond_list])
    }

    const handlePrice = (profit_rate, production_price) => {
        console.log('profit rate', profit_rate)
        console.log('production price', production_price)
        setProfitRate(profit_rate);
        setProductionPrice(isNaN(production_price) ? 0 : production_price);
    }

    useEffect(() => {
        const setAttribute = async () => {
            await get_account_list();
            // lấy id từ modelInfo để gọi model_detail
            setModel(data.model)
            console.log( 'nguuuuuuuuuuuu',data.model)



            


            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleModelUpdate = async () => {
        await get_account_list()
        const new_model = {

            id: model.id,
            name: info.name,
            "imageUrl": imageBase64 ? imageBase64 : null,
            mounting_type_id: model.mounting_type.id,
            mounting_style_id: info.availableStyle.id,
            base_width: info.baseWidth,
            base_height: info.baseHeight,
            volume: info.volume,
            production_price: productionPrice,
            profit_rate: profitRate,
            model_diamond_shape: info.availableShape,
            model_diamond: diamondList,
            model_metal: metalList,
            isAvailable: false,
            deactivated: 0


        }
        console.log('update_model', new_model)
        
        window.location.reload();

        // set toast
        dispatch(setToast({ color: 'success', title: 'Model id' + model.id, mess: "Update successfully !" }))
        onClose();
    }
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
                                <strong>Information Form</strong> <small><ClipboardText size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >

                                    <CCol xs={12} style={{ height: 'fit-content' }}>

                                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Model Image</span>

                                            <UploadSingle defaultImage={model ? model.imageUrl : "http://localhost:8000/image/Metal/1/main.jpg"} disabled={false} handleSingleFileBase64={handleSingleFileBase64} />

                                        </div>
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Model Information</h2>
                                </div>
                                <div className="my-4">
                                    <InfoCard model={model} handleChange={handleInfo}  />
                                </div>
                                <div className="my-4">
                                    <MetalCard model={model} handleChange={handleMetal} />
                                </div>
                                <div className="my-4">
                                    <DiamondCard model={model} handleChange={handleDiamond} />
                                </div>
                                <CRow>

                                    <CCol xs={12} >

                                        <PriceCard model={model} handleChange={handlePrice} />

                                    </CCol>

                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0 || diamondList.length === 0 || info.availableShape.length < 1 || info.name.length == 0 || !info.baseWidth || !info.baseHeight || profitRate === 0 || productionPrice == null || productionPrice === 0 || isNaN(productionPrice) || (model.mounting_type.id === 3 && !info.volume)}
                                        onClick={() => handleModelUpdate()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Confirm Update <CheckCircle size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}


const ModelModify = ({ type, modelInfo, mounting_type, handleModelAdd, onClose }) => {
    if (type == 'add') {
        return (
            <AddForm mounting_type={mounting_type} handleModelAdd={handleModelAdd} onClose={onClose} />
        );
    } else if (type == 'update') {
        return (
            <UpdateForm modelInfo={modelInfo} mounting_type={mounting_type} onClose={onClose} />
        );
    }


};

export default ModelModify;
