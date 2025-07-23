import { CsvError } from "./csv.errors";
import { ValidResponse } from "./response";

interface Meta {
  aborted: boolean;
  cursor: number;
  delimiter: string;
  fields?: string[] | undefined;
  linebreak: string;
  renamedHeaders?: null | string[];
  truncated: boolean;
}

export interface CsvResponse extends ValidResponse {
  meta: Meta;
  errors: CsvError[];
}
