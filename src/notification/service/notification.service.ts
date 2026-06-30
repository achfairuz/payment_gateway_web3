import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}
}
