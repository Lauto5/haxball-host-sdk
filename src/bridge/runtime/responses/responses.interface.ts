

type typeResponse = "event" | "method";

interface Response {
  id: string;
  typeResponse: typeResponse;
  method: string;
  response: any[];
}

export type { typeResponse };
export { Response };