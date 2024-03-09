import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function middleware(req:NextRequest) {
    if(req.nextUrl.pathname === "/"){
        //Analytics cound when ever user visits 
        console.log("TRACK !")
        try {
            // track the data of user
            analytics.track('pageview',{
                page:'/',
                country:req.geo?.country
            })
        } catch (err) {
            //handle silently 
            console.log(err)
        }
    }
    return NextResponse.next()
}

export const matcher = {
    matcher:['/']
}