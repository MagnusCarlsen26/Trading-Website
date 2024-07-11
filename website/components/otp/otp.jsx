"use client"

import axios from "axios"
import React , { useState } from "react"

export default function CheckOtp() {

    const [otp,setOtp] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/api/auth/otp",{
                otp,
                sessionId : "1febd9b5924744d7855f9b4f01bd3114",
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            OTP
                        </div>
                    </div>
                    <div className="pt-2">
                        <LabelledInput label="OTP" placeholder="OTP" onChange={(e) => setOtp(prev => e.target.value)}/>
                        <button type="button" className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </a>
        </div>
    </div>
}

function LabelledInput({ label, placeholder, type ,onChange}) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required onChange={onChange}/>
    </div>
}