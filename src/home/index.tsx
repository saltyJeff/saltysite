import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import App from '../app';
import {NavbarStates} from '../appstate';

@observer
export default class Home extends React.Component<null, null> {
	constructor(props) {
		super(props);
	}
	editPage = (pathName: string) => {
		App.appState.editPage(pathName);
	}
	render () {
		return (
			<div>
				<h1>{'Hi there '+App.appState.user.name}</h1>
				<RaisedButton onClick={() => App.appState.updatePages()} label="Send Changes To Server" />
				<RaisedButton onClick={() => App.appState.refreshPages()} label="Pull Latest Version From Server" />
				<p>Your pages</p>
				<ul>
					{
						Object.keys(App.appState.user.pages).map((pathName, index) => {
							return (<li key={index}><button onClick={() => {this.editPage(pathName)}}>{pathName}</button></li>);
						})
					}
				</ul>
			</div>
		);
	}
}
