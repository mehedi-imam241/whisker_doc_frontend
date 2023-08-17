'use client'

import  dynamic from 'next/dynamic'
import React,{useEffect,useState} from 'react';

const PDFViewer = dynamic(()=>import('@/components/pdf'),{ssr:false})

const Page =  () => {
    return <PDFViewer/>
}

export default Page