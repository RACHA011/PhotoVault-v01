// assets
import { LoginOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  LogoutOutlined
};

let isLoginEnabled = localStorage.getItem('token');

const caseLogout = [
  {
    id: 'Login',
    title: 'Login',
    type: 'item',
    url: '/login',
    icon: icons.LoginOutlined,
    target: true
  },
  {
    id: 'register',
    title: 'Register',
    type: 'item',
    url: '/register',
    icon: icons.ProfileOutlined,
    target: true
  }
];

const caseLogin = [
  {
    id: 'Logout',
    title: 'Logout',
    type: 'item',
    url: '/logout',
    icon: icons.LogoutOutlined,
    target: true
  }
];

const auth = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [!isLoginEnabled && caseLogout[0], !isLoginEnabled && caseLogout[1], isLoginEnabled && caseLogin[0]].filter(Boolean)
};

export default auth;
