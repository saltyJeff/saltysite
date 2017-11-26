import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AppState, {NavbarStates} from './appstate';
import {observer} from 'mobx-react';
import {Route, Switch} from 'react-router-dom';
import {Router} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './navbar';
import Login from './login';
import PageEditor from './pageeditor';
import Home from './home';
const style = require('./app.css');

export default class App extends React.Component<null, null> {
	public static appState: AppState;
	constructor(props) {
		super(props);
		App.appState = new AppState();		
	}
	render () {
		return (
			<MuiThemeProvider>
				<Router history={App.appState.history}>
					<div className={style.wrapper}>
						<Navbar />
						<div className={style.pageBody}>
							<Route exact path="/" component={Login} />
							<Route path="/home" component={Home} />
							<Route path="/pages/:id" component={PageEditor} />
						</div>
					</div>
				</Router>
			</MuiThemeProvider>
				
		);
	}
}
