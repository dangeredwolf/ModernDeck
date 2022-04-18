/*
	Types/WelcomeData.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export interface WelcomePage {
    title: any;
    body: any;
    html?: string | JQuery<HTMLElement>;
    enabled?: boolean;
    prevFunc?: () => void;
    nextFunc?: () => void;
    prevText?: string;
    nextText?: string;
}

export interface WelcomeData {
    [key: string]: WelcomePage;
    welcome: WelcomePage;
    theme: WelcomePage;
    layout: WelcomePage;
    done: WelcomePage;
}