/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, HostBinding, Inject } from '@angular/core';
export class DragScrollItemDirective {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.display = 'inline-block';
        this._dragDisabled = false;
        this._elementRef = elementRef;
    }
    /**
     * @return {?}
     */
    get dragDisabled() { return this._dragDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dragDisabled(value) { this._dragDisabled = value; }
}
DragScrollItemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[drag-scroll-item]'
            },] }
];
/** @nocollapse */
DragScrollItemDirective.ctorParameters = () => [
    { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] }
];
DragScrollItemDirective.propDecorators = {
    display: [{ type: HostBinding, args: ['style.display',] }],
    dragDisabled: [{ type: Input, args: ['drag-disabled',] }]
};
if (false) {
    /** @type {?} */
    DragScrollItemDirective.prototype.display;
    /** @type {?} */
    DragScrollItemDirective.prototype._dragDisabled;
    /** @type {?} */
    DragScrollItemDirective.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWctc2Nyb2xsLWl0ZW0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZHJhZy1zY3JvbGwvIiwic291cmNlcyI6WyJsaWIvbmd4LWRyYWctc2Nyb2xsLWl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS2xGLE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFZbEMsWUFDc0IsVUFBc0I7UUFYNUMsWUFBTyxHQUFHLGNBQWMsQ0FBQztRQU16QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQU9wQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDOzs7O0lBWkQsSUFDSSxZQUFZLEtBQUssT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDakQsSUFBSSxZQUFZLENBQUMsS0FBYyxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O1lBVGpFLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2FBQy9COzs7O1lBSm1CLFVBQVUsdUJBa0J6QixNQUFNLFNBQUMsVUFBVTs7O3NCQVpuQixXQUFXLFNBQUMsZUFBZTsyQkFHM0IsS0FBSyxTQUFDLGVBQWU7Ozs7SUFIdEIsMENBQ3lCOztJQU16QixnREFBc0I7O0lBRXRCLDhDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIEhvc3RCaW5kaW5nLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2RyYWctc2Nyb2xsLWl0ZW1dJ1xufSlcbmV4cG9ydCBjbGFzcyBEcmFnU2Nyb2xsSXRlbURpcmVjdGl2ZSB7XG4gIEBIb3N0QmluZGluZygnc3R5bGUuZGlzcGxheScpXG4gIGRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcblxuICBASW5wdXQoJ2RyYWctZGlzYWJsZWQnKVxuICBnZXQgZHJhZ0Rpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZHJhZ0Rpc2FibGVkOyB9XG4gIHNldCBkcmFnRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZHJhZ0Rpc2FibGVkID0gdmFsdWU7IH1cblxuICBfZHJhZ0Rpc2FibGVkID0gZmFsc2U7XG5cbiAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChFbGVtZW50UmVmKSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICApIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmID0gZWxlbWVudFJlZjtcbiAgfVxufVxuIl19