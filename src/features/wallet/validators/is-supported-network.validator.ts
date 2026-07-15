import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const SUPPORTED_NETWORKS = ['ethereum', 'polygon'];

@ValidatorConstraint({ name: 'IsSupportedNetwork', async: false })
class IsSupportedNetworkConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && SUPPORTED_NETWORKS.includes(value.toLowerCase());
  }

  defaultMessage(): string {
    return `network must be one of: ${SUPPORTED_NETWORKS.join(', ')}`;
  }
}

export function IsSupportedNetwork(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSupportedNetworkConstraint,
    });
  };
}
