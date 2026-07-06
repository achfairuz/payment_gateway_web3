import { HttpException, InternalServerErrorException } from '@nestjs/common';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ResponseHelper {
  static success<T>(data: T, message = 'Success'): ApiSuccessResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(
    message = 'Internal server error',
    errors: string | string[] = [],
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      errors: ([] as string[]).concat(errors),
    };
  }

  static throwHttpError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(this.getErrorMessage(error));
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Internal server error';
  }
}
