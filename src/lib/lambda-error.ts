interface Error {
  status: number;
  body?: object;
}

const ERROR_MESSAGE: { [key: number]: string } = {
  400: "BAD REQUEST",
  401: "Authorization Failure",
  403: "Forbidden",
  404: "NotFound",
  500: "Internal Server Error",
};

export const getError = (status: number, message: string | null) => {
  const body = {
    message: message || ERROR_MESSAGE[status] || "",
  };

  return {
    status,
    body,
  } as Error;
};
