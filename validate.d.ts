import { type } from "os";

//Allowe exclusive unions, as workaround for a typescript bug, see: https://stackoverflow.com/a/52678379/5796663
type UnionKeys<T> = T extends any ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;
type StrictUnion<T> = StrictUnionHelper<T, T>

declare namespace validate {
  export interface ValidateOption {
    format?: string;
    prettify?: Function;
    fullMessages?: boolean;
  }

  export interface AsyncValidateOption {
    wrapErrors?: Function;
    prettify?: Function;
    cleanAttributes?: boolean;
  }

  export interface CollectFormValuesOption {
    nullify?: boolean;
    trim?: boolean;
  }

  export type MessageFunction = (value: any, attribute: string, validatorOptions: Constraints, attributes: any, globalOptions: ValidateOption) => string;

  interface basicCostraint {
    message?: string | MessageFunction
  }
  export interface DateTimeConstraint extends basicCostraint {
    earliest?: any;
    latest?: any;
    dateOnly?: boolean;
    parse: (value: any, options: any) => Date;
    format: (value: number, options: any) => String;
    notValid?: string;
    tooEarly?: string;
    tooLate?: string;
  }
  export interface AdvancecEqualityConstraint extends basicCostraint {
    attribute: string;
    comparator: (a: any, b: any) => boolean;
  }
  export type EmailConstraint = boolean | basicCostraint;
  export type EqualityConstraint = string | AdvancecEqualityConstraint;
  export interface EnumConstraint extends basicCostraint {
    within: any[] | {
      [index: string]: any
    }
  }
  export interface FormatConstraint extends basicCostraint {
    pattern: RegExp | string;
    flags?: string;
  }
  export interface LengthConstraint extends basicCostraint {
    is?: number;
    minimum?: number;
    maximum?: number;
  }
  type NumericalityGreaterOptions = StrictUnion<{ greaterThan?: number; } | { greaterThanOrEqualTo?: number; }>;
  type NumericalityLessOptions = StrictUnion<{ lessThan?: number; } | { lessThanOrEqualTo?: number; }>;
  interface NumericalityEqualOptions {
    equalTo?: number;
  }
  type NumericalityEvenOrOdd = StrictUnion<{ isEven?: boolean; } | { isOdd?: boolean; }>
  export type NumericalityRangeOptions = StrictUnion<NumericalityEqualOptions | (NumericalityGreaterOptions & NumericalityLessOptions)>;
  interface NumericalityBaseConstraint extends basicCostraint {
    onlyInteger?: boolean;
    strict?: boolean;
    divisibleBy?: number;
    notValid?: string;
    notInteger?: string;
    notGreaterThan?: string;
    notGreaterThanOrEqualTo?: string;
    notEqualTo?: string;
    notLessThan?: string;
    notLessThanOrEqualTo?: string;
    notDivisibleBy?: string;
    notOdd?: string;
    notEven?: string;
  }
  export type NumericalityConstraint = NumericalityBaseConstraint & NumericalityRangeOptions & NumericalityEvenOrOdd;
  export interface TypeConstraint extends basicCostraint {
    type: "array" | "integer" | "number" | "string" | "date" | "boolean";
  }
  export interface UrlConstraint extends basicCostraint {
    schemes?: string[];
    allowLocal?: boolean;
    allowDataUrl?: boolean;
  }

  type Constraint<T> = T | ConstraintFunction<T>

  export type Constraints = {
    date?: Constraint<DateTimeConstraint>;
    datetime?: Constraint<DateTimeConstraint>;
    email?: Constraint<EmailConstraint>
    equality?: Constraint<EqualityConstraint>;
    exclusion?: Constraint<EnumConstraint>;
    format?: Constraint<FormatConstraint>;
    length?: Constraint<LengthConstraint>;
    inclusion?: Constraint<EnumConstraint>;
    numericality?: Constraint<NumericalityConstraint>;
    presence?: Constraint<PresenceConstraint>;
    type?: Constraint<TypeConstraint>;
    url?: Constraint<UrlConstraint>;
  } & { [validatorName: string]: Constraint<any> }
  type PresenceConstraint = boolean | { allowEmpty: boolean };

  export type ConstraintFunction<T> = (value: any, attributes: any, attributeName: string, options: any, constraints: Schema) => T;
  export type ConstraintsFunction = (value: any, attributes: any, attributeName: string, options: any, constraints: Schema) => Constraints;

  export type Schema = { [fieldName: string]: Constraints | ConstraintsFunction };

  export interface ValidateJS {
    (attributes: any, constraints: Schema, options?: ValidateOption): { [fieldName: string]: any };
    validate(attributes: any, constraints: Schema, options?: ValidateOption): { [fieldName: string]: any };
    async(attributes: any, constraints: Schema, options?: AsyncValidateOption): Promise<{ [fieldName: string]: any }>;
    single(value: any, constraints: Constraints, options?: ValidateOption): any;

    validators: any;
    formatters: any;

    capitalize(value: string): string;
    cleanAttributes(attributes: any, whitelist: any): any;
    collectFormValues(form: any, options?: CollectFormValuesOption): any;
    contains(obj: any, value: any): boolean;
    extend(obj: any, ...otherObjects: any[]): any;
    format(str: string, vals: any): string;
    getDeepObjectValue(obj: any, keypath: string): any;
    isArray(value: any): boolean;
    isBoolean(value: any): boolean;
    isDate(value: any): boolean;
    isDefined(value: any): boolean;
    isDomElement(value: any): boolean;
    isEmpty(value: any): boolean;
    isFunction(value: any): boolean;
    isHash(value: any): boolean;
    isInteger(value: any): boolean;
    isNumber(value: any): boolean;
    isObject(value: any): boolean;
    isPromise(value: any): boolean;
    isString(value: any): boolean;
    prettify(value: string): string;
    result(value: any, ...args: any[]): any;
  }
}

declare const validate: validate.ValidateJS;
export = validate;
