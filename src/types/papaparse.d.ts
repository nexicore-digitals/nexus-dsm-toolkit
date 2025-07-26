// types/papaparse.d.ts
declare namespace Papa {
  interface ParseResult<T = any> {
    data: T[];
    errors: any[];
    meta: {
      fields?: string[];
      [key: string]: any;
    };
  }

  interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean;
    skipEmptyLines?: boolean;
    [key: string]: any;
  }

  function parse<T = any>(input: string, config?: ParseConfig): ParseResult<T>;
}

declare const Papa: typeof Papa;
export = Papa;
