import type { Metadata } from "next";

export const metadata:Metadata={
title:"LuxeMarket Product",
description:"Experimental marketplace product page",
robots:{index:false,follow:false,nocache:true},
};

export default function ExperimentLayout({children}:{children:React.ReactNode}){return children}
