export class UISettingsComponent {
    element: JQuery;
    _value: any;

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }
}