import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import {autorun, observe, toJS, observable, Lambda} from 'mobx';
import App from '../app';
import {Page, PageElement} from '../saltysiteapi';
import EditElem from './editelem';
import ElemItem from './elemitem';
import {NavbarStates} from '../appstate';
const style = require('./pageeditor.css');

@observer
export default class PageEditor extends React.Component<{match: {params: {id: string}}}, {lastKey: number, page: Page, elements: JSX.Element[], elemItems: JSX.Element[]}> {
	private frame: HTMLDivElement;
	private addElemInput: HTMLSelectElement;
	private frameUpdater: Lambda;
	private lastDraw: number = 0;
	constructor(props) {
		super(props);
		this.lastDraw = 0;
		this.state = {
			lastKey: 0,
			elements: [],
			elemItems: [],
			page: observable(JSON.parse(JSON.stringify(toJS(App.appState.user.pages[this.props.match.params.id])))) //defensive copy
		}
		App.appState.pageDirty = false;
	}
	bindFrameUpdates = (frame: HTMLDivElement) => {
		this.frame = frame;
		this.frameUpdater = observe(this.state.page.elements, (change) => {
			this.setState({elements: this.state.page.elements.map((elem, index) => {
				let closuresSuckInJS = index; //ya damn right they do
				return (
					<EditElem element={elem} index={closuresSuckInJS} key={++this.lastDraw}/>
				)
			})});
			this.setState({elemItems: this.state.page.elements.map((elem, index) => {
				let closuresSuckInJS = index; //ya damn right they do
				return (
					<li key={++this.lastDraw}>
						<ElemItem
							element={elem}
							index={closuresSuckInJS} 
							onDelete={this.deleteElement}
							onMoveUp={this.moveElementUp}
							onMoveDown={this.moveElementDown}
						/>
					</li>
				)
			})});
		}, true);
	}
	deleteElement = (index: number) => {
		this.state.page.elements.splice(index, 1);
		App.appState.pageDirty = true;
	}
	moveElementUp = (index: number) => {
		if(index > 0) {
			let temp = this.state.page.elements[index];
			this.state.page.elements[index] = this.state.page.elements[index - 1];
			this.state.page.elements[index - 1] = temp;
		}
		App.appState.pageDirty = true;
	}
	moveElementDown = (index: number) => {
		if(index < this.state.page.elements.length - 1) {
			let temp = this.state.page.elements[index];
			this.state.page.elements[index] = this.state.page.elements[index + 1];
			this.state.page.elements[index + 1] = temp;
		}
		App.appState.pageDirty = true;
	}
	componentWillUnmount () {
		this.frameUpdater();
	}
	saveChanges = () => {
		App.appState.user.pages[this.props.match.params.id] = this.state.page;
		console.log(`Saved ${this.state.page.name}`, JSON.parse(JSON.stringify(toJS(App.appState.user.pages[this.props.match.params.id]))));
	}
	addElement = () => {
		let tag = this.addElemInput.value;
		console.log(tag);
		let elem: PageElement = observable({
			tag: tag,
			bindings: {}
		});
		if(tag != null) {
			this.state.page.elements.push(elem);
			App.appState.pageDirty = true;
		}
	}
	render () {
		App.appState.saveFunction = this.saveChanges;
		return (
			<div>
				<h1>{this.state.page.name}</h1>
				<div className={style.wrapper}>
					<div className={style.frame} ref={this.bindFrameUpdates}>
						{this.state.elements}
					</div>
				</div>
				<h3>Add new element</h3>
				<select ref={(r) => this.addElemInput = r}>
					{
						App.appState.elements.map((val, index) => {
							return (
								<option value={val} key={index}>{val}</option>
							)
						})
					}
				</select>
				<button onClick={() => this.addElement()}>Add element</button>
				<ol>
					{this.state.elemItems}
				</ol>
			</div>
		);
	}
}
