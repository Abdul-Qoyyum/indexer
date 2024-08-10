import {
  Injectable,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  UnauthorizedException,
  RequestTimeoutException,
  UnprocessableEntityException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { HttpService as BaseHttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { HttpMethods } from '../constants';

@Injectable()
export class HttpService {
  private readonly _logger = new Logger(HttpService.name);
  constructor(private readonly httpService: BaseHttpService) {}

  async send(
    method: HttpMethods,
    url: string,
    headers: any = {},
    data?: any,
  ): Promise<any> {
    try {
      let response;
      switch (method) {
        case 'get':
          response = await lastValueFrom(
            this.httpService.get(url, { headers }).pipe((data) => data),
          );
          break;
        case 'post':
          response = await lastValueFrom(
            this.httpService.post(url, data, { headers }).pipe((data) => data),
          );
          break;
        case 'delete':
          response = await lastValueFrom(
            this.httpService.delete(url, { headers }).pipe((data) => data),
          );
          break;
        case 'put':
          response = await lastValueFrom(
            this.httpService.put(url, data, { headers }).pipe((data) => data),
          );
          break;
        case 'patch':
          response = await lastValueFrom(
            this.httpService.patch(url, data, { headers }).pipe((data) => data),
          );
          break;
      }
      return response?.data;
    } catch (err) {
      return this.errorFormatter(err);
    }
  }

  private errorFormatter(err) {
    const data = !isEmpty(err?.response?.data)
      ? err?.response?.data
      : err?.data;
    const message = !isEmpty(data?.error)
      ? JSON.stringify(data.error)
      : data?.message;

    this._logger.error(message, err);
    this.formatErrorMessage(err?.response?.status, message);
  }

  formatErrorMessage(status, errorMsg) {
    switch (Number(status)) {
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(errorMsg);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(errorMsg);
      case HttpStatus.GATEWAY_TIMEOUT:
        throw new GatewayTimeoutException(errorMsg);
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(errorMsg);
      case HttpStatus.UNAUTHORIZED:
        throw new UnauthorizedException(errorMsg);
      case HttpStatus.REQUEST_TIMEOUT:
        throw new RequestTimeoutException(errorMsg);
      case HttpStatus.UNPROCESSABLE_ENTITY:
        throw new UnprocessableEntityException(errorMsg);
      default:
        throw new HttpException(errorMsg, status);
    }
  }
}
