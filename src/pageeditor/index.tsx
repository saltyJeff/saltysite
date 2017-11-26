import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {NavLink} from 'react-router-dom';
import {autorun, observe, toJS, observable} from 'mobx';
import App from '../app';
import {Page} from '../saltysiteapi';
import EditElem from './editelem';
import {NavbarStates} from '../appstate';
const style = require('./pageeditor.css');

@observer
export default class PageEditor extends React.Component<{match: {params: {id: string}}}, {elems: JSX.Element[], lastKey: number, page: Page, firstRender: boolean}> {
	public iframeDisposer;
	constructor(props) {
		super(props);
		this.state = {
			elems: [],
			lastKey: 0,
			firstRender: true,
			page: observable(JSON.parse(JSON.stringify(toJS(App.appState.user.pages[this.props.match.params.id])))) //defensive copy
		}
	}
	bindIframeUpdates = (frame: HTMLIFrameElement) => {
		this.iframeDisposer = observe(this.state.page, 'elements', () => {
			if(!frame) return;
			frame.contentDocument.body.innerHTML = "";
			let elemEditors: JSX.Element[] = [];
			let index = this.state.lastKey;
			this.state.page.elements.forEach((elem, i) => {
				if(!elem) return;
				elemEditors.push(
					<EditElem frame={frame} element={elem} key={index++} index={i}/>
				);
			});
			this.setState({elems: elemEditors, lastKey: index});
			if(this.state.firstRender) {
				App.appState.pageDirty = false;
				this.setState({firstRender: false});
			}
			else {
				App.appState.pageDirty = true;
			}
		}, true);
	}
	componentWillUnmount() {
		this.iframeDisposer();
	}
	saveChanges = () => {
		App.appState.user.pages[this.props.match.params.id] = this.state.page;
	}
	render () {
		App.appState.saveFunction = this.saveChanges;
		return (
			<div>
				<h1>{this.state.page.name}</h1>
				<div className={style.wrapper}>
					<iframe className={style.iframe} ref={this.bindIframeUpdates}>This page requires iframes</iframe>
				</div>
				{this.state.elems}
			</div>
		);
	}
}
