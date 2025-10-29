export declare enum GroupByOption {
    PROCEDURE_TYPE = "procedureType",
    PROFESSIONAL = "professional"
}
export declare class ProfitabilityQueryDto {
    from?: string;
    to?: string;
    groupBy?: GroupByOption;
}
export declare class DateRangeQueryDto {
    from?: string;
    to?: string;
}
