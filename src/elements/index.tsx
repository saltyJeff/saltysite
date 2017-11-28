import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import App from '../app';
const styles = require('./elements.css');

@observer
export default class Elements extends React.Component<null, {addElementTxt: string}> {
	constructor(props) {
		super(props);
		this.state = {
			addElementTxt: ''
		}
	}
	addElement = () => {
		App.appState.addElement(this.state.addElementTxt);
		this.setState({addElementTxt: ''});
	}
	delElement = (index: number) => {
		App.appState.removeElement(index);
	}
	render () {
		return (
			<div>
				<input type="text" value={this.state.addElementTxt} onChange={(e) => this.setState({addElementTxt: e.target.value})}/>
				<button onClick={this.addElement}>Add Element</button>
				<h1>All Elements</h1>
				<div className={styles.elementList}>
					{App.appState.elements.map((val, index) => {
						let closuresSuck = index;
						return (
							<div key={closuresSuck} className={styles.elementListItem}>
								<span className={styles.elementName}>{val}</span>
								<div>
									<button onClick={() => this.delElement(closuresSuck)}>X</button>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		);
	}
}
