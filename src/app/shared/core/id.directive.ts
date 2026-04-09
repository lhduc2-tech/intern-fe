import { Directive, input, signal } from '@angular/core';

let nextId = 0;

@Directive({
  selector: '[zardId]',
  exportAs: 'zardId',
})
export class ZardIdDirective {
  readonly zardId = input<string>('');
  private readonly _id = signal(`zard-${nextId++}`);

  id() {
    const prefix = this.zardId();
    return prefix ? `${prefix}-${this._id()}` : this._id();
  }
}
