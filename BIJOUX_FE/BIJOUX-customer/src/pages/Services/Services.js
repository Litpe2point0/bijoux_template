import React, { useEffect, useRef } from "react";
import HeadServices from "../../components/Services/head";
import ExploreCustomization from "../../components/Services/exploreCustomization";
import ExploreTemplate from "../../components/Services/exploreTemplate";
import { serivce_1_img, serivce_2_img, serivce_3_img, serivce_4_img, serivce_5_img } from "../../assets/images";

export default function Services() {

    const customizationRef = useRef(null);
    const templateRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        localStorage.removeItem("mountingType");
        localStorage.removeItem("finalProduct");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("nextStep");

    }, []);

    return (
        <>
            <div className="grid md:grid-cols-1 xs:grid-cols-1">
                <HeadServices
                    scrollToCustomization={() => scrollToSection(customizationRef)}
                    scrollToTemplate={() => scrollToSection(templateRef)}
                />
                <div className="grid grid-cols-3 m-10 gap-5">
                    <img
                        src={serivce_1_img}
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                    <img
                        src={serivce_2_img}
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                    <img
                        src={serivce_3_img}
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                </div>
                <div ref={customizationRef}>
                    <ExploreCustomization />
                </div>
                <img
                    src={serivce_4_img}
                    alt="Ảnh"
                    className="w-full h-[600px] object-cover"
                ></img>
                <div ref={templateRef}>
                    <ExploreTemplate />
                </div>
                <img
                    src={serivce_5_img}
                    alt="Ảnh"
                    className="w-full h-auto"
                ></img>
            </div>

        </>
    );
}
