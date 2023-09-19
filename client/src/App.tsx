import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Alert, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import SignIn from '../src/components/pages/SignIn';
import SignOut from "../src/components/pages/SignOut";
import NotFound from "../src/components/pages/NotFound";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { RouteType } from "./components/navigators/Navigator";
import { useDispatch } from "react-redux";
import { authActions } from "./redux/slices/authSlice";
import { codeActions } from "./redux/slices/codeSlice";
import routesConfig from './config/routes-config.json';
import Home from "./components/pages/Home";
import UserData from "./components/model/UserData";
import { StatusType } from "./components/model/StatusType";
import CodeType from "./components/model/CodeType";
import { purple } from "@mui/material/colors";

const { always, authenticated, noauthenticated } = routesConfig;

const theme = createTheme({
  palette: {
    primary: {
      main: purple[900],
    },
  },
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#BA68C8",
          fontWeight: 'bold'
        }
      }
    },
  }
});

type RouteTypeOrder = RouteType & { order?: number }
function getRoutes(userData: UserData): RouteType[] {
  const res: RouteTypeOrder[] = [];
  res.push(...always);
  if (userData) {
    res.push(...authenticated);
  } else {
    res.push(...noauthenticated);
  }
  res.sort((r1, r2) => {
    let res = 0;
    if (r1.order && r2.order) {
      res = r1.order - r2.order;
    }
    return res
  });
  if (userData) {
    res[res.length - 1].label = userData.username;
  }

  return res
}
const App: React.FC = () => {
  const userData = useSelectorAuth();
  const code = useSelectorCode();
  const dispatch = useDispatch<any>();

  const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
  const routes = useMemo(() => getRoutes(userData), [userData]);

  function codeProcessing(): [string, StatusType] {
    const res: [string, StatusType] = [code.message, 'success'];
    switch (code.code) {
      case CodeType.OK: res[1] = 'success'; break;
      case CodeType.SERVER_ERROR: res[1] = 'error'; break;
      case CodeType.UNKNOWN: res[1] = 'error'; break;
    }

    return res;
  }
  return <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signout" element={<SignOut />} />
          <Route path="/*" element={<NotFound />} />

        </Route>
      </Routes>
      <Snackbar open={!!alertMessage} autoHideDuration={10000}
        onClose={() => dispatch(codeActions.reset())}>
        <Alert onClose={() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  </ThemeProvider>
}
export default App;
