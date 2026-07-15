import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '@auth/interfaces/auth.interfaces';
import { MerchantService } from '../service/merchant.service';

@Injectable()
export class MerchantOwnershipGuard implements CanActivate {
  constructor(private readonly merchantService: MerchantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest & { params: { merchantId: string } }>();

    await this.merchantService.verifyOwnership(request.params.merchantId, request.user.id);
    return true;
  }
}
