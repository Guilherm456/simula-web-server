import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({})
export class AtLeastOneButNotBothConstraint
  implements ValidatorConstraintInterface
{
  validate(value: object[], args: ValidationArguments) {
    const [relatedPropertyNames] = args.constraints;

    if (!Array.isArray(value)) return false;

    return value?.every(
      (v) =>
        (relatedPropertyNames as string[]).filter(
          (relatedPropertyName) => !!v[relatedPropertyName],
        )?.length >= 1,
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyNames] = args.constraints;

    return `Qualquer um dos ${relatedPropertyNames.join(
      ', ',
    )} deve ser preenchido, mas não ambos`;
  }
}

export function AtLeastOneButNotBoth(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneButNotBoth',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [properties],
      validator: AtLeastOneButNotBothConstraint,
    });
  };
}
