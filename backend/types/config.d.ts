declare module 'config' {
    const config: {
        get: <T = any>(key: string) => T;
    };
    export default config;
}
