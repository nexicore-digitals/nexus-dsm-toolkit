import { ParseResult } from "papaparse";
import type {
    CsvParsedFileMeta,
    JsonParsedFileMeta,
    ParsedFileMeta,
} from "../types/meta.js";

export class ParsedFileMetaBuilder {
    private base: Partial<ParsedFileMeta> = {
        createdAt: new Date().toISOString(),
    };

    private csvFlags?: CsvParsedFileMeta["validationFlags"];
    private jsonFlags?: JsonParsedFileMeta["validationFlags"];
    private csvExtras?: Pick<
        CsvParsedFileMeta,
        "delimiter" | "quoteChar" | "encoding"
    >;
    private jsonExtras?: Pick<
        JsonParsedFileMeta,
        "structureType" | "nestingDepth"
    >;

    static init(
        source: string,
        fields: string[],
        rowCount: number
    ): ParsedFileMetaBuilder {
        const builder = new ParsedFileMetaBuilder();
        builder.base.source = source;
        builder.base.fields = fields;
        builder.base.rowCount = rowCount;
        return builder;
    }

    withCsvFlags(flags: CsvParsedFileMeta["validationFlags"]): this {
        this.csvFlags = flags;
        return this;
    }

    withJsonFlags(flags: JsonParsedFileMeta["validationFlags"]): this {
        this.jsonFlags = flags;
        return this;
    }

    withCsvExtras(
        extras: Pick<CsvParsedFileMeta, "delimiter" | "quoteChar" | "encoding">
    ): this {
        this.csvExtras = extras;
        return this;
    }

    withJsonExtras(
        extras: Pick<JsonParsedFileMeta, "structureType" | "nestingDepth">
    ): this {
        this.jsonExtras = extras;
        return this;
    }

    withDiagnostics(diagnostics: ParsedFileMeta["diagnostics"]): this {
        this.base.diagnostics = diagnostics;
        return this;
    }

    buildCsv(): CsvParsedFileMeta {
        if (!this.csvFlags || !this.csvExtras) {
            throw new Error("Missing CSV flags or extras");
        }

        return {
            ...this.base,
            ...this.csvExtras,
            validationFlags: this.csvFlags,
            eligibleForConversion:
                this.csvFlags.hasHeaders &&
                this.csvFlags.hasBalancedQuotes &&
                this.csvFlags.hasValidRows,
        } as CsvParsedFileMeta;
    }

    buildJson(): JsonParsedFileMeta {
        if (!this.jsonFlags || !this.jsonExtras) {
            throw new Error("Missing JSON flags or extras");
        }

        return {
            ...this.base,
            ...this.jsonExtras,
            validationFlags: this.jsonFlags,
            eligibleForConversion:
                this.jsonFlags.isArrayOfObjects &&
                this.jsonFlags.hasConsistentKeys &&
                this.jsonFlags.hasValidRows,
        } as JsonParsedFileMeta;
    }

    static fromPapaResult(params: {
        source: string;
        result: ParseResult<unknown>;
        validationFlags: CsvParsedFileMeta["validationFlags"];
        encoding?: string;
        diagnostics?: ParsedFileMeta["diagnostics"];
    }): CsvParsedFileMeta {
        const { source, result, validationFlags, encoding, diagnostics } =
            params;
        const fields = result.meta.fields ?? [];
        const rowCount = Array.isArray(result.data) ? result.data.length : 0;

        return ParsedFileMetaBuilder.init(source, fields, rowCount)
            .withCsvFlags(validationFlags)
            .withCsvExtras({
                delimiter: result.meta.delimiter ?? ",",
                encoding,
            })
            .withDiagnostics(diagnostics)
            .buildCsv();
    }
}
