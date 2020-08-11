import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import {LandingPage} from './pages/landing/LandingPage';
import MenuAppBar from './components/AppBar'
// import FilesPage from "./pages/files/FilesPage";
import * as serviceWorker from './serviceWorker';
import EditPage from "./pages/edit/EditPage";
import AccountPage from "./pages/account/AccountPage";

ReactDOM.render(
        <div style={{height: '100%'}}>
            <MenuAppBar />
            {/*<EditPage/>*/}
            {/*<LandingPage/>*/}
            <AccountPage/>
        </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
