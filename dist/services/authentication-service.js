export class AuthenticationService {
    static validateSession(token, currentRoute, expirationDate, disableAuth, unprotectedPaths, redirect) {
        if (disableAuth == true) {
            return redirect("authenticate") ?? true;
        }
        if (unprotectedPaths.includes(currentRoute)) {
            return redirect("not-required") ?? true;
        }
        else if (expirationDate == null || expirationDate == undefined || token == null || token == undefined) {
            return redirect("logout") ?? false;
        }
        const timeDiference = new Date(expirationDate).getTime() - new Date().getTime();
        if (!this.timeoutStarted) {
            this.timeoutStarted = true;
            setTimeout(() => {
                return redirect("logout") ?? false;
            }, timeDiference);
        }
        return redirect("authenticate") ?? true;
    }
}
AuthenticationService.timeoutStarted = false;
