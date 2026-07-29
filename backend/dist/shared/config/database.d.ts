export declare const databaseConfig: {
    readonly uri: string;
    readonly connectionOptions: {
        readonly maxPoolSize: 10 | 50;
        readonly minPoolSize: 2 | 5;
        readonly serverSelectionTimeoutMS: 5000;
        readonly heartbeatFrequencyMS: 10000;
        readonly retryWrites: true;
        readonly w: "majority";
        readonly socketTimeoutMS: 45000;
        readonly connectTimeoutMS: 10000;
        readonly maxIdleTimeMS: 30000;
        readonly waitQueueTimeoutMS: 5000;
    };
};
//# sourceMappingURL=database.d.ts.map