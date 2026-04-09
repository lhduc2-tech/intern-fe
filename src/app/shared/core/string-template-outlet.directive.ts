import {
  Directive,
  EmbeddedViewRef,
  inject,
  input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[zStringTemplateOutlet]',
})
export class ZardStringTemplateOutletDirective implements OnChanges {
  readonly zStringTemplateOutlet = input<string | TemplateRef<void>>();
  private readonly viewContainer = inject(ViewContainerRef);
  private embeddedViewRef: EmbeddedViewRef<void> | null = null;

  ngOnChanges(): void {
    this.viewContainer.clear();
    this.embeddedViewRef = null;
    const value = this.zStringTemplateOutlet();
    if (value instanceof TemplateRef) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(value);
    }
  }

  static ngTemplateContextGuard(
    _dir: ZardStringTemplateOutletDirective,
    _ctx: unknown,
  ): _ctx is void {
    return true;
  }
}
