import {useState, useEffect, useContext, useRef} from "react";
import {generateMeetID, generateUsername} from "@/root/utility";
import {UserInfo} from "@/root/fn";
import {useSearchParams} from "next/navigation";

type UserParams = {
    currentUser: UserInfo | null;
    accountType: "guest" | "host" | null;
};

export function useUserManager(): UserParams {
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
    const [accountType, setAccountType] = useState<UserParams["accountType"]>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const view = searchParams.get("view") ?? "guest";
        !acc.account() &&
        acc.account(view as UserParams["accountType"]);

        !acc.user() &&
        acc.user({
            avatar: "",
            isSpeaking: false,
            micOn: false,
            uid: generateMeetID(),
            name: generateUsername(),
        });
    }, []);

    return {currentUser, accountType};
}

class AccountManager {
    private _c_user: UserInfo | null = null
    private _ac_type: UserParams["accountType"] = null
    account = (type?: UserParams["accountType"]) => {
        if (type)
            this._ac_type = type
        return this._ac_type
    }
    user = (user?: UserInfo) => {
        if (user)
            this._c_user = user
        return this._c_user
    }
    static inst: AccountManager | null = null

    static builder() {
        if (!this.inst)
            this.inst = new AccountManager()
        return this.inst
    }
}

export const acc = AccountManager.builder()
export const useAccount = () => {
    const context = useRef(AccountManager.builder());
    if (!context.current) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context.current;
};