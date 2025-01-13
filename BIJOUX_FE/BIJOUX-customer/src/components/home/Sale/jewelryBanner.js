import React from "react";
import { home_jewelry_1_img, home_jewelry_2_img, home_jewelry_3_img, home_jewelry_4_img, home_jewelry_5_img, home_jewelry_6_img } from "../../../assets/images";


export default function JewelryBanner() {
    return (
        <div className="w-full flex flex-col font-loraFont text-[#151542] items-center my-8">
            <p className="font-loraFont text-[#151542] text-3xl mb-5">Jewelry For Every Occassions</p>
            <div className="w-full grid grid-cols-6 p-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_1_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Engagement Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_2_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Wedding Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_3_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Valentine Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_4_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Pendant</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_5_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Band</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src={home_jewelry_6_img} alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Custom Jewelry</p>
                </div>
            </div>
        </div>
    );
}