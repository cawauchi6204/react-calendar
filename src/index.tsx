import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './index.css'
import Calendar from './Calendar'
import reportWebVitals from './reportWebVitals'
import Top from './pages/Top'
import Home from './pages/Home'
import PrivateRoute from './PrivateRoute'
import { FirebaseProvider } from './firebase'
import paths from './paths'

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <Router>
        <Switch>
          <div>
            <Route exact path={paths.top} component={Top} />
            <PrivateRoute exact path={paths.home}>
              <Home />
            </PrivateRoute>
          </div>
        </Switch>
        <Calendar />
      </Router>
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals()
