import { AppBar, Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
export type RouteType = {
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({ routes }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname);
        if (index < 0) {
            index = 0;
        }
        navigate(routes[index].to);

    }, [routes]);

    function onChangeFn(event: any, newValue: number) {
        setValue(newValue);
    }
    function getTabs(): ReactNode {
        return routes.map(r => <Tab component={NavLink} to={r.to} label={r.label} key={r.label}/>)
    }
    return <Box >
        <AppBar sx={{ backgroundColor: "#F4E8FF"}}>
        <Tabs value={value < routes.length ? value : 0} onChange={onChangeFn} sx={{display:'flex', justifyContent:'space-between'}} 
        variant="fullWidth" textColor='secondary' indicatorColor='secondary'>
                {getTabs()}
            </Tabs>
        </AppBar>
    </Box>
}
export default Navigator;