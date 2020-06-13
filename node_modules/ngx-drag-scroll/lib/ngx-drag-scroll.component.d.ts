/// <reference types="node" />
import { ElementRef, Renderer2, OnDestroy, AfterViewInit, OnChanges, EventEmitter, AfterViewChecked, QueryList } from '@angular/core';
import { DragScrollItemDirective } from './ngx-drag-scroll-item';
export declare class DragScrollComponent implements OnDestroy, AfterViewInit, OnChanges, AfterViewChecked {
    private _elementRef;
    private _renderer;
    private _document;
    private _index;
    private _scrollbarHidden;
    private _disabled;
    private _xDisabled;
    private _xWheelEnabled;
    private _yDisabled;
    private _dragDisabled;
    private _snapDisabled;
    private _snapOffset;
    private _snapDuration;
    private _isDragging;
    private _onMouseMoveListener;
    private _onMouseUpListener;
    private _onMouseDownListener;
    private _onScrollListener;
    private _onDragStartListener;
    /**
     * Is the user currently pressing the element
     */
    isPressed: boolean;
    /**
     * Is the user currently scrolling the element
     */
    isScrolling: boolean;
    scrollTimer: number | NodeJS.Timer;
    scrollToTimer: number | NodeJS.Timer;
    /**
     * Is the user currently dragging the element
     */
    readonly isDragging: boolean;
    /**
     * The x coordinates on the element
     */
    downX: number;
    /**
     * The y coordinates on the element
     */
    downY: number;
    displayType: string | null;
    elWidth: string | null;
    elHeight: string | null;
    /**
     * The parentNode of carousel Element
     */
    parentNode: HTMLElement;
    /**
     * The carousel Element
     */
    _contentRef: ElementRef;
    _children: QueryList<DragScrollItemDirective>;
    _pointerEvents: string;
    wrapper: HTMLDivElement | null;
    scrollbarWidth: string | null;
    currIndex: number;
    isAnimating: boolean;
    prevChildrenLength: number;
    indexBound: number;
    dsInitialized: EventEmitter<void>;
    indexChanged: EventEmitter<number>;
    reachesLeftBound: EventEmitter<boolean>;
    reachesRightBound: EventEmitter<boolean>;
    snapAnimationFinished: EventEmitter<number>;
    dragStart: EventEmitter<void>;
    dragEnd: EventEmitter<void>;
    /**
     * Whether the scrollbar is hidden
     */
    scrollbarHidden: boolean;
    /**
     * Whether horizontally and vertically draging and scrolling is be disabled
     */
    disabled: boolean;
    /**
     * Whether horizontally dragging and scrolling is be disabled
     */
    xDisabled: boolean;
    /**
     * Whether vertically dragging and scrolling events is disabled
     */
    yDisabled: boolean;
    /**
     * Whether scrolling horizontally with mouse wheel is enabled
     */
    xWheelEnabled: boolean;
    dragDisabled: boolean;
    snapDisabled: boolean;
    snapOffset: number;
    snapDuration: number;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _document: any);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    onMouseMoveHandler(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseDownHandler(event: MouseEvent): void;
    onScrollHandler(): void;
    onMouseUpHandler(event: MouseEvent): void;
    moveLeft(): void;
    moveRight(): void;
    moveTo(index: number): void;
    checkNavStatus(): void;
    onWheel(event: WheelEvent): void;
    onWindowResize(): void;
    private _setIsDragging;
    private _startGlobalListening;
    private _stopGlobalListening;
    private disableScroll;
    private enableScroll;
    private hideScrollbar;
    private showScrollbar;
    private checkScrollbar;
    private setScrollBar;
    private getScrollbarWidth;
    private refreshWrapperDimensions;
    private scrollTo;
    private locateCurrentIndex;
    private currentChildWidth;
    private toChildrenLocation;
    private locateDragScrollItem;
    private markElDimension;
    private maximumIndex;
    private isScrollReachesRightEnd;
    /**
     * adds a margin right style to the last child element which will resolve the issue
     * of last item gets cutoff.
     */
    private adjustMarginToLastChild;
}
