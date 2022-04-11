
export interface ModernDeckSettingsTab {
	tabName: string;
	tabId?: string;
	options: {[key: string]: ModernDeckSettingsOption};
	enum?: string;
	enabled?: boolean | (() => boolean);
}

export enum ModernDeckSettingsType {
	CHECKBOX = "checkbox",
	DROPDOWN = "dropdown",
	SLIDER = "slider",
	TEXTBOX = "textbox",
	TEXTAREA = "textarea",
	BUTTON = "button",
	BUTTONS = "buttons",
	LINK = "link",
	ARRAY = "array",
	SUBTEXT = "subtext",
}

export interface ModernDeckSettingsActions {
	enableStylesheet?: string,
	disableStylesheet?: string,
	htmlAddClass?: string,
	htmlRemoveClass?: string,
	func?: Function
}

export interface ModernDeckSettingsSuboption {
	value?: string;
	text?: string;
	name?: string;
	children?: {[key: string]: ModernDeckSettingsSuboption};
}

export interface ModernDeckSettingsButton {
	text: string;
	func: Function;
}

export interface ModernDeckSettingsOption {
	type: ModernDeckSettingsType;
	activate?: ModernDeckSettingsActions;
	deactivate?: ModernDeckSettingsActions;
	headerBefore?: string;
	addClass?: string;
	title?: string;
	label?: string;
	default?: any;
	isDevTool?: boolean;
	options?: {[key: string]: ModernDeckSettingsSuboption};
	buttons?: ModernDeckSettingsButton[];
	settingsKey?: string;
	initFunc?: Function;
	enabled?: boolean | Function; 
	placeholder?: string;
	queryFunction?: Function;
	minimum?: number;
	maximum?: number;
	displayUnit?: string;
	savePreference?: boolean;
}