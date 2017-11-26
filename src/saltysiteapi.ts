export interface PageElement {
	tag: string;
	bindings: {
		[key: string]: string;
	}
}
export interface Page {
	name: string;
	elements: PageElement[]
}
export interface User {
	name: string;
	pages: {
		[key: string]: Page;
	}
}
//methods
export async function login (creds: {username: string, password: string}): Promise<User> {
	return {
		name: 'saltyJeff',
		pages: {
			'demo': null,
			'notTheDemo': null
		}
	}
}
export async function loadPage(pathName: string): Promise<Page> {
	if(pathName == 'demo') {
		return {
			name: "salty demo page",
			elements: [
				{
					tag: "span",
					bindings: {
						"textContent": "im salty bruh"
					}
				},
				{
					tag: "h1",
					bindings: {
						"textContent": "i'm beautiful"
					}
				}
			]
		}
	}
	return null;
}
export async function updatePage(pathName: string, newPage: Page) {
	if(pathName == 'demo') {
		return '200';
	}
	return '404';
}