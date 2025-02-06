export type RequestMethod = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';

export type ErrorResponseData = {
  error: unknown,
  message: string,
  statusCode: number,
};
