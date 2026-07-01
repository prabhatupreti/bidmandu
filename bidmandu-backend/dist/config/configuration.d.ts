declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string | undefined;
        name: string;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    storage: {
        driver: string;
        localPath: string;
        s3: {
            accessKeyId: string | undefined;
            secretAccessKey: string | undefined;
            region: string | undefined;
            bucket: string | undefined;
        };
    };
};
export default _default;
