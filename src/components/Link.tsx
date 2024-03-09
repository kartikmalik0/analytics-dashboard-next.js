"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

const Link = () => {
    const router = useRouter()
    return (
     <div className=" cursor-pointer text-3xl text-center h-screen w-full flex items-center justify-center " onClick={()=>router.push('/analytics')}>
      Go to Analytics
     </div>
    );
}

export default Link
