interface ApiResponse<T> {
  message?: string;
  data?: T;
  errors?: any;
}

type StatusType = 'success' | 'failed';

export class AppResponse {
  static getResponse<T>(status: StatusType, apiResponse: ApiResponse<T>) {
    return {
      status,
      message: apiResponse.message ?? 'Action completed successfully',
      data: apiResponse.data,
    };
  }
}
