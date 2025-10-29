import { ParseResult } from "papaparse";
import type {
    CsvParsedFileMeta,
    JsonParsedFileMeta,
    ParsedFileMeta,
} from "../types/meta.js";

/**
 * A builder class for creating detailed, format-specific metadata objects.
 * This class uses a fluent interface (chaining methods) to construct either a
 * `CsvParsedFileMeta` or a `JsonParsedFileMeta` object.
 */
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

    /**
     * Initializes the builder with base, format-agnostic metadata.
     * @param source - The origin of the file (e.g., filename or "string-input").
     * @param fields - The extracted headers or keys.
     * @param rowCount - The total number of data rows.
     * @returns A new instance of the builder.
     */
    static init(
        source: string,
        fields: string[],
        rowCount: number,
        format: ParsedFileMeta["format"]
    ): ParsedFileMetaBuilder {
        const builder = new ParsedFileMetaBuilder();
        builder.base.source = source;
        builder.base.fields = fields;
        builder.base.rowCount = rowCount;
        builder.base.format = format;
        return builder;
    }

    /**
     * Attaches CSV-specific validation flags to the metadata.
     * @param flags - An object containing boolean flags for CSV validation checks.
     * @returns The builder instance for chaining.
     */
    withCsvFlags(flags: CsvParsedFileMeta["validationFlags"]): this {
        this.csvFlags = flags;
        return this;
    }

    /**
     * Attaches JSON-specific validation flags to the metadata.
     * @param flags - An object containing boolean flags for JSON validation checks.
     * @returns The builder instance for chaining.
     */
    withJsonFlags(flags: JsonParsedFileMeta["validationFlags"]): this {
        this.jsonFlags = flags;
        return this;
    }

    /**
     * Attaches extra CSV-specific properties like delimiter and encoding.
     * @param extras - An object with additional CSV properties.
     * @returns The builder instance for chaining.
     */
    withCsvExtras(
        extras: Pick<CsvParsedFileMeta, "delimiter" | "quoteChar" | "encoding">
    ): this {
        this.csvExtras = extras;
        return this;
    }

    /**
     * Attaches extra JSON-specific properties like structure type and nesting depth.
     * @param extras - An object with additional JSON properties.
     * @returns The builder instance for chaining.
     */
    withJsonExtras(
        extras: Pick<JsonParsedFileMeta, "structureType" | "nestingDepth">
    ): this {
        this.jsonExtras = extras;
        return this;
    }

    /**
     * Attaches diagnostic information, such as warnings and error codes.
     * @param diagnostics - An object containing arrays of diagnostic messages.
     * @returns The builder instance for chaining.
     */
    withDiagnostics(diagnostics: ParsedFileMeta["diagnostics"]): this {
        this.base.diagnostics = diagnostics;
        return this;
    }

    /**
     * Builds the final `CsvParsedFileMeta` object.
     * This method combines the base info with CSV-specific flags and extras,
     * and calculates the `eligibleForConversion` property.
     * @throws Will throw an error if CSV flags or extras have not been provided.
     * @returns The complete CSV metadata object.
     */
    buildCsv(): CsvParsedFileMeta {
        if (!this.csvFlags || !this.csvExtras) {
            throw new Error("Missing CSV flags or extras");
        }

        return {
            ...this.base,
            format: this.csvExtras.delimiter === "\t" ? "tsv" : "csv",
            ...this.csvExtras,
            validationFlags: this.csvFlags,
            eligibleForConversion:
                this.csvFlags.hasHeaders &&
                this.csvFlags.hasBalancedQuotes &&
                this.csvFlags.hasValidRows,
        } as CsvParsedFileMeta;
    }

    /**
     * Builds the final `JsonParsedFileMeta` object.
     * This method combines the base info with JSON-specific flags and extras,
     * and calculates the `eligibleForConversion` property.
     * @throws Will throw an error if JSON flags or extras have not been provided.
     * @returns The complete JSON metadata object.
     */
    buildJson(): JsonParsedFileMeta {
        if (!this.jsonFlags || !this.jsonExtras) {
            throw new Error("Missing JSON flags or extras");
        }

        return {
            ...this.base,
            format: "json",
            ...this.jsonExtras,
            validationFlags: this.jsonFlags,
            eligibleForConversion:
                this.jsonFlags.isArrayOfObjects &&
                this.jsonFlags.hasConsistentKeys &&
                this.jsonFlags.hasValidRows,
        } as JsonParsedFileMeta;
    }

    /**
     * A static factory method to create a `CsvParsedFileMeta` object directly
     * from a PapaParse result.
     * @param params - An object containing the source, PapaParse result, and other details.
     */
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

        return ParsedFileMetaBuilder.init(
            source,
            fields,
            rowCount,
            result.meta.delimiter === "\t" ? "tsv" : "csv" // Centralized format detection
        )
            .withCsvFlags(validationFlags)
            .withCsvExtras({
                delimiter: result.meta.delimiter ?? ",",
                encoding,
            })
            .withDiagnostics(diagnostics)
            .buildCsv();
    }
}
