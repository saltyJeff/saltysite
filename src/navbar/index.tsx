
import * as React from 'react';
import {observer} from 'mobx-react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Link} from 'react-router-dom';
import App from '../app';
import {NavbarStates} from '../appstate';

@observer
export default class Navbar extends React.Component<null, null> {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<div>
			{App.appState.navbarState != NavbarStates.LOGIN && 
				<Toolbar> 
					<ToolbarGroup>
						<ToolbarTitle text={App.appState.user.name} />
					</ToolbarGroup>
					<ToolbarGroup>
						<FlatButton containerElement={<Link to="/home" />} label="Home" />
						<FlatButton containerElement={<Link to="/elements" />} label="Elements" />
						<ToolbarSeparator />
						{App.appState.navbarState == NavbarStates.PAGEEDIT && 
							<FlatButton containerElement={<Link to="/home" />} label="Close Editor"/>
						}
						{App.appState.navbarState == NavbarStates.PAGEEDIT && App.appState.pageDirty && 
							<FlatButton containerElement={<Link to="/home"/>} onClick={() => {App.appState.saveFunction()}} label="Save Changes"/>
						}
					</ToolbarGroup>
			</Toolbar>}
			</div>
		);
	}
}
