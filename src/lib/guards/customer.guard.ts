import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CustomerService } from 'src/customer/customer.service';
import { AppResponse, CustomerRequest } from 'src/lib';

@Injectable()
export class CustomerTokenGuard implements CanActivate {
  constructor(private readonly customerService: CustomerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomerRequest>();
    const token = (request.headers['x-customer-token'] ||
      request.headers['X-Customer-Token']) as string | undefined;

    if (!token) {
      throw new UnauthorizedException(
        AppResponse.getFailedResponse('Missing customer token'),
      );
    }

    try {
      request.customer = await this.customerService.getCustomer(token);
      return true;
    } catch (err) {
      const message = (err as Error)?.message;

      throw new UnauthorizedException(
        AppResponse.getFailedResponse(message ?? 'Missing customer token'),
      );
    }
  }
}
