import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CCard,
} from '@coreui/react'



export const quote_status_creator = (status) => {
    if (status.id == 1) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%'}}
                className={` text-center px-3 fw-bold rounded-pill px-1  bg-secondary`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 2) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-info`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 3) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-warning`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 4) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-success`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 5) {
        return (
            <CCard
                textColor="light"
                style={{ width: '60px' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-danger fs-5`}>
                {status.title}
            </CCard>
        )
    }
}
export const order_status_creator = (status) => {
    if (status.id == 1) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%'}}
                className={` text-center px-3 fw-bold rounded-pill px-1  bg-secondary`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 2) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-info`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 3) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-warning`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 4) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-success`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 5) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-primary`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 6) {
        return (
            <CCard
                textColor="light"
                style={{ width: '60px' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-danger fs-5`}>
                {status.title}
            </CCard>
        )
    }
}
export const design_process_status_creator = (status) => {
    if (status.id == 1) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%'}}
                className={` text-center px-3 fw-bold rounded-pill px-1  bg-secondary`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 2) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-warning`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 3) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-success`}>
                {status.name}
            </CCard>
        )
    }
    if (status.id == 4) {
        return (
            <CCard
                textColor="light"
                style={{ width: '100%' }}
                className={` text-center px-3 fw-bold rounded-pill px-1 bg-danger`}>
                {status.name}
            </CCard>
        )
    }
}