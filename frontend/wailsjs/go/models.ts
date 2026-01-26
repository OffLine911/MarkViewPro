export namespace filemanager {
	
	export class RecentFile {
	    path: string;
	    name: string;
	    // Go type: time
	    accessedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new RecentFile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.name = source["name"];
	        this.accessedAt = this.convertValues(source["accessedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace foldermanager {
	
	export class FileNode {
	    name: string;
	    path: string;
	    isDirectory: boolean;
	    children?: FileNode[];
	
	    static createFrom(source: any = {}) {
	        return new FileNode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.isDirectory = source["isDirectory"];
	        this.children = this.convertValues(source["children"], FileNode);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace markdown {
	
	export class SearchResult {
	    line: number;
	    column: number;
	    text: string;
	    matchStart: number;
	    matchEnd: number;
	
	    static createFrom(source: any = {}) {
	        return new SearchResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.line = source["line"];
	        this.column = source["column"];
	        this.text = source["text"];
	        this.matchStart = source["matchStart"];
	        this.matchEnd = source["matchEnd"];
	    }
	}
	export class Stats {
	    words: number;
	    characters: number;
	    lines: number;
	    paragraphs: number;
	
	    static createFrom(source: any = {}) {
	        return new Stats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.words = source["words"];
	        this.characters = source["characters"];
	        this.lines = source["lines"];
	        this.paragraphs = source["paragraphs"];
	    }
	}
	export class TOCItem {
	    level: number;
	    title: string;
	    id: string;
	
	    static createFrom(source: any = {}) {
	        return new TOCItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.level = source["level"];
	        this.title = source["title"];
	        this.id = source["id"];
	    }
	}

}

export namespace settings {
	
	export class UserSettings {
	    theme: string;
	    fontSize: number;
	    fontFamily: string;
	    lineHeight: number;
	    editorTheme: string;
	    previewTheme: string;
	    autoSave: boolean;
	    autoSaveDelay: number;
	    autoReload: boolean;
	    syncScroll: boolean;
	    showLineNumbers: boolean;
	    wordWrap: boolean;
	    spellCheck: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UserSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.fontSize = source["fontSize"];
	        this.fontFamily = source["fontFamily"];
	        this.lineHeight = source["lineHeight"];
	        this.editorTheme = source["editorTheme"];
	        this.previewTheme = source["previewTheme"];
	        this.autoSave = source["autoSave"];
	        this.autoSaveDelay = source["autoSaveDelay"];
	        this.autoReload = source["autoReload"];
	        this.syncScroll = source["syncScroll"];
	        this.showLineNumbers = source["showLineNumbers"];
	        this.wordWrap = source["wordWrap"];
	        this.spellCheck = source["spellCheck"];
	    }
	}

}

