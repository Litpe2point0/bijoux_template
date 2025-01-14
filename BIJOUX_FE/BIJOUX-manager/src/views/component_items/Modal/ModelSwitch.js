import React, { Children, useState } from 'react';
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
} from '@coreui/react';
import './modal.css'
import { Switch } from '@mui/material';

const Model_Switch = (props) => {
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(props.modelInfo.deactivated == 0);
    const [isAccepted, setIsAccepted] = useState(false)
    const handleClose = (result) => {
        setChecked(result)
        setVisible(false);
        setIsAccepted(true)
    };
    const handleSwitch = (e) => {
        setVisible(!visible)
        const check = e.target.checked;
        setChecked(check)
        //console.log(check)
        setVisible(true)
        setIsAccepted(false)
    }

    return (
        <>
            <Switch checked={checked} color={props.color} size="small" sx={{
                
                '& .MuiSwitch-thumb': {
                    width: 13,
                    height: 13,
                },
                '& .MuiSwitch-track': {
                    width: '100%',
                    height: 8,
                },

            }} onChange={handleSwitch} />

            <CModal size='xl' className='custom-modal' backdrop="static" visible={visible}
                onClose={() => {
                    setVisible(false);
                    if (!isAccepted) {
                        setChecked(!checked);
                        setIsAccepted(false)
                    }
                }}>
                <CModalHeader >
                    <CModalTitle>{props.title}</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    {React.isValidElement(props.children) ? React.cloneElement(props.children, { onClose: handleClose, activate: checked }) : props.children}

                </CModalBody>
            </CModal>
        </>
    )
}

export default Model_Switch