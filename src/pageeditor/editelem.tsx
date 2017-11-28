import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {observer} from 'mobx-react';
import {autorun, observable, observe, IReactionDisposer, Lambda, toJS} from 'mobx';
import App from '../app';
import {PageElement} from '../saltysiteapi';
let genericSchema = require('../generic.json');
import Form from 'react-jsonschema-form';
const style = require ('./pageeditor.css');

@observer
export default class EditElem extends React.Component<{element: PageElement, index: number}, {schema: Object, open: boolean, top: number}> {
	public propAssignDisposer: IReactionDisposer;
	public highlightDisposer: Lambda;
	private jsxWebComponent: () => JSX.Element;
	private htmlWebComponent: HTMLElement;
	constructor(props) {
		super(props);
		let elem = document.createElement(this.props.element.tag);
		let schema = (elem as any).schema;
		if(!schema) {
			//assign default schemas
			schema = genericSchema;
		}
		this.jsxWebComponent =  () => React.createElement(this.props.element.tag, {
			ref: (ref) => {
				if(!this.htmlWebComponent) {
					this.htmlWebComponent = ref as HTMLElement;
				}
			}
		}, null);
		this.state = {
			schema: schema,
			open: false,
			top: 0
		}
	}
	componentDidMount () {
		this.propAssignDisposer = autorun(() => {
			this.recursiveAssignProps(this.htmlWebComponent, this.props.element.bindings);
		});
		this.highlightDisposer = observe(App.appState, "selectedElement", () => {
			this.handleHighlights();
		});
		this.htmlWebComponent.addEventListener("click", () => {
			App.appState.selectedElement = this.props.index;
		});
		App.appState.selectedElement = -1;
	}
	componentWillUnmount () {
		this.propAssignDisposer();
		this.highlightDisposer();
	}
	handleHighlights = () => {
		if(!this.props.element) return;
		let selected: boolean = this.props.index == App.appState.selectedElement;
		if(selected) {
			this.htmlWebComponent.style.border = "1px solid black";
			let top = this.htmlWebComponent.getBoundingClientRect().top;
			this.setState({open: true, top: top});
		}
		else {
			this.htmlWebComponent.style.border = "none";
			this.setState({open: false});
		}
		return selected;
	}
	render () {
		return (
			<div>
				<this.jsxWebComponent />
				<div className={style.editelem} style={{display: this.state.open ? 'block' : 'none', top: this.state.top + "px"}}>
					<div style={{display: 'flex', flexDirection: 'row'}}>
						<span>{this.props.element.tag}</span>
						<span style={{flex: 1}}></span>
					</div>
					<Form 
						schema={this.state.schema}
						formData={this.props.element.bindings}
						onChange={(evt) => {this.props.element.bindings = evt.formData; App.appState.pageDirty = true;}}
						onSubmit={(evt) => {App.appState.selectedElement = -1;}}
					/>
				</div>
			</div>
		);
	}
	recursiveAssignProps(baseObject: Object, bindings: Object) {
		for(let prop of Object.keys(bindings)) {
			if(typeof bindings[prop] == 'object' && !Array.isArray(toJS(bindings))) {
				this.recursiveAssignProps(baseObject[prop], bindings[prop]);
			}
			else if(!!bindings[prop]) {
				baseObject[prop] = bindings[prop];
			}
		}
	}
}