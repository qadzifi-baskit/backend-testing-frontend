export type RequestMethod = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';

export type ErrorResponseData = {
  error: unknown,
  message: string,
  statusCode: number,
};

export type UploadFileResponseData = {
  url: string,
  mimeType: string,
  fileName: string,
};
