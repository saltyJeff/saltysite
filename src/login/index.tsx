import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import App from '../app';
import {NavbarStates} from '../appstate'; 

@observer
export default class Login extends React.Component<null, null> {
	constructor(props) {
		super(props);
	}
	login = () => {
		App.appState.login({username: 'saltyJeff', password: 'donuts'});
	}
	render () {
		return (
			<div>
				<h1>Bleep bloop hi server</h1>
				<button onClick={this.login}>Click here to fake log in</button>
			</div>
		);
	}
}
