import IRoute from '../Interfaces/route';
import AboutPage from '../Pages/About';
import HomePage from '../Pages/Home';
import Dashboard from '../Pages/Dashboard';
import Login from '../Pages/Login';

const routes: IRoute[] = [
    {
        path: '/',
        name: 'Home Page',
        component: HomePage,
        exact: true
    },
    {
        path: '/about',
        name: 'About Page',
        component: AboutPage,
        exact: true
    },

    {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        exact: true
    },

    {
        path: 'login',
        name: 'Login Page',
        component: Login,
        exact: true
    },

    {
        path: '/about/:number',
        name: 'About Page',
        component: AboutPage,
        exact: true
    },
]

export default routes;