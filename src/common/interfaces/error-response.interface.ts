export interface IWrappedError {
  meta: {
    status: 'error';
    statusCode: number;
    message: string;
    errors?: {
      field: string;
      messages: string[];
    }[];
  };
  data: null;
}
