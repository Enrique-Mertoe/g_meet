import {Closure} from "@/root/GTypes";
import {api} from "@/root/apiHandler/ApiHandler";
import {NextRequest} from "next/server";

type Provider = {
    init: Closure
}

function AppProvider(): Provider {
    return {
        init(req: NextRequest) {
            api.app.initApp(req)
        }
    }
}

export default AppProvider()