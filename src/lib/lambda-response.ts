import type { APIGatewayProxyCallbackV2 } from "aws-lambda";

export interface CustomResponseType {
  status: number;
  body?: object | string | null;
  headers?: object;
}

export interface ResponseType {
  statusCode?: number;
  body?: string;
  headers?: object;
}

export type Response = (props: CustomResponseType) => ResponseType;

export const getResponse: Response = ({
  status,
  body,
  headers,
}: CustomResponseType) => {
  let responseBody = "";

  if (typeof body === "object") {
    responseBody = JSON.stringify(body);
  }
  if (typeof body === "string") {
    responseBody = body;
  }

  return {
    statusCode: status,
    body: responseBody,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      ...headers,
    },
  } as ResponseType;
};

export const redirectResponse = (
  callback: APIGatewayProxyCallbackV2,
  url: string
) => {
  const response = {
    statusCode: 302,
    headers: {
      Location: url,
    },
  };
  callback(null, response);
};
