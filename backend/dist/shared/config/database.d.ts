export declare const databaseConfig: {
    readonly uri: string;
    readonly connectionOptions: {
        readonly maxPoolSize: 10;
        readonly minPoolSize: 2;
        readonly serverSelectionTimeoutMS: 5000;
        readonly heartbeatFrequencyMS: 10000;
        readonly retryWrites: true;
        readonly w: "majority";
    };
};
//# sourceMappingURL=database.d.ts.map