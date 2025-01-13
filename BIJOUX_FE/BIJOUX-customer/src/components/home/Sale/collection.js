import React from "react";
import { home_collection_1_img, home_collection_2_img, home_collection_3_img, home_collection_4_img } from "../../../assets/images";

export default function Collection() {
    const handleAbout = () => {
        window.location.href = "/about";
    }

    return (

        <div className="flex w-full items-center mt-10 flex-col">
            <p className="font-loraFont text-5xl text-[#151542]">Heart of the Sea</p>
            <p className="font-gantariFont text-lg text-[#151542] mb-5">Experience the collection inspired by the deep sea, an eternal beauty of nature.</p>
            <div className="grid grid-cols-12 gap-7 w-full px-10">
                <div className="col-span-5 grid grid-rows-2 gap-5">
                    <div className="flex w-full justify-end items-center">
                        <img src={home_collection_1_img} alt="" className="h-[300px] mr-10 object-cover" />
                    </div>
                    <div className="flex w-full justify-end items-center">
                        <img src={home_collection_2_img} alt="" className="h-[300px] mr-10 object-cover" />
                    </div>
                </div>

                <div className="col-span-7">
                    <img src={home_collection_3_img} alt="" className="w-[780px] h-[620px] ml-5 object-cover" />
                </div>
            </div>

            <div className="my-10 h-0.5 w-10/12 bg-[#151542]"></div>

            <div className="grid grid-cols-12">
                <div className="col-span-4 flex flex-col items-start justify-center mx-16 p-5">
                    <p className="font-loraFont text-3xl text-[#151542]">Handcrafted In Viet Nam</p>
                    <p className="font-gantariFont text-sm text-[#151542] text-start">Our highly skilled artisans exceed industry standards with sparkling GIA-graded natural diamonds, the finest-quality materials and outstanding engagement ring design at an amazing value.</p>
                    <button onClick={() => handleAbout()} className="text-gantariFont w-[226px] h-[40px] bg-[#151542] text-white font-semibold mt-2 rounded-sm hover:bg-cyan-900">About Bijoux Jewelry</button>
                </div>
                <div className="col-span-8 p-5">
                    <img src={home_collection_4_img} />
                </div>
            </div>
        </div>
    );
}