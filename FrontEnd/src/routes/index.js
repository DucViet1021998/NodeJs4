// Layouts
// import { HeaderOnly } from '~/components/Layout';

// Pages
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Dashboard from "../Pages/DashBoard";

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/Login', component: Login },
];

const privateRoutes = [
    { path: '/Dashboard', component: Dashboard },
];

export { publicRoutes, privateRoutes };