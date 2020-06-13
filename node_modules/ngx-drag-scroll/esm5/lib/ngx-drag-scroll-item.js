/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, HostBinding, Inject } from '@angular/core';
var DragScrollItemDirective = /** @class */ (function () {
    function DragScrollItemDirective(elementRef) {
        this.display = 'inline-block';
        this._dragDisabled = false;
        this._elementRef = elementRef;
    }
    Object.defineProperty(DragScrollItemDirective.prototype, "dragDisabled", {
        get: /**
         * @return {?}
         */
        function () { return this._dragDisabled; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._dragDisabled = value; },
        enumerable: true,
        configurable: true
    });
    DragScrollItemDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[drag-scroll-item]'
                },] }
    ];
    /** @nocollapse */
    DragScrollItemDirective.ctorParameters = function () { return [
        { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] }
    ]; };
    DragScrollItemDirective.propDecorators = {
        display: [{ type: HostBinding, args: ['style.display',] }],
        dragDisabled: [{ type: Input, args: ['drag-disabled',] }]
    };
    return DragScrollItemDirective;
}());
export { DragScrollItemDirective };
if (false) {
    /** @type {?} */
    DragScrollItemDirective.prototype.display;
    /** @type {?} */
    DragScrollItemDirective.prototype._dragDisabled;
    /** @type {?} */
    DragScrollItemDirective.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWctc2Nyb2xsLWl0ZW0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZHJhZy1zY3JvbGwvIiwic291cmNlcyI6WyJsaWIvbmd4LWRyYWctc2Nyb2xsLWl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWxGO0lBZUUsaUNBQ3NCLFVBQXNCO1FBWDVDLFlBQU8sR0FBRyxjQUFjLENBQUM7UUFNekIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFPcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQVpELHNCQUNJLGlEQUFZOzs7O1FBRGhCLGNBQ3FCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Ozs7O1FBQ2pELFVBQWlCLEtBQWMsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQURmOztnQkFSbEQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9COzs7O2dCQUptQixVQUFVLHVCQWtCekIsTUFBTSxTQUFDLFVBQVU7OzswQkFabkIsV0FBVyxTQUFDLGVBQWU7K0JBRzNCLEtBQUssU0FBQyxlQUFlOztJQWF4Qiw4QkFBQztDQUFBLEFBcEJELElBb0JDO1NBakJZLHVCQUF1Qjs7O0lBQ2xDLDBDQUN5Qjs7SUFNekIsZ0RBQXNCOztJQUV0Qiw4Q0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBIb3N0QmluZGluZywgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tkcmFnLXNjcm9sbC1pdGVtXSdcbn0pXG5leHBvcnQgY2xhc3MgRHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKVxuICBkaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG5cbiAgQElucHV0KCdkcmFnLWRpc2FibGVkJylcbiAgZ2V0IGRyYWdEaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX2RyYWdEaXNhYmxlZDsgfVxuICBzZXQgZHJhZ0Rpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2RyYWdEaXNhYmxlZCA9IHZhbHVlOyB9XG5cbiAgX2RyYWdEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRWxlbWVudFJlZikgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZiA9IGVsZW1lbnRSZWY7XG4gIH1cbn1cbiJdfQ==