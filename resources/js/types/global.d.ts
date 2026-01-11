declare global {
    interface Window {
        Ziggy?: {
            url: string;
            port: number | null;
            defaults: Record<string, any>;
            routes: Record<string, any>;
        };
    }

    function route(
        name?: string,
        params?: Record<string, any> | any[] | string | number,
        absolute?: boolean
    ): string;

    interface Route {
        (
            name?: string,
            params?: Record<string, any> | any[] | string | number,
            absolute?: boolean
        ): string;
        has(name: string): boolean;
        current(name?: string, params?: Record<string, any>): boolean;
    }
}

export {};

