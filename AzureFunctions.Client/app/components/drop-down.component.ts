import {Component, OnInit, EventEmitter} from 'angular2/core';
import {DropDownElement} from '../models/drop-down-element';

@Component({
    selector: 'drop-down',
    inputs: ['options', 'placeholder'],
    outputs: ['value'],
    templateUrl: 'templates/drop-down.html'
})
export class DropDownComponent<T> {
    public placeholder: string;
    public value: EventEmitter<T>;
    private _options: DropDownElement<T>[];
    public selectedValue: DropDownElement<T>;

    constructor() {
        this.value = new EventEmitter<T>();
    }

    set options(value: DropDownElement<T>[]) {
        this._options = [];
        for (var i = 0; i < value.length; i++) {
            this._options.push({
                id: i,
                displayLabel: value[i].displayLabel,
                value: value[i].value
            });
        }
    }

    onSelect(id: string) {
        var element = this._options.find(e => e.id.toString() === id);
        this.selectedValue = element;
        this.value.emit(element.value);
    }
}