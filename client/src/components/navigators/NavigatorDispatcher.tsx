import { useTheme } from "@mui/material/styles";
import { RouteType } from "./Navigator";
import { useMediaQuery } from "@mui/material";
import Navigator from "./Navigator";
import NavigatorPortrait from "./NavigatorPortrait";
import { Outlet } from "react-router-dom";
import React from "react";

const NavigatorDispatcher: React.FC<{routes: RouteType[]}> = ({routes}) => {
    
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('md'));
    return <div>
        {!isPortrait ? <Navigator routes={routes}/> : <NavigatorPortrait routes={routes}/>}
        <Outlet></Outlet>
    </div>
}
export default NavigatorDispatcher;