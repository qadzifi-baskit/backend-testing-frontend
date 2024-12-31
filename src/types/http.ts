export type RequestMethod = 'GET'|'POST'|'PUT'|'DELETE';

export type ErrorResponseData = {
  error: unknown,
  message: string,
  statusCode: number,
};
