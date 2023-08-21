'use client'
import React,{useEffect,useState} from 'react';
import  dynamic from 'next/dynamic'


const PDFViewer = dynamic(()=>import('@/components/pdf'),{ssr:false})

const Page =  () => {
    return <PDFViewer/>
}

export default Page