export declare class AppError extends Error {
    readonly statusCode: number;
    isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode: number, details?: unknown, isOperational?: boolean);
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