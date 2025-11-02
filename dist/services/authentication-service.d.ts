export type RedirectType = "authenticate" | "not-required" | "logout";
export declare class AuthenticationService {
    static timeoutStarted: boolean;
    static validateSession(token: string | undefined, currentRoute: string, expirationDate: Date, disableAuth: boolean, unprotectedPaths: string[], redirect: (event: RedirectType) => boolean | void | null | undefined): boolean;
}
