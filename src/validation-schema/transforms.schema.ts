import { z } from 'zod';

export function zodParseNumber() {
  return (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return NaN;
    }
    return Number(trimmedValue);
  };
}

export function zodParseBoolean() {
  return (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.toLowerCase() === 'true') {
      return true;
    }
    if (trimmedValue.toLowerCase() === 'false') {
      return false;
    }

    return value;
  };
}

export const booleanTransformSchema = () =>
  z.string()
    .transform(zodParseBoolean())
    .pipe(z.boolean());

export const portTransformSchema = () =>
  z.string()
    .transform(zodParseNumber())
    .pipe(
      z.number()
        .int()
        .min(0)
        .max(65535),
    );
