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
    update: WelcomePage;
    theme: WelcomePage;
    layout: WelcomePage;
    done: WelcomePage;
}