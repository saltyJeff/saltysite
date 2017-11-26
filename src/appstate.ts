import * as mobx from 'mobx';
import * as SaltySite from './saltysiteapi';
import createHistory from 'history/createHashHistory';
import {History as BrowserHistory} from 'history';
export default class AppState {
	@mobx.observable selectedElement: number;
	@mobx.observable user: SaltySite.User;
	@mobx.observable navbarState: NavbarStates;
	@mobx.observable pageDirty: boolean;
	public history: BrowserHistory;
	public saveFunction: () => void;
	constructor () {
		this.selectedElement = -1;
		//expose for EZ debugs
		(window as any).appstate = this;
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
		});
		if(this.history.location.pathname != '/login') {
			this.history.replace('/');
		}
		//debugging
		(window as any).state = this;
	}
	public async login(creds: {username: string, password: string}) {
		this.user = await SaltySite.login(creds);
		this.history.push('/home');
	}
	public async editPage(pathName: string) {
		if(this.user.pages[pathName] == null) {
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
}

export enum NavbarStates {
	LOGIN,
	HOME,
	PAGEEDIT,
}