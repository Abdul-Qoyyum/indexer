import { StatusCodes } from 'http-status-codes';

export abstract class CoreController {
  successResponse(message: string, data: any, statusCode = StatusCodes.OK) {
    return {
      message,
      success: true,
      statusCode,
      data,
    };
  }

  errorResponse(error) {
    return {
      message: error?.response?.message ?? error?.message,
      success: false,
      statusCode:
        error?.response?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}
