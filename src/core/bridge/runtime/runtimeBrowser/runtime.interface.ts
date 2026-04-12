import { Observability , ITrace} from "../../../observability";
import { RoomConfig } from "../../../../types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";
import { MethodRequest } from "../requests/methodRequest.interface";


export interface IRuntime {
  
  launchPage(
    obs: Observability,
    pageId: string,
    url: string,
    config: RoomConfig,
    trace: ITrace,
  ): Promise<void>;

  execute(request: MethodRequest , trace : ITrace): Promise<BrowserResponse>;
  
  getUrlHost(pageId: string): string;
  
  onHostDeath(callback: (pageId: string) => void): void;

  on(callback:(data: BrowserResponse) => void): void;

  closePage(pageId: string, trace: ITrace): Promise<void>;
  
  close(trace: ITrace): Promise<void>;


}
