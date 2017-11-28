import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import App from '../app';
import {NavbarStates} from '../appstate';
import {PageElement} from '../saltysiteapi';

@observer
export default class ElemItem extends React.Component<{index: number,
		element: PageElement,
		onDelete: (index: number) => void,
		onMoveUp: (index: number) => void,
		onMoveDown: (index: number) => void},
	null> {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<div>
				<p>{this.props.element.tag}</p>
				<div>
					<button onClick={() => App.appState.selectedElement = this.props.index}>GOTO</button>
					<button onClick={() => this.props.onDelete(this.props.index)}>X</button>
					<button onClick={() => this.props.onMoveUp(this.props.index)}>^</button>
					<button onClick={() => this.props.onMoveDown(this.props.index)}>V</button>
				</div>
			</div>
		);
	}
}
