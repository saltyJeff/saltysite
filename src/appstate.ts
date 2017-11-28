import * as mobx from 'mobx';
import * as SaltySite from './saltysiteapi';
import createHistory from 'history/createHashHistory';
import {History as BrowserHistory} from 'history';
export default class AppState {
	@mobx.observable selectedElement: number;
	@mobx.observable user: SaltySite.User;
	@mobx.observable navbarState: NavbarStates;
	@mobx.observable pageDirty: boolean;
	@mobx.observable elements: string[];
	public history: BrowserHistory;
	public saveFunction: () => void;
	constructor () {
		this.elements = [];
		this.selectedElement = -1;
		this.navbarState = NavbarStates.LOGIN;
		this.pageDirty = false;
		this.history = createHistory();
		this.history.listen((e) => {
			if(e.pathname.length == 1) {
				this.navbarState = NavbarStates.LOGIN;
			}
			else if (e.pathname.indexOf('/home') == 0) {
				this.navbarState = NavbarStates.HOME;
			}
			else if (e.pathname.indexOf('/pages') == 0) {
				this.navbarState = NavbarStates.PAGEEDIT;
			}
			else if (e.pathname.indexOf('/elements') == 0) {
				this.navbarState = NavbarStates.ELEMENTS;
			}
		});
		if(this.history.location.pathname != '/login') {
			this.history.replace('/');
		}
		//debugging
		(window as any).state = this;
		SaltySite.setAPIUrl('https://localhost:8000/api/');
	}
	public async login(creds: {username: string, password: string}) {
		this.user = await SaltySite.login(creds);
		this.elements = await SaltySite.getElements();
		this.history.push('/home');
	}
	public async editPage(pathName: string) {
		if(this.user.pages[pathName] == null) {
			console.log(`Page ${pathName} is undefined, pulling latest version from server`);
			this.user.pages[pathName] = await SaltySite.loadPage(pathName);
		}
		this.history.push(`/pages/${pathName}`);
	}
	public async refreshPages() {
		let paths = Object.keys(mobx.toJS(this.user.pages));
		for(let i = 0; i < paths.length; i++) {
			let path = paths[i];
			this.user.pages[path] = await SaltySite.loadPage(path);
		};
	}
	public async updatePages() {
		Object.keys(mobx.toJS(this.user.pages)).forEach((path) => {
			SaltySite.updatePage(path, this.user.pages[path]);
		});
	}
	public async updatePage(path: string) {
		SaltySite.updatePage(path, this.user.pages[path]);
	}
	public async refreshPage(path: string) {
		this.user.pages[path] = await SaltySite.loadPage(path);
	}
	public async addElement(name: string) {
		await SaltySite.addElement(name);
		this.elements.push(name);
	}
	public async removeElement(index: number) {
		await SaltySite.removeElement(this.elements[index]);
		this.elements.splice(index, 1);
	}
}
export enum NavbarStates {
	LOGIN,
	HOME,
	PAGEEDIT,
	ELEMENTS
}