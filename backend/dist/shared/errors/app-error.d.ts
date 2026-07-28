export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode: number, details?: unknown);
    toJSON(): {
        name: string;
        message: string;
        statusCode: number;
        details: unknown;
    };
}
export declare class InternalError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=app-error.d.ts.map