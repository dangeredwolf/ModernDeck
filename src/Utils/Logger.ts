
const colors: { [source: string]: string } = {
    Boot: "#ab42cd",
    SettingsInit: "#8ab4f8",
    StoragePreferences: "#51c671",
}

export const log = (source: string, ...args: any[]) => {
    const style = `
        color: ${colors[source] || "#fff"};
        font-weight: 900;
    `

    console.log(`%c[${source}]`, style, ...args);
}