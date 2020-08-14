import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {LandingPage} from "./pages/landing/LandingPage";
import MenuAppBar from './components/AppBar'
import FilesPage from "./pages/files/FilesPage";
import AccountPage from "./pages/account/AccountPage";
import EditPage from "./pages/edit/EditPage";

function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <LandingPage/>
          </Route>
          <Route path='/'>
            <BrowserRouter>
              <MenuAppBar/>
              <Route path='/files'>
                <FilesPage/>
              </Route>
              <Route path='/edit/:type/:id'>
                <EditPage/>
              </Route>
              <Route path='/account'>
                <AccountPage/>
              </Route>
            </BrowserRouter>
          </Route>
        </Switch>
      </BrowserRouter>
  );
}

export default App;
