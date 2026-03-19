import { typeResponse } from "./responses.interface";

export interface BrowserResponse {
  typeResponse: typeResponse;
  method: string;
  response: any[];
}