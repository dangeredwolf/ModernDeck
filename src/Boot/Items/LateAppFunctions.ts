import { clearContextMenu } from "../../UIContextMenu";

export const initLateAppFunctions = () => {
    window.addEventListener('mousedown', (e) => {
        clearContextMenu();
    }, false);
}