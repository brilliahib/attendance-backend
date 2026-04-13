export interface IWrappedResponse<T> {
  meta: {
    status: 'success' | 'error';
    statusCode: number;
    message: string;
  };
  data: T | null;
}
