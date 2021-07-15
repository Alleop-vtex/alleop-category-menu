import React, { FC } from "react";
import { AuthService, AuthState } from "vtex.react-vtexid";
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
    'logoutWrapper',
    'logout'
] as const 

const Logout:FC = () => {
    const handles = useCssHandles(CSS_HANDLES)
    return(
        <AuthState skip scope="STORE">
            <AuthService.RedirectLogout returnUrl="/">
                {({action : logout}: any) => (
                    <div className={handles.handles.logoutWrapper}>
                        <div onClick={logout} className={handles.handles.logout}>
                            Logout
                        </div>
                    </div>
                )}
            </AuthService.RedirectLogout>
        </AuthState>
    )
}
export default Logout