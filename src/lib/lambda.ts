import type {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  APIGatewayProxyCallbackV2,
} from "aws-lambda";

import { getResponse, ResponseType, Response } from "./lambda-response";
import { getError } from "./lambda-error";

export interface Request {
  headers?: any;
  params?: any;
  query?: any;
  body?: any;
  event: APIGatewayEvent;
  callback: APIGatewayProxyCallback;
}

export const createGatewayHandler = (
  handler: (
    req: Request,
    res: Response,
    ...args: Array<any>
  ) => Promise<ResponseType>
) => {
  return async (
    event: APIGatewayEvent,
    _,
    callback: APIGatewayProxyCallback
  ) => {
    const { body, headers, pathParameters, queryStringParameters } = event;
    const parsedBody = parseBody(body);

    const req = {
      params: pathParameters,
      query: queryStringParameters,
      body: parsedBody,
      headers,
      event,
      callback,
    } as Request;
    const res = getResponse;

    try {
      // console.log(`Request`, {
      //   params: req.params,
      //   query: req.query,
      //   body: req.body,
      //   headers: req.headers,
      // });

      const response = await handler(req, res);
      return response;
    } catch (error) {
      const { status = 404, body } = getError(error?.status, error?.message);
      console.log(`Lambda Error`, error);

      return getResponse({
        status,
        body,
      });
    }
  };
};

const parseBody = (body) => {
  try {
    return JSON.parse(body || "{}");
  } catch (error) {
    return {};
  }
};
