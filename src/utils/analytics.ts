import { redis } from "@/libs/redis"
import { getDate } from "./index"
import { parse } from "date-fns"

type AnalyticsArgs = {
    retention?:number
}

type TrackOptions={
    persist?:boolean
}

export class Analytics{
    private retention = 60 * 60 * 24 * 7

    constructor(opts?:AnalyticsArgs){
        if(opts?.retention) this.retention = opts.retention
    }

    //track the data
    async track (namespace:string,event:object = {},opts?:TrackOptions) {
      let key = `analytics::${namespace}`
    
      if(!opts?.persist){
        key += `::${getDate()}`
      }
        //db call to persist this event
        await redis.hincrby(key, JSON.stringify(event),1)
        // expire the entry after 1 week
        if(!opts?.persist) await redis.expire(key,this.retention)
    }

    //retreive all the days
    async retrieveDays (namespace:string, nDays:number){
        type AnalyticsPromise = ReturnType<typeof analytics.retrieve>

        const promises : AnalyticsPromise[] = [] //promises like requests to backend for fetching the data for daya like past days here we are call retrieve function as many times

        for (let i = 0; i < nDays ; i++) {
             const formattedDate = getDate(i)
             const promise = analytics.retrieve(namespace,formattedDate) 
             promises.push(promise) // here we call retrieve function and call each time as we want the past days data 
        }

        const fetched = await Promise.all(promises)
        
        const data = fetched.sort((a,b)=>{
            if(parse(a.date,"dd/MM/yyyy",new Date()) > parse(b.date,"dd/MM/yyyy",new Date())){
                return 1
            }else{
                return -1
            }
        })
        return data

    }

    //retrieve the data 

    async retrieve (namespace:string,date:string){
         const res = await redis.hgetall<Record<string,string>>(`analytics::${namespace}::${date}`)

         return {
            date,
            events:Object.entries(res ?? []).map(([key,value])=>({
                [key] : Number(value) 
            })) 
         }
    }
}

export const analytics = new Analytics