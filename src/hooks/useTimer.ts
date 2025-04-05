import { useState, useEffect, useRef } from "react"

export const useTimer = () => {

    const [duration, setDuration] = useState(0);
    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const startTimeRef = useRef(0)

    //start after ma setup yung shift  .future adjustment needed
    useEffect(() => { 
        start()

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [])

    
    function start(){
        startTimeRef.current = Date.now(); //get current time as starting point
        intervalIdRef.current = setInterval(() => {
            setDuration(Date.now() - startTimeRef.current); 
        }, 1000);
    }

    function reset(){
        if (intervalIdRef.current) { 
            clearInterval(intervalIdRef.current); 
        }

        setDuration(0);
        start();
    }

    //use this function to display timer inside of amy co.tainer 
    function formatTimer(){
    
        const pad = (number: number) => String(number).padStart(2, "0");

        const hours = pad(Math.floor(duration / (1000 * 60 * 60)));
        const minutes = pad(Math.floor((duration / (1000 * 60) % 60)));
        const seconds = pad(Math.floor((duration / (1000) % 60)));
    
        return `${hours}:${minutes}:${seconds}`;
    }

    return { start, reset, formatTimer, duration };
}