
interface BasePageState {
    id:string,
    type:string
    isRunning:boolean,
    isAvailable:boolean,
    minutes:number
}

interface PageStateStart extends BasePageState {
    type:"running",
    isRunning:true,
    isAvailable:true
}

interface PageStateStopped extends BasePageState {
    type:"stopped",
    isRunning:false,
    isAvailable:true
}

interface PageStateError extends BasePageState {
    type:"error",
    isRunning:false,
    isAvailable:false
}

export type pageState = PageStateStart | PageStateStopped | PageStateError