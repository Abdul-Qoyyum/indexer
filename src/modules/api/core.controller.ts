import { Logger } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

export abstract class CoreController {
  private readonly _logger = new Logger(CoreController.name);

  successResponse(message: string, data: any, statusCode = StatusCodes.OK) {
    return {
      message,
      success: true,
      statusCode,
      data,
    };
  }

  errorResponse(error) {
    this._logger.error(`Error: ${JSON.stringify(error)}`);
    return {
      message: error?.response?.message ?? error?.message,
      success: false,
      statusCode:
        error?.response?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
}
