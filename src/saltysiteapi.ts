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
let apiURL = 'localhost:8080';
export function setAPIUrl(url: string) {
	apiURL = url;
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

export async function getElements(): Promise<string[]> {
	return defaultElements;
}
export async function addElement(name: string) {

}
export async function removeElement(name: string) {

}
export const defaultElements = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'video',
	'img',
	'article',
	'hr',
	'br',
	'audio'
]