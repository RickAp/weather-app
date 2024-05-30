import React from "react";
import LogInForm from "@/components/LogInForm/LogInForm";

const LoginPage = () => {
  return (
    <div className="flex w-full h-full py-[139px] justify-center items-center bg-gradient-to-b from-[#748BF8] to-[#9BD2DA]">
       <div className='flex flex-col w-[380px] h-full items-center bg-white rounded-lg'>
            <div className='mt-[12px]'>
                <img src="logo.jpg" alt="logo" className="w-70 h-36" />
            </div>
            <div className='mt-2'>
                <p className="font-[700]">
                    Sign In
                </p>
            </div>
            <div className='mt-[48px]'>
                <LogInForm />
            </div>
        </div>
    </div>
  );
};

export default LoginPage;