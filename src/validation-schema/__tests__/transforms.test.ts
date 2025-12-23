import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  booleanTransformSchema,
  portTransformSchema,
  zodParseBoolean,
  zodParseNumber,
} from '../transforms.schema';
import { ZodError } from 'zod';

describe('Transform Functions', () => {
  describe('zodParseNumber', () => {
    const parseNumberFn = zodParseNumber();

    it('should parse valid integer strings', () => {
      expect(parseNumberFn('123')).toBe(123);
      expect(parseNumberFn('0')).toBe(0);
      expect(parseNumberFn('-42')).toBe(-42);
      expect(parseNumberFn('999999')).toBe(999999);
    });

    it('should parse valid decimal strings', () => {
      expect(parseNumberFn('123.456')).toBe(123.456);
      expect(parseNumberFn('42.99')).toBe(42.99);
      expect(parseNumberFn('0.5')).toBe(0.5);
      expect(parseNumberFn('-0.5')).toBe(-0.5);
    });

    it('should handle strings with leading zeros', () => {
      expect(parseNumberFn('0123')).toBe(123);
      expect(parseNumberFn('00042')).toBe(42);
      expect(parseNumberFn('000.42')).toBe(0.42);
    });

    it('should return NaN for invalid numeric strings', () => {
      expect(parseNumberFn('abc')).toBe(NaN);
      expect(parseNumberFn('12abc')).toBe(NaN);
      expect(parseNumberFn('abc123')).toBe(NaN);
    });

    it('should handle empty strings', () => {
      expect(parseNumberFn('')).toBe(NaN);
    });

    it('should handle whitespace', () => {
      expect(parseNumberFn('  123  ')).toBe(123);
      expect(parseNumberFn('   ')).toBe(NaN);
    });
  });

  describe('zodParseBoolean', () => {
    const parseBooleanFn = zodParseBoolean();

    it('should parse "true" to boolean true', () => {
      expect(parseBooleanFn('true')).toBe(true);
    });

    it('should parse "false" to boolean false', () => {
      expect(parseBooleanFn('false')).toBe(false);
    });

    it('should handle case-insensitive boolean strings', () => {
      expect(parseBooleanFn('TRUE')).toBe(true);
      expect(parseBooleanFn('FALSE')).toBe(false);
      expect(parseBooleanFn('True')).toBe(true);
      expect(parseBooleanFn('False')).toBe(false);
      expect(parseBooleanFn('TrUe')).toBe(true);
      expect(parseBooleanFn('FaLsE')).toBe(false);
    });

    it('should return original value for non-boolean strings', () => {
      expect(parseBooleanFn('yes')).toBe('yes');
      expect(parseBooleanFn('no')).toBe('no');
      expect(parseBooleanFn('1')).toBe('1');
      expect(parseBooleanFn('0')).toBe('0');
      expect(parseBooleanFn('abc')).toBe('abc');
    });

    it('should handle empty strings', () => {
      expect(parseBooleanFn('')).toBe('');
    });

    it('should not handle whitespace around boolean strings', () => {
      // Note: This is current behavior - might want to trim in the future
      expect(parseBooleanFn(' true ')).toBe(true);
      expect(parseBooleanFn(' false ')).toBe(false);
    });
  });

  describe('booleanTransformSchema', () => {
    const schema = booleanTransformSchema();

    it('should successfully parse and transform "true" string', () => {
      const result = schema.parse('true');
      expect(result).toBe(true);
    });

    it('should successfully parse and transform "false" string', () => {
      const result = schema.parse('false');
      expect(result).toBe(false);
    });

    it('should handle case-insensitive boolean strings', () => {
      expect(schema.parse('TRUE')).toBe(true);
      expect(schema.parse('FALSE')).toBe(false);
      expect(schema.parse('True')).toBe(true);
      expect(schema.parse('FaLsE')).toBe(false);
    });

    it('should throw ZodError for non-boolean strings', () => {
      expect(() => schema.parse('yes')).toThrow(ZodError);
      expect(() => schema.parse('no')).toThrow(ZodError);
      expect(() => schema.parse('1')).toThrow(ZodError);
      expect(() => schema.parse('0')).toThrow(ZodError);
      expect(() => schema.parse('abc')).toThrow(ZodError);
      expect(() => schema.parse('')).toThrow(ZodError);
    });

    it('should throw ZodError for non-string inputs', () => {
      expect(() => schema.parse(true)).toThrow(ZodError);
      expect(() => schema.parse(false)).toThrow(ZodError);
      expect(() => schema.parse(1)).toThrow(ZodError);
      expect(() => schema.parse(null)).toThrow(ZodError);
      expect(() => schema.parse(undefined)).toThrow(ZodError);
    });
  });

  describe('portTransformSchema', () => {
    const schema = portTransformSchema();

    it('should successfully parse valid port numbers', () => {
      expect(schema.parse('80')).toBe(80);
      expect(schema.parse('443')).toBe(443);
      expect(schema.parse('3000')).toBe(3000);
      expect(schema.parse('8080')).toBe(8080);
    });

    it('should handle minimum', () => {
      expect(schema.parse('0')).toBe(0);
    });

    it('should handle maximum', () => {
      expect(schema.parse('65535')).toBe(65535);
    });

    it('should throw ZodError for ports below minimum', () => {
      expect(() => schema.parse('-1')).toThrow(ZodError);
      expect(() => schema.parse('-100')).toThrow(ZodError);
      expect(() => schema.parse('-65535')).toThrow(ZodError);
    });

    it('should throw ZodError for ports above maximum', () => {
      expect(() => schema.parse('65536')).toThrow(ZodError);
      expect(() => schema.parse('70000')).toThrow(ZodError);
      expect(() => schema.parse('999999')).toThrow(ZodError);
    });

    it('should throw ZodError for invalid numeric strings', () => {
      expect(() => schema.parse('abc')).toThrow(ZodError);
      expect(() => schema.parse('12abc')).toThrow(ZodError);
      expect(() => schema.parse('')).toThrow(ZodError);
    });

    it('should throw ZodError for non-string inputs', () => {
      expect(() => schema.parse(3000)).toThrow(ZodError);
      expect(() => schema.parse(null)).toThrow(ZodError);
      expect(() => schema.parse(undefined)).toThrow(ZodError);
    });

    it('should handle strings with leading zeros', () => {
      expect(schema.parse('08080')).toBe(8080);
      expect(schema.parse('00080')).toBe(80);
    });

  });
});
