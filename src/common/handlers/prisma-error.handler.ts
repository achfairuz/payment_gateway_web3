import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { ResponseHelper } from '../helpers/response.helper';

export interface PrismaErrorMessages {
  conflictMessage?: string;
  notFoundMessage?: string;
}

export class PrismaErrorHandler {
  static handle(error: unknown, messages: PrismaErrorMessages = {}): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && messages.conflictMessage) {
        throw new ConflictException(messages.conflictMessage);
      }
      if (error.code === 'P2025' && messages.notFoundMessage) {
        throw new NotFoundException(messages.notFoundMessage);
      }
    }

    ResponseHelper.throwHttpError(error);
  }
}
