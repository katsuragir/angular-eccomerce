/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ElementRef, Component, Renderer2, Input, Output, EventEmitter, ViewChild, ContentChildren, QueryList, Inject, HostBinding, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DragScrollItemDirective } from './ngx-drag-scroll-item';
export class DragScrollComponent {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _document
     */
    constructor(_elementRef, _renderer, _document) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._document = _document;
        this._index = 0;
        this._scrollbarHidden = false;
        this._disabled = false;
        this._xDisabled = false;
        this._xWheelEnabled = false;
        this._yDisabled = false;
        this._dragDisabled = false;
        this._snapDisabled = false;
        this._snapOffset = 0;
        this._snapDuration = 500;
        this._isDragging = false;
        /**
         * Is the user currently pressing the element
         */
        this.isPressed = false;
        /**
         * Is the user currently scrolling the element
         */
        this.isScrolling = false;
        this.scrollTimer = -1;
        this.scrollToTimer = -1;
        /**
         * The x coordinates on the element
         */
        this.downX = 0;
        /**
         * The y coordinates on the element
         */
        this.downY = 0;
        this.displayType = 'block';
        this.elWidth = null;
        this.elHeight = null;
        this._pointerEvents = 'auto';
        this.scrollbarWidth = null;
        this.isAnimating = false;
        this.prevChildrenLength = 0;
        this.indexBound = 0;
        this.dsInitialized = new EventEmitter();
        this.indexChanged = new EventEmitter();
        this.reachesLeftBound = new EventEmitter();
        this.reachesRightBound = new EventEmitter();
        this.snapAnimationFinished = new EventEmitter();
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.scrollbarWidth = `${this.getScrollbarWidth()}px`;
    }
    /**
     * Is the user currently dragging the element
     * @return {?}
     */
    get isDragging() {
        return this._isDragging;
    }
    /**
     * @return {?}
     */
    get currIndex() { return this._index; }
    /**
     * @param {?} value
     * @return {?}
     */
    set currIndex(value) {
        if (value !== this._index) {
            this._index = value;
            this.indexChanged.emit(value);
        }
    }
    /**
     * Whether the scrollbar is hidden
     * @return {?}
     */
    get scrollbarHidden() { return this._scrollbarHidden; }
    /**
     * @param {?} value
     * @return {?}
     */
    set scrollbarHidden(value) { this._scrollbarHidden = value; }
    /**
     * Whether horizontally and vertically draging and scrolling is be disabled
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) { this._disabled = value; }
    /**
     * Whether horizontally dragging and scrolling is be disabled
     * @return {?}
     */
    get xDisabled() { return this._xDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set xDisabled(value) { this._xDisabled = value; }
    /**
     * Whether vertically dragging and scrolling events is disabled
     * @return {?}
     */
    get yDisabled() { return this._yDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set yDisabled(value) { this._yDisabled = value; }
    /**
     * Whether scrolling horizontally with mouse wheel is enabled
     * @return {?}
     */
    get xWheelEnabled() { return this._xWheelEnabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set xWheelEnabled(value) { this._xWheelEnabled = value; }
    /**
     * @return {?}
     */
    get dragDisabled() { return this._dragDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dragDisabled(value) { this._dragDisabled = value; }
    /**
     * @return {?}
     */
    get snapDisabled() { return this._snapDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set snapDisabled(value) { this._snapDisabled = value; }
    /**
     * @return {?}
     */
    get snapOffset() { return this._snapOffset; }
    /**
     * @param {?} value
     * @return {?}
     */
    set snapOffset(value) { this._snapOffset = value; }
    /**
     * @return {?}
     */
    get snapDuration() { return this._snapDuration; }
    /**
     * @param {?} value
     * @return {?}
     */
    set snapDuration(value) { this._snapDuration = value; }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.setScrollBar();
        if (this.xDisabled || this.disabled) {
            this.disableScroll('x');
        }
        else {
            this.enableScroll('x');
        }
        if (this.yDisabled || this.disabled) {
            this.disableScroll('y');
        }
        else {
            this.enableScroll('y');
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // auto assign computed css
        this._renderer.setAttribute(this._contentRef.nativeElement, 'drag-scroll', 'true');
        this.displayType = typeof window !== 'undefined' ? window.getComputedStyle(this._elementRef.nativeElement).display : 'block';
        this._renderer.setStyle(this._contentRef.nativeElement, 'display', this.displayType);
        this._renderer.setStyle(this._contentRef.nativeElement, 'whiteSpace', 'noWrap');
        // store ele width height for later user
        this.markElDimension();
        this._renderer.setStyle(this._contentRef.nativeElement, 'width', this.elWidth);
        this._renderer.setStyle(this._contentRef.nativeElement, 'height', this.elHeight);
        if (this.wrapper) {
            this.checkScrollbar();
        }
        this._onMouseDownListener = this._renderer.listen(this._contentRef.nativeElement, 'mousedown', this.onMouseDownHandler.bind(this));
        this._onScrollListener = this._renderer.listen(this._contentRef.nativeElement, 'scroll', this.onScrollHandler.bind(this));
        // prevent Firefox from dragging images
        this._onDragStartListener = this._renderer.listen('document', 'dragstart', (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            e.preventDefault();
        }));
        this.checkNavStatus();
        this.dsInitialized.emit();
        this.adjustMarginToLastChild();
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        // avoid extra checks
        if (this._children.length !== this.prevChildrenLength) {
            this.markElDimension();
            this.checkScrollbar();
            this.prevChildrenLength = this._children.length;
            this.checkNavStatus();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._renderer.setAttribute(this._contentRef.nativeElement, 'drag-scroll', 'false');
        if (this._onMouseDownListener) {
            this._onMouseDownListener = this._onMouseDownListener();
        }
        if (this._onScrollListener) {
            this._onScrollListener = this._onScrollListener();
        }
        if (this._onDragStartListener) {
            this._onDragStartListener = this._onDragStartListener();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMoveHandler(event) {
        this.onMouseMove(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this.isPressed && !this.disabled) {
            // Workaround for prevent scroll stuck if browser lost focus
            // MouseEvent.buttons not support by Safari
            // tslint:disable-next-line:deprecation
            if (!event.buttons && !event.which) {
                return this.onMouseUpHandler(event);
            }
            this._pointerEvents = 'none';
            this._setIsDragging(true);
            // Drag X
            if (!this.xDisabled && !this.dragDisabled) {
                /** @type {?} */
                const clientX = ((/** @type {?} */ (event))).clientX;
                this._contentRef.nativeElement.scrollLeft =
                    this._contentRef.nativeElement.scrollLeft - clientX + this.downX;
                this.downX = clientX;
            }
            // Drag Y
            if (!this.yDisabled && !this.dragDisabled) {
                /** @type {?} */
                const clientY = ((/** @type {?} */ (event))).clientY;
                this._contentRef.nativeElement.scrollTop =
                    this._contentRef.nativeElement.scrollTop - clientY + this.downY;
                this.downY = clientY;
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDownHandler(event) {
        /** @type {?} */
        const dragScrollItem = this.locateDragScrollItem((/** @type {?} */ (event.target)));
        if (dragScrollItem && dragScrollItem.dragDisabled) {
            return;
        }
        /** @type {?} */
        const isTouchEvent = event.type === 'touchstart';
        this._startGlobalListening(isTouchEvent);
        this.isPressed = true;
        /** @type {?} */
        const mouseEvent = (/** @type {?} */ (event));
        this.downX = mouseEvent.clientX;
        this.downY = mouseEvent.clientY;
        clearTimeout((/** @type {?} */ (this.scrollToTimer)));
    }
    /**
     * @return {?}
     */
    onScrollHandler() {
        this.checkNavStatus();
        if (!this.isPressed && !this.isAnimating && !this.snapDisabled) {
            this.isScrolling = true;
            clearTimeout((/** @type {?} */ (this.scrollTimer)));
            this.scrollTimer = setTimeout((/**
             * @return {?}
             */
            () => {
                this.isScrolling = false;
                this.locateCurrentIndex(true);
            }), 500);
        }
        else {
            this.locateCurrentIndex();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseUpHandler(event) {
        if (this.isPressed) {
            this.isPressed = false;
            this._pointerEvents = 'auto';
            this._setIsDragging(false);
            if (!this.snapDisabled) {
                this.locateCurrentIndex(true);
            }
            else {
                this.locateCurrentIndex();
            }
            this._stopGlobalListening();
        }
    }
    /*
       * Nav button
       */
    /**
     * @return {?}
     */
    moveLeft() {
        if ((this.currIndex !== 0 || this.snapDisabled)) {
            this.currIndex--;
            clearTimeout((/** @type {?} */ (this.scrollToTimer)));
            this.scrollTo(this._contentRef.nativeElement, this.toChildrenLocation(), this.snapDuration);
        }
    }
    /**
     * @return {?}
     */
    moveRight() {
        /** @type {?} */
        const container = this.wrapper || this.parentNode;
        /** @type {?} */
        const containerWidth = container ? container.clientWidth : 0;
        if (!this.isScrollReachesRightEnd() && this.currIndex < this.maximumIndex(containerWidth, this._children.toArray())) {
            this.currIndex++;
            clearTimeout((/** @type {?} */ (this.scrollToTimer)));
            this.scrollTo(this._contentRef.nativeElement, this.toChildrenLocation(), this.snapDuration);
        }
    }
    /**
     * @param {?} index
     * @return {?}
     */
    moveTo(index) {
        /** @type {?} */
        const container = this.wrapper || this.parentNode;
        /** @type {?} */
        const containerWidth = container ? container.clientWidth : 0;
        if (index >= 0 &&
            index !== this.currIndex &&
            this.currIndex <= this.maximumIndex(containerWidth, this._children.toArray())) {
            this.currIndex = Math.min(index, this.maximumIndex(containerWidth, this._children.toArray()));
            clearTimeout((/** @type {?} */ (this.scrollToTimer)));
            this.scrollTo(this._contentRef.nativeElement, this.toChildrenLocation(), this.snapDuration);
        }
    }
    /**
     * @return {?}
     */
    checkNavStatus() {
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const onlyOneItem = Boolean(this._children.length <= 1);
            /** @type {?} */
            const containerIsLargerThanContent = Boolean(this._contentRef.nativeElement.scrollWidth <=
                this._contentRef.nativeElement.clientWidth);
            if (onlyOneItem || containerIsLargerThanContent) {
                // only one element
                this.reachesLeftBound.emit(true);
                this.reachesRightBound.emit(true);
            }
            else if (this.isScrollReachesRightEnd()) {
                // reached right end
                this.reachesLeftBound.emit(false);
                this.reachesRightBound.emit(true);
            }
            else if (this._contentRef.nativeElement.scrollLeft === 0 &&
                this._contentRef.nativeElement.scrollWidth > this._contentRef.nativeElement.clientWidth) {
                // reached left end
                this.reachesLeftBound.emit(true);
                this.reachesRightBound.emit(false);
            }
            else {
                // in the middle
                this.reachesLeftBound.emit(false);
                this.reachesRightBound.emit(false);
            }
        }), 0);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onWheel(event) {
        if (this._xWheelEnabled) {
            event.preventDefault();
            if (this._snapDisabled) {
                this._contentRef.nativeElement.scrollBy(event.deltaY, 0);
            }
            else {
                if (event.deltaY < 0) {
                    this.moveLeft();
                }
                else if (event.deltaY > 0) {
                    this.moveRight();
                }
            }
        }
    }
    /**
     * @return {?}
     */
    onWindowResize() {
        this.refreshWrapperDimensions();
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    _setIsDragging(value) {
        if (this._isDragging === value) {
            return;
        }
        this._isDragging = value;
        value ? this.dragStart.emit() : this.dragEnd.emit();
    }
    /**
     * @private
     * @param {?} isTouchEvent
     * @return {?}
     */
    _startGlobalListening(isTouchEvent) {
        if (!this._onMouseMoveListener) {
            /** @type {?} */
            const eventName = isTouchEvent ? 'touchmove' : 'mousemove';
            this._onMouseMoveListener = this._renderer.listen('document', eventName, this.onMouseMoveHandler.bind(this));
        }
        if (!this._onMouseUpListener) {
            /** @type {?} */
            const eventName = isTouchEvent ? 'touchend' : 'mouseup';
            this._onMouseUpListener = this._renderer.listen('document', eventName, this.onMouseUpHandler.bind(this));
        }
    }
    /**
     * @private
     * @return {?}
     */
    _stopGlobalListening() {
        if (this._onMouseMoveListener) {
            this._onMouseMoveListener = this._onMouseMoveListener();
        }
        if (this._onMouseUpListener) {
            this._onMouseUpListener = this._onMouseUpListener();
        }
    }
    /**
     * @private
     * @param {?} axis
     * @return {?}
     */
    disableScroll(axis) {
        this._renderer.setStyle(this._contentRef.nativeElement, `overflow-${axis}`, 'hidden');
    }
    /**
     * @private
     * @param {?} axis
     * @return {?}
     */
    enableScroll(axis) {
        this._renderer.setStyle(this._contentRef.nativeElement, `overflow-${axis}`, 'auto');
    }
    /**
     * @private
     * @return {?}
     */
    hideScrollbar() {
        if (this._contentRef.nativeElement.style.display !== 'none' && !this.wrapper) {
            this.parentNode = this._contentRef.nativeElement.parentNode;
            // create container element
            this.wrapper = this._renderer.createElement('div');
            this._renderer.setAttribute(this.wrapper, 'class', 'drag-scroll-wrapper');
            this._renderer.addClass(this.wrapper, 'drag-scroll-container');
            this.refreshWrapperDimensions();
            this._renderer.setStyle(this.wrapper, 'overflow', 'hidden');
            this._renderer.setStyle(this._contentRef.nativeElement, 'width', `calc(100% + ${this.scrollbarWidth})`);
            this._renderer.setStyle(this._contentRef.nativeElement, 'height', `calc(100% + ${this.scrollbarWidth})`);
            // Append container element to component element.
            this._renderer.appendChild(this._elementRef.nativeElement, this.wrapper);
            // Append content element to container element.
            this._renderer.appendChild(this.wrapper, this._contentRef.nativeElement);
            this.adjustMarginToLastChild();
        }
    }
    /**
     * @private
     * @return {?}
     */
    showScrollbar() {
        if (this.wrapper) {
            this._renderer.setStyle(this._contentRef.nativeElement, 'width', '100%');
            this._renderer.setStyle(this._contentRef.nativeElement, 'height', this.wrapper.style.height);
            if (this.parentNode !== null) {
                this.parentNode.removeChild(this.wrapper);
                this.parentNode.appendChild(this._contentRef.nativeElement);
            }
            this.wrapper = null;
            this.adjustMarginToLastChild();
        }
    }
    /**
     * @private
     * @return {?}
     */
    checkScrollbar() {
        if (this._contentRef.nativeElement.scrollWidth <= this._contentRef.nativeElement.clientWidth) {
            this._renderer.setStyle(this._contentRef.nativeElement, 'height', '100%');
        }
        else {
            this._renderer.setStyle(this._contentRef.nativeElement, 'height', `calc(100% + ${this.scrollbarWidth})`);
        }
        if (this._contentRef.nativeElement.scrollHeight <= this._contentRef.nativeElement.clientHeight) {
            this._renderer.setStyle(this._contentRef.nativeElement, 'width', '100%');
        }
        else {
            this._renderer.setStyle(this._contentRef.nativeElement, 'width', `calc(100% + ${this.scrollbarWidth})`);
        }
    }
    /**
     * @private
     * @return {?}
     */
    setScrollBar() {
        if (this.scrollbarHidden) {
            this.hideScrollbar();
        }
        else {
            this.showScrollbar();
        }
    }
    /**
     * @private
     * @return {?}
     */
    getScrollbarWidth() {
        /**
         * Browser Scrollbar Widths (2016)
         * OSX (Chrome, Safari, Firefox) - 15px
         * Windows XP (IE7, Chrome, Firefox) - 17px
         * Windows 7 (IE10, IE11, Chrome, Firefox) - 17px
         * Windows 8.1 (IE11, Chrome, Firefox) - 17px
         * Windows 10 (IE11, Chrome, Firefox) - 17px
         * Windows 10 (Edge 12/13) - 12px
         * @type {?}
         */
        const outer = this._renderer.createElement('div');
        this._renderer.setStyle(outer, 'visibility', 'hidden');
        this._renderer.setStyle(outer, 'width', '100px');
        this._renderer.setStyle(outer, 'msOverflowStyle', 'scrollbar'); // needed for WinJS apps
        // document.body.appendChild(outer);
        this._renderer.appendChild(this._document.body, outer);
        // this._renderer.appendChild(this._renderer.selectRootElement('body'), outer);
        /** @type {?} */
        const widthNoScroll = outer.offsetWidth;
        // force scrollbars
        this._renderer.setStyle(outer, 'overflow', 'scroll');
        // add innerdiv
        /** @type {?} */
        const inner = this._renderer.createElement('div');
        this._renderer.setStyle(inner, 'width', '100%');
        this._renderer.appendChild(outer, inner);
        /** @type {?} */
        const widthWithScroll = inner.offsetWidth;
        // remove divs
        this._renderer.removeChild(this._document.body, outer);
        /**
         * Scrollbar width will be 0 on Mac OS with the
         * default "Only show scrollbars when scrolling" setting (Yosemite and up).
         * setting default width to 20;
         */
        return widthNoScroll - widthWithScroll || 20;
    }
    /**
     * @private
     * @return {?}
     */
    refreshWrapperDimensions() {
        if (this.wrapper) {
            this._renderer.setStyle(this.wrapper, 'width', '100%');
            this._renderer.setStyle(this.wrapper, 'height', this._elementRef.nativeElement.style.height
                || this._elementRef.nativeElement.offsetHeight + 'px');
        }
    }
    /*
      * The below solution is heavily inspired from
      * https://gist.github.com/andjosh/6764939
      */
    /**
     * @private
     * @param {?} element
     * @param {?} to
     * @param {?} duration
     * @return {?}
     */
    scrollTo(element, to, duration) {
        /** @type {?} */
        const self = this;
        self.isAnimating = true;
        /** @type {?} */
        const start = element.scrollLeft;
        /** @type {?} */
        const change = to - start - this.snapOffset;
        /** @type {?} */
        const increment = 20;
        /** @type {?} */
        let currentTime = 0;
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        /** @type {?} */
        const easeInOutQuad = (/**
         * @param {?} t
         * @param {?} b
         * @param {?} c
         * @param {?} d
         * @return {?}
         */
        function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        });
        /** @type {?} */
        const animateScroll = (/**
         * @return {?}
         */
        function () {
            currentTime += increment;
            element.scrollLeft = easeInOutQuad(currentTime, start, change, duration);
            if (currentTime < duration) {
                self.scrollToTimer = setTimeout(animateScroll, increment);
            }
            else {
                // run one more frame to make sure the animation is fully finished
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    self.isAnimating = false;
                    self.snapAnimationFinished.emit(self.currIndex);
                }), increment);
            }
        });
        animateScroll();
    }
    /**
     * @private
     * @param {?=} snap
     * @return {?}
     */
    locateCurrentIndex(snap) {
        this.currentChildWidth((/**
         * @param {?} currentChildWidth
         * @param {?} nextChildrenWidth
         * @param {?} childrenWidth
         * @param {?} idx
         * @param {?} stop
         * @return {?}
         */
        (currentChildWidth, nextChildrenWidth, childrenWidth, idx, stop) => {
            if ((this._contentRef.nativeElement.scrollLeft >= childrenWidth &&
                this._contentRef.nativeElement.scrollLeft <= nextChildrenWidth)) {
                if (nextChildrenWidth - this._contentRef.nativeElement.scrollLeft > currentChildWidth / 2 && !this.isScrollReachesRightEnd()) {
                    // roll back scrolling
                    if (!this.isAnimating) {
                        this.currIndex = idx;
                    }
                    if (snap) {
                        this.scrollTo(this._contentRef.nativeElement, childrenWidth, this.snapDuration);
                    }
                }
                else if (this._contentRef.nativeElement.scrollLeft !== 0) {
                    // forward scrolling
                    if (!this.isAnimating) {
                        this.currIndex = idx + 1;
                    }
                    if (snap) {
                        this.scrollTo(this._contentRef.nativeElement, childrenWidth + currentChildWidth, this.snapDuration);
                    }
                }
                stop();
            }
            else if ((idx + 1) === (this._children.length - 1)) {
                // reaches last index
                if (!this.isAnimating) {
                    this.currIndex = idx + 1;
                }
                stop();
            }
        }));
    }
    /**
     * @private
     * @param {?} cb
     * @return {?}
     */
    currentChildWidth(cb) {
        /** @type {?} */
        let childrenWidth = 0;
        /** @type {?} */
        let shouldBreak = false;
        /** @type {?} */
        const breakFunc = (/**
         * @return {?}
         */
        function () {
            shouldBreak = true;
        });
        /** @type {?} */
        const childrenArr = this._children.toArray();
        for (let i = 0; i < childrenArr.length; i++) {
            if (i === childrenArr.length - 1) {
                break;
            }
            if (shouldBreak) {
                break;
            }
            /** @type {?} */
            const nextChildrenWidth = childrenWidth + childrenArr[i + 1]._elementRef.nativeElement.clientWidth;
            /** @type {?} */
            const currentClildWidth = childrenArr[i]._elementRef.nativeElement.clientWidth;
            cb(currentClildWidth, nextChildrenWidth, childrenWidth, i, breakFunc);
            childrenWidth += currentClildWidth;
        }
    }
    /**
     * @private
     * @return {?}
     */
    toChildrenLocation() {
        /** @type {?} */
        let to = 0;
        /** @type {?} */
        const childrenArr = this._children.toArray();
        for (let i = 0; i < this.currIndex; i++) {
            to += childrenArr[i]._elementRef.nativeElement.clientWidth;
        }
        return to;
    }
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    locateDragScrollItem(element) {
        /** @type {?} */
        let item = null;
        /** @type {?} */
        const childrenArr = this._children.toArray();
        for (let i = 0; i < childrenArr.length; i++) {
            if (element === childrenArr[i]._elementRef.nativeElement) {
                item = childrenArr[i];
            }
        }
        return item;
    }
    /**
     * @private
     * @return {?}
     */
    markElDimension() {
        if (this.wrapper) {
            this.elWidth = this.wrapper.style.width;
            this.elHeight = this.wrapper.style.height;
        }
        else {
            this.elWidth = this._elementRef.nativeElement.style.width || (this._elementRef.nativeElement.offsetWidth + 'px');
            this.elHeight = this._elementRef.nativeElement.style.height || (this._elementRef.nativeElement.offsetHeight + 'px');
        }
        /** @type {?} */
        const container = this.wrapper || this.parentNode;
        /** @type {?} */
        const containerWidth = container ? container.clientWidth : 0;
        if (this._children.length > 1) {
            this.indexBound = this.maximumIndex(containerWidth, this._children.toArray());
        }
    }
    /**
     * @private
     * @param {?} containerWidth
     * @param {?} childrenElements
     * @return {?}
     */
    maximumIndex(containerWidth, childrenElements) {
        /** @type {?} */
        let count = 0;
        /** @type {?} */
        let childrenWidth = 0;
        for (let i = 0; i <= childrenElements.length; i++) {
            // last N element
            /** @type {?} */
            const dragScrollItemDirective = childrenElements[childrenElements.length - 1 - i];
            if (!dragScrollItemDirective) {
                break;
            }
            else {
                /** @type {?} */
                const nativeElement = dragScrollItemDirective._elementRef.nativeElement;
                /** @type {?} */
                let itemWidth = nativeElement.clientWidth;
                if (itemWidth === 0 && nativeElement.firstElementChild) {
                    itemWidth = dragScrollItemDirective._elementRef.nativeElement.firstElementChild.clientWidth;
                }
                childrenWidth += itemWidth;
                if (childrenWidth < containerWidth) {
                    count++;
                }
                else {
                    break;
                }
            }
        }
        return childrenElements.length - count;
    }
    /**
     * @private
     * @return {?}
     */
    isScrollReachesRightEnd() {
        /** @type {?} */
        const scrollLeftPos = this._contentRef.nativeElement.scrollLeft + this._contentRef.nativeElement.offsetWidth;
        return scrollLeftPos >= this._contentRef.nativeElement.scrollWidth;
    }
    /**
     * adds a margin right style to the last child element which will resolve the issue
     * of last item gets cutoff.
     * @private
     * @return {?}
     */
    adjustMarginToLastChild() {
        if (this._children && this._children.length > 0 && this.hideScrollbar) {
            /** @type {?} */
            const childrenArr = this._children.toArray();
            /** @type {?} */
            const lastItem = childrenArr[childrenArr.length - 1]._elementRef.nativeElement;
            if (this.wrapper && childrenArr.length > 1) {
                this._renderer.setStyle(lastItem, 'margin-right', this.scrollbarWidth);
            }
            else {
                this._renderer.setStyle(lastItem, 'margin-right', 0);
            }
        }
    }
}
DragScrollComponent.decorators = [
    { type: Component, args: [{
                selector: 'drag-scroll',
                template: `
    <div class="drag-scroll-content" #contentRef>
      <ng-content></ng-content>
    </div>
  `,
                styles: [`
    :host {
      overflow: hidden;
      display: block;
    }
    .drag-scroll-content {
      height: 100%;
      overflow: auto;
      white-space: nowrap;
    }
    `]
            }] }
];
/** @nocollapse */
DragScrollComponent.ctorParameters = () => [
    { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] },
    { type: Renderer2, decorators: [{ type: Inject, args: [Renderer2,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
DragScrollComponent.propDecorators = {
    _contentRef: [{ type: ViewChild, args: ['contentRef', { static: true },] }],
    _children: [{ type: ContentChildren, args: [DragScrollItemDirective,] }],
    _pointerEvents: [{ type: HostBinding, args: ['style.pointer-events',] }],
    dsInitialized: [{ type: Output }],
    indexChanged: [{ type: Output }],
    reachesLeftBound: [{ type: Output }],
    reachesRightBound: [{ type: Output }],
    snapAnimationFinished: [{ type: Output }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    scrollbarHidden: [{ type: Input, args: ['scrollbar-hidden',] }],
    disabled: [{ type: Input, args: ['drag-scroll-disabled',] }],
    xDisabled: [{ type: Input, args: ['drag-scroll-x-disabled',] }],
    yDisabled: [{ type: Input, args: ['drag-scroll-y-disabled',] }],
    xWheelEnabled: [{ type: Input, args: ['scroll-x-wheel-enabled',] }],
    dragDisabled: [{ type: Input, args: ['drag-disabled',] }],
    snapDisabled: [{ type: Input, args: ['snap-disabled',] }],
    snapOffset: [{ type: Input, args: ['snap-offset',] }],
    snapDuration: [{ type: Input, args: ['snap-duration',] }],
    onWheel: [{ type: HostListener, args: ['wheel', ['$event'],] }],
    onWindowResize: [{ type: HostListener, args: ['window:resize',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._index;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._scrollbarHidden;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._xDisabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._xWheelEnabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._yDisabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._dragDisabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._snapDisabled;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._snapOffset;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._snapDuration;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._isDragging;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._onMouseMoveListener;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._onMouseUpListener;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._onMouseDownListener;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._onScrollListener;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._onDragStartListener;
    /**
     * Is the user currently pressing the element
     * @type {?}
     */
    DragScrollComponent.prototype.isPressed;
    /**
     * Is the user currently scrolling the element
     * @type {?}
     */
    DragScrollComponent.prototype.isScrolling;
    /** @type {?} */
    DragScrollComponent.prototype.scrollTimer;
    /** @type {?} */
    DragScrollComponent.prototype.scrollToTimer;
    /**
     * The x coordinates on the element
     * @type {?}
     */
    DragScrollComponent.prototype.downX;
    /**
     * The y coordinates on the element
     * @type {?}
     */
    DragScrollComponent.prototype.downY;
    /** @type {?} */
    DragScrollComponent.prototype.displayType;
    /** @type {?} */
    DragScrollComponent.prototype.elWidth;
    /** @type {?} */
    DragScrollComponent.prototype.elHeight;
    /**
     * The parentNode of carousel Element
     * @type {?}
     */
    DragScrollComponent.prototype.parentNode;
    /**
     * The carousel Element
     * @type {?}
     */
    DragScrollComponent.prototype._contentRef;
    /** @type {?} */
    DragScrollComponent.prototype._children;
    /** @type {?} */
    DragScrollComponent.prototype._pointerEvents;
    /** @type {?} */
    DragScrollComponent.prototype.wrapper;
    /** @type {?} */
    DragScrollComponent.prototype.scrollbarWidth;
    /** @type {?} */
    DragScrollComponent.prototype.isAnimating;
    /** @type {?} */
    DragScrollComponent.prototype.prevChildrenLength;
    /** @type {?} */
    DragScrollComponent.prototype.indexBound;
    /** @type {?} */
    DragScrollComponent.prototype.dsInitialized;
    /** @type {?} */
    DragScrollComponent.prototype.indexChanged;
    /** @type {?} */
    DragScrollComponent.prototype.reachesLeftBound;
    /** @type {?} */
    DragScrollComponent.prototype.reachesRightBound;
    /** @type {?} */
    DragScrollComponent.prototype.snapAnimationFinished;
    /** @type {?} */
    DragScrollComponent.prototype.dragStart;
    /** @type {?} */
    DragScrollComponent.prototype.dragEnd;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    DragScrollComponent.prototype._document;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWctc2Nyb2xsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kcmFnLXNjcm9sbC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZHJhZy1zY3JvbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsVUFBVSxFQUNWLFNBQVMsRUFDVCxTQUFTLEVBRVQsS0FBSyxFQUNMLE1BQU0sRUFHTixZQUFZLEVBQ1osU0FBUyxFQUNULGVBQWUsRUFFZixTQUFTLEVBQ1QsTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBcUJqRSxNQUFNLE9BQU8sbUJBQW1COzs7Ozs7SUF3SzlCLFlBQzhCLFdBQXVCLEVBQ3hCLFNBQW9CLEVBQ3JCLFNBQWM7UUFGWixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN4QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3JCLGNBQVMsR0FBVCxTQUFTLENBQUs7UUExS2xDLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFFWCxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFFekIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRW5CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFbkIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFFaEIsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFFcEIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7Ozs7UUFlNUIsY0FBUyxHQUFHLEtBQUssQ0FBQzs7OztRQUtsQixnQkFBVyxHQUFHLEtBQUssQ0FB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Qzs7Ozs7SUFFdkMsaURBQXFDOzs7OztJQUVyQyxtREFBdUM7Ozs7O0lBRXZDLGdEQUFvQzs7Ozs7SUFFcEMsbURBQXVDOzs7OztJQUt2Qyx3Q0FBa0I7Ozs7O0lBS2xCLDBDQUFvQjs7SUFFcEIsMENBQXdDOztJQUV4Qyw0Q0FBMEM7Ozs7O0lBWTFDLG9DQUFVOzs7OztJQUtWLG9DQUFVOztJQUVWLDBDQUFxQzs7SUFFckMsc0NBQThCOztJQUU5Qix1Q0FBK0I7Ozs7O0lBSy9CLHlDQUF3Qjs7Ozs7SUFNeEIsMENBQW1FOztJQUVuRSx3Q0FBd0Y7O0lBRXhGLDZDQUE2RDs7SUFFN0Qsc0NBQStCOztJQUUvQiw2Q0FBcUM7O0lBVXJDLDBDQUFvQjs7SUFFcEIsaURBQXVCOztJQUV2Qix5Q0FBZTs7SUFFZiw0Q0FBbUQ7O0lBRW5ELDJDQUFvRDs7SUFFcEQsK0NBQXlEOztJQUV6RCxnREFBMEQ7O0lBRTFELG9EQUE2RDs7SUFFN0Qsd0NBQStDOztJQUUvQyxzQ0FBNkM7Ozs7O0lBc0QzQywwQ0FBbUQ7Ozs7O0lBQ25ELHdDQUErQzs7Ozs7SUFDL0Msd0NBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRWxlbWVudFJlZixcbiAgQ29tcG9uZW50LFxuICBSZW5kZXJlcjIsXG4gIE9uRGVzdHJveSxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25DaGFuZ2VzLFxuICBFdmVudEVtaXR0ZXIsXG4gIFZpZXdDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBRdWVyeUxpc3QsXG4gIEluamVjdCxcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgRHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL25neC1kcmFnLXNjcm9sbC1pdGVtJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHJhZy1zY3JvbGwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkcmFnLXNjcm9sbC1jb250ZW50XCIgI2NvbnRlbnRSZWY+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCB7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuICAgIC5kcmFnLXNjcm9sbC1jb250ZW50IHtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG92ZXJmbG93OiBhdXRvO1xuICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB9XG4gICAgYF1cbn0pXG5leHBvcnQgY2xhc3MgRHJhZ1Njcm9sbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdDaGVja2VkIHtcbiAgcHJpdmF0ZSBfaW5kZXggPSAwO1xuXG4gIHByaXZhdGUgX3Njcm9sbGJhckhpZGRlbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfeERpc2FibGVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfeFdoZWVsRW5hYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3lEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2RyYWdEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3NuYXBEaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3NuYXBPZmZzZXQgPSAwO1xuXG4gIHByaXZhdGUgX3NuYXBEdXJhdGlvbiA9IDUwMDtcblxuICBwcml2YXRlIF9pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfb25Nb3VzZU1vdmVMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgcHJpdmF0ZSBfb25Nb3VzZVVwTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgX29uTW91c2VEb3duTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgX29uU2Nyb2xsTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgX29uRHJhZ1N0YXJ0TGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgdXNlciBjdXJyZW50bHkgcHJlc3NpbmcgdGhlIGVsZW1lbnRcbiAgICovXG4gIGlzUHJlc3NlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgdXNlciBjdXJyZW50bHkgc2Nyb2xsaW5nIHRoZSBlbGVtZW50XG4gICAqL1xuICBpc1Njcm9sbGluZyA9IGZhbHNlO1xuXG4gIHNjcm9sbFRpbWVyOiBudW1iZXIgfCBOb2RlSlMuVGltZXIgPSAtMTtcblxuICBzY3JvbGxUb1RpbWVyOiBudW1iZXIgfCBOb2RlSlMuVGltZXIgPSAtMTtcblxuICAvKipcbiAgICogSXMgdGhlIHVzZXIgY3VycmVudGx5IGRyYWdnaW5nIHRoZSBlbGVtZW50XG4gICAqL1xuICBnZXQgaXNEcmFnZ2luZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNEcmFnZ2luZztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgeCBjb29yZGluYXRlcyBvbiB0aGUgZWxlbWVudFxuICAgKi9cbiAgZG93blggPSAwO1xuXG4gIC8qKlxuICAgKiBUaGUgeSBjb29yZGluYXRlcyBvbiB0aGUgZWxlbWVudFxuICAgKi9cbiAgZG93blkgPSAwO1xuXG4gIGRpc3BsYXlUeXBlOiBzdHJpbmcgfCBudWxsID0gJ2Jsb2NrJztcblxuICBlbFdpZHRoOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBlbEhlaWdodDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJlbnROb2RlIG9mIGNhcm91c2VsIEVsZW1lbnRcbiAgICovXG4gIHBhcmVudE5vZGU6IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgY2Fyb3VzZWwgRWxlbWVudFxuICAgKi9cblxuICBAVmlld0NoaWxkKCdjb250ZW50UmVmJywgeyBzdGF0aWM6IHRydWUgfSkgX2NvbnRlbnRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihEcmFnU2Nyb2xsSXRlbURpcmVjdGl2ZSkgX2NoaWxkcmVuOiBRdWVyeUxpc3Q8RHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmU+O1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUucG9pbnRlci1ldmVudHMnKSBfcG9pbnRlckV2ZW50cyA9ICdhdXRvJztcblxuICB3cmFwcGVyOiBIVE1MRGl2RWxlbWVudCB8IG51bGw7XG5cbiAgc2Nyb2xsYmFyV2lkdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGdldCBjdXJySW5kZXgoKSB7IHJldHVybiB0aGlzLl9pbmRleDsgfVxuICBzZXQgY3VyckluZGV4KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9pbmRleCkge1xuICAgICAgdGhpcy5faW5kZXggPSB2YWx1ZTtcbiAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkLmVtaXQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgcHJldkNoaWxkcmVuTGVuZ3RoID0gMDtcblxuICBpbmRleEJvdW5kID0gMDtcblxuICBAT3V0cHV0KCkgZHNJbml0aWFsaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBAT3V0cHV0KCkgaW5kZXhDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgQE91dHB1dCgpIHJlYWNoZXNMZWZ0Qm91bmQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgQE91dHB1dCgpIHJlYWNoZXNSaWdodEJvdW5kID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIEBPdXRwdXQoKSBzbmFwQW5pbWF0aW9uRmluaXNoZWQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICBAT3V0cHV0KCkgZHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgaGlkZGVuXG4gICAqL1xuICBASW5wdXQoJ3Njcm9sbGJhci1oaWRkZW4nKVxuICBnZXQgc2Nyb2xsYmFySGlkZGVuKCkgeyByZXR1cm4gdGhpcy5fc2Nyb2xsYmFySGlkZGVuOyB9XG4gIHNldCBzY3JvbGxiYXJIaWRkZW4odmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fc2Nyb2xsYmFySGlkZGVuID0gdmFsdWU7IH1cblxuICAvKipcbiAgICogV2hldGhlciBob3Jpem9udGFsbHkgYW5kIHZlcnRpY2FsbHkgZHJhZ2luZyBhbmQgc2Nyb2xsaW5nIGlzIGJlIGRpc2FibGVkXG4gICAqL1xuICBASW5wdXQoJ2RyYWctc2Nyb2xsLWRpc2FibGVkJylcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7IH1cblxuICAvKipcbiAgICogV2hldGhlciBob3Jpem9udGFsbHkgZHJhZ2dpbmcgYW5kIHNjcm9sbGluZyBpcyBiZSBkaXNhYmxlZFxuICAgKi9cbiAgQElucHV0KCdkcmFnLXNjcm9sbC14LWRpc2FibGVkJylcbiAgZ2V0IHhEaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX3hEaXNhYmxlZDsgfVxuICBzZXQgeERpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3hEaXNhYmxlZCA9IHZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdmVydGljYWxseSBkcmFnZ2luZyBhbmQgc2Nyb2xsaW5nIGV2ZW50cyBpcyBkaXNhYmxlZFxuICAgKi9cbiAgQElucHV0KCdkcmFnLXNjcm9sbC15LWRpc2FibGVkJylcbiAgZ2V0IHlEaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMuX3lEaXNhYmxlZDsgfVxuICBzZXQgeURpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3lEaXNhYmxlZCA9IHZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgc2Nyb2xsaW5nIGhvcml6b250YWxseSB3aXRoIG1vdXNlIHdoZWVsIGlzIGVuYWJsZWRcbiAgICovXG4gIEBJbnB1dCgnc2Nyb2xsLXgtd2hlZWwtZW5hYmxlZCcpXG4gIGdldCB4V2hlZWxFbmFibGVkKCkgeyByZXR1cm4gdGhpcy5feFdoZWVsRW5hYmxlZDsgfVxuICBzZXQgeFdoZWVsRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl94V2hlZWxFbmFibGVkID0gdmFsdWU7IH1cblxuICBASW5wdXQoJ2RyYWctZGlzYWJsZWQnKVxuICBnZXQgZHJhZ0Rpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZHJhZ0Rpc2FibGVkOyB9XG4gIHNldCBkcmFnRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZHJhZ0Rpc2FibGVkID0gdmFsdWU7IH1cblxuICBASW5wdXQoJ3NuYXAtZGlzYWJsZWQnKVxuICBnZXQgc25hcERpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fc25hcERpc2FibGVkOyB9XG4gIHNldCBzbmFwRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fc25hcERpc2FibGVkID0gdmFsdWU7IH1cblxuICBASW5wdXQoJ3NuYXAtb2Zmc2V0JylcbiAgZ2V0IHNuYXBPZmZzZXQoKSB7IHJldHVybiB0aGlzLl9zbmFwT2Zmc2V0OyB9XG4gIHNldCBzbmFwT2Zmc2V0KHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fc25hcE9mZnNldCA9IHZhbHVlOyB9XG5cbiAgQElucHV0KCdzbmFwLWR1cmF0aW9uJylcbiAgZ2V0IHNuYXBEdXJhdGlvbigpIHsgcmV0dXJuIHRoaXMuX3NuYXBEdXJhdGlvbjsgfVxuICBzZXQgc25hcER1cmF0aW9uKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fc25hcER1cmF0aW9uID0gdmFsdWU7IH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChSZW5kZXJlcjIpIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gYCR7dGhpcy5nZXRTY3JvbGxiYXJXaWR0aCgpfXB4YDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc2V0U2Nyb2xsQmFyKCk7XG5cbiAgICBpZiAodGhpcy54RGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5kaXNhYmxlU2Nyb2xsKCd4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5hYmxlU2Nyb2xsKCd4Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMueURpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZGlzYWJsZVNjcm9sbCgneScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuYWJsZVNjcm9sbCgneScpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBhdXRvIGFzc2lnbiBjb21wdXRlZCBjc3NcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCAnZHJhZy1zY3JvbGwnLCAndHJ1ZScpO1xuXG4gICAgdGhpcy5kaXNwbGF5VHlwZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5kaXNwbGF5IDogJ2Jsb2NrJztcblxuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCB0aGlzLmRpc3BsYXlUeXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aGl0ZVNwYWNlJywgJ25vV3JhcCcpO1xuXG4gICAgLy8gc3RvcmUgZWxlIHdpZHRoIGhlaWdodCBmb3IgbGF0ZXIgdXNlclxuICAgIHRoaXMubWFya0VsRGltZW5zaW9uKCk7XG5cbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsIHRoaXMuZWxXaWR0aCk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgdGhpcy5lbEhlaWdodCk7XG5cbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XG4gICAgICB0aGlzLmNoZWNrU2Nyb2xsYmFyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25Nb3VzZURvd25MaXN0ZW5lciA9IHRoaXMuX3JlbmRlcmVyLmxpc3Rlbih0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9vblNjcm9sbExpc3RlbmVyID0gdGhpcy5fcmVuZGVyZXIubGlzdGVuKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcsIHRoaXMub25TY3JvbGxIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIC8vIHByZXZlbnQgRmlyZWZveCBmcm9tIGRyYWdnaW5nIGltYWdlc1xuICAgIHRoaXMuX29uRHJhZ1N0YXJ0TGlzdGVuZXIgPSB0aGlzLl9yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2RyYWdzdGFydCcsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG4gICAgdGhpcy5jaGVja05hdlN0YXR1cygpO1xuICAgIHRoaXMuZHNJbml0aWFsaXplZC5lbWl0KCk7XG4gICAgdGhpcy5hZGp1c3RNYXJnaW5Ub0xhc3RDaGlsZCgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIC8vIGF2b2lkIGV4dHJhIGNoZWNrc1xuICAgIGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggIT09IHRoaXMucHJldkNoaWxkcmVuTGVuZ3RoKSB7XG4gICAgICB0aGlzLm1hcmtFbERpbWVuc2lvbigpO1xuICAgICAgdGhpcy5jaGVja1Njcm9sbGJhcigpO1xuICAgICAgdGhpcy5wcmV2Q2hpbGRyZW5MZW5ndGggPSB0aGlzLl9jaGlsZHJlbi5sZW5ndGg7XG4gICAgICB0aGlzLmNoZWNrTmF2U3RhdHVzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ2RyYWctc2Nyb2xsJywgJ2ZhbHNlJyk7XG4gICAgaWYgKHRoaXMuX29uTW91c2VEb3duTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuX29uTW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLl9vbk1vdXNlRG93bkxpc3RlbmVyKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vblNjcm9sbExpc3RlbmVyKSB7XG4gICAgICB0aGlzLl9vblNjcm9sbExpc3RlbmVyID0gdGhpcy5fb25TY3JvbGxMaXN0ZW5lcigpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb25EcmFnU3RhcnRMaXN0ZW5lcikge1xuICAgICAgdGhpcy5fb25EcmFnU3RhcnRMaXN0ZW5lciA9IHRoaXMuX29uRHJhZ1N0YXJ0TGlzdGVuZXIoKTtcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZUhhbmRsZXIoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmVzc2VkICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAvLyBXb3JrYXJvdW5kIGZvciBwcmV2ZW50IHNjcm9sbCBzdHVjayBpZiBicm93c2VyIGxvc3QgZm9jdXNcbiAgICAgIC8vIE1vdXNlRXZlbnQuYnV0dG9ucyBub3Qgc3VwcG9ydCBieSBTYWZhcmlcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkZXByZWNhdGlvblxuICAgICAgaWYgKCFldmVudC5idXR0b25zICYmICFldmVudC53aGljaCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbk1vdXNlVXBIYW5kbGVyKGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAgIHRoaXMuX3NldElzRHJhZ2dpbmcodHJ1ZSk7XG5cbiAgICAgIC8vIERyYWcgWFxuICAgICAgaWYgKCF0aGlzLnhEaXNhYmxlZCAmJiAhdGhpcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgY29uc3QgY2xpZW50WCA9IChldmVudCBhcyBNb3VzZUV2ZW50KS5jbGllbnRYO1xuICAgICAgICB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9XG4gICAgICAgICAgdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgLSBjbGllbnRYICsgdGhpcy5kb3duWDtcbiAgICAgICAgdGhpcy5kb3duWCA9IGNsaWVudFg7XG4gICAgICB9XG5cbiAgICAgIC8vIERyYWcgWVxuICAgICAgaWYgKCF0aGlzLnlEaXNhYmxlZCAmJiAhdGhpcy5kcmFnRGlzYWJsZWQpIHtcbiAgICAgICAgY29uc3QgY2xpZW50WSA9IChldmVudCBhcyBNb3VzZUV2ZW50KS5jbGllbnRZO1xuICAgICAgICB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID1cbiAgICAgICAgICB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wIC0gY2xpZW50WSArIHRoaXMuZG93blk7XG4gICAgICAgIHRoaXMuZG93blkgPSBjbGllbnRZO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duSGFuZGxlcihldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGRyYWdTY3JvbGxJdGVtOiBEcmFnU2Nyb2xsSXRlbURpcmVjdGl2ZSB8IG51bGwgPSB0aGlzLmxvY2F0ZURyYWdTY3JvbGxJdGVtKGV2ZW50LnRhcmdldCBhcyBFbGVtZW50KTtcbiAgICBpZiAoZHJhZ1Njcm9sbEl0ZW0gJiYgZHJhZ1Njcm9sbEl0ZW0uZHJhZ0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNUb3VjaEV2ZW50ID0gZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnO1xuXG4gICAgdGhpcy5fc3RhcnRHbG9iYWxMaXN0ZW5pbmcoaXNUb3VjaEV2ZW50KTtcbiAgICB0aGlzLmlzUHJlc3NlZCA9IHRydWU7XG5cbiAgICBjb25zdCBtb3VzZUV2ZW50ID0gZXZlbnQgYXMgTW91c2VFdmVudDtcbiAgICB0aGlzLmRvd25YID0gbW91c2VFdmVudC5jbGllbnRYO1xuICAgIHRoaXMuZG93blkgPSBtb3VzZUV2ZW50LmNsaWVudFk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUb1RpbWVyIGFzIG51bWJlcik7XG4gIH1cblxuICBvblNjcm9sbEhhbmRsZXIoKSB7XG4gICAgdGhpcy5jaGVja05hdlN0YXR1cygpO1xuICAgIGlmICghdGhpcy5pc1ByZXNzZWQgJiYgIXRoaXMuaXNBbmltYXRpbmcgJiYgIXRoaXMuc25hcERpc2FibGVkKSB7XG4gICAgICB0aGlzLmlzU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVyIGFzIG51bWJlcik7XG4gICAgICB0aGlzLnNjcm9sbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNTY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2NhdGVDdXJyZW50SW5kZXgodHJ1ZSk7XG4gICAgICB9LCA1MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvY2F0ZUN1cnJlbnRJbmRleCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VVcEhhbmRsZXIoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXNzZWQpIHtcbiAgICAgIHRoaXMuaXNQcmVzc2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgdGhpcy5fc2V0SXNEcmFnZ2luZyhmYWxzZSk7XG4gICAgICBpZiAoIXRoaXMuc25hcERpc2FibGVkKSB7XG4gICAgICAgIHRoaXMubG9jYXRlQ3VycmVudEluZGV4KHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2NhdGVDdXJyZW50SW5kZXgoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0b3BHbG9iYWxMaXN0ZW5pbmcoKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBOYXYgYnV0dG9uXG4gICAqL1xuICBtb3ZlTGVmdCgpIHtcbiAgICBpZiAoKHRoaXMuY3VyckluZGV4ICE9PSAwIHx8IHRoaXMuc25hcERpc2FibGVkKSkge1xuICAgICAgdGhpcy5jdXJySW5kZXgtLTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRvVGltZXIgYXMgbnVtYmVyKTtcbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLnRvQ2hpbGRyZW5Mb2NhdGlvbigpLCB0aGlzLnNuYXBEdXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbW92ZVJpZ2h0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMud3JhcHBlciB8fCB0aGlzLnBhcmVudE5vZGU7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIgPyBjb250YWluZXIuY2xpZW50V2lkdGggOiAwO1xuXG4gICAgaWYgKCF0aGlzLmlzU2Nyb2xsUmVhY2hlc1JpZ2h0RW5kKCkgJiYgdGhpcy5jdXJySW5kZXggPCB0aGlzLm1heGltdW1JbmRleChjb250YWluZXJXaWR0aCwgdGhpcy5fY2hpbGRyZW4udG9BcnJheSgpKSkge1xuICAgICAgdGhpcy5jdXJySW5kZXgrKztcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRvVGltZXIgYXMgbnVtYmVyKTtcbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLnRvQ2hpbGRyZW5Mb2NhdGlvbigpLCB0aGlzLnNuYXBEdXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbW92ZVRvKGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLndyYXBwZXIgfHwgdGhpcy5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyID8gY29udGFpbmVyLmNsaWVudFdpZHRoIDogMDtcbiAgICBpZiAoXG4gICAgICBpbmRleCA+PSAwICYmXG4gICAgICBpbmRleCAhPT0gdGhpcy5jdXJySW5kZXggJiZcbiAgICAgIHRoaXMuY3VyckluZGV4IDw9IHRoaXMubWF4aW11bUluZGV4KGNvbnRhaW5lcldpZHRoLCB0aGlzLl9jaGlsZHJlbi50b0FycmF5KCkpXG4gICAgKSB7XG4gICAgICB0aGlzLmN1cnJJbmRleCA9IE1hdGgubWluKGluZGV4LCB0aGlzLm1heGltdW1JbmRleChjb250YWluZXJXaWR0aCwgdGhpcy5fY2hpbGRyZW4udG9BcnJheSgpKSk7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUb1RpbWVyIGFzIG51bWJlcik7XG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy50b0NoaWxkcmVuTG9jYXRpb24oKSwgdGhpcy5zbmFwRHVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrTmF2U3RhdHVzKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3Qgb25seU9uZUl0ZW0gPSBCb29sZWFuKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA8PSAxKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lcklzTGFyZ2VyVGhhbkNvbnRlbnQgPSBCb29sZWFuKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA8PVxuICAgICAgICB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICAgICAgaWYgKG9ubHlPbmVJdGVtIHx8IGNvbnRhaW5lcklzTGFyZ2VyVGhhbkNvbnRlbnQpIHtcbiAgICAgICAgLy8gb25seSBvbmUgZWxlbWVudFxuICAgICAgICB0aGlzLnJlYWNoZXNMZWZ0Qm91bmQuZW1pdCh0cnVlKTtcbiAgICAgICAgdGhpcy5yZWFjaGVzUmlnaHRCb3VuZC5lbWl0KHRydWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzU2Nyb2xsUmVhY2hlc1JpZ2h0RW5kKCkpIHtcbiAgICAgICAgLy8gcmVhY2hlZCByaWdodCBlbmRcbiAgICAgICAgdGhpcy5yZWFjaGVzTGVmdEJvdW5kLmVtaXQoZmFsc2UpO1xuICAgICAgICB0aGlzLnJlYWNoZXNSaWdodEJvdW5kLmVtaXQodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID09PSAwICYmXG4gICAgICAgIHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA+IHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aCkge1xuICAgICAgICAvLyByZWFjaGVkIGxlZnQgZW5kXG4gICAgICAgIHRoaXMucmVhY2hlc0xlZnRCb3VuZC5lbWl0KHRydWUpO1xuICAgICAgICB0aGlzLnJlYWNoZXNSaWdodEJvdW5kLmVtaXQoZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaW4gdGhlIG1pZGRsZVxuICAgICAgICB0aGlzLnJlYWNoZXNMZWZ0Qm91bmQuZW1pdChmYWxzZSk7XG4gICAgICAgIHRoaXMucmVhY2hlc1JpZ2h0Qm91bmQuZW1pdChmYWxzZSk7XG4gICAgICB9XG4gICAgfSwgMCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aGVlbCcsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBvbldoZWVsKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX3hXaGVlbEVuYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmICh0aGlzLl9zbmFwRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbEJ5KGV2ZW50LmRlbHRhWSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZXZlbnQuZGVsdGFZIDwgMCkge1xuICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZWx0YVkgPiAwKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBwdWJsaWMgb25XaW5kb3dSZXNpemUoKSB7XG4gICAgdGhpcy5yZWZyZXNoV3JhcHBlckRpbWVuc2lvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldElzRHJhZ2dpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5faXNEcmFnZ2luZyA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gdmFsdWU7XG4gICAgdmFsdWUgPyB0aGlzLmRyYWdTdGFydC5lbWl0KCkgOiB0aGlzLmRyYWdFbmQuZW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3RhcnRHbG9iYWxMaXN0ZW5pbmcoaXNUb3VjaEV2ZW50OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLl9vbk1vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBpc1RvdWNoRXZlbnQgPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgICAgdGhpcy5fb25Nb3VzZU1vdmVMaXN0ZW5lciA9IHRoaXMuX3JlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCBldmVudE5hbWUsIHRoaXMub25Nb3VzZU1vdmVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fb25Nb3VzZVVwTGlzdGVuZXIpIHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGlzVG91Y2hFdmVudCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgICB0aGlzLl9vbk1vdXNlVXBMaXN0ZW5lciA9IHRoaXMuX3JlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCBldmVudE5hbWUsIHRoaXMub25Nb3VzZVVwSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zdG9wR2xvYmFsTGlzdGVuaW5nKCkge1xuICAgIGlmICh0aGlzLl9vbk1vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICB0aGlzLl9vbk1vdXNlTW92ZUxpc3RlbmVyID0gdGhpcy5fb25Nb3VzZU1vdmVMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vbk1vdXNlVXBMaXN0ZW5lcikge1xuICAgICAgdGhpcy5fb25Nb3VzZVVwTGlzdGVuZXIgPSB0aGlzLl9vbk1vdXNlVXBMaXN0ZW5lcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGlzYWJsZVNjcm9sbChheGlzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGBvdmVyZmxvdy0ke2F4aXN9YCwgJ2hpZGRlbicpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbmFibGVTY3JvbGwoYXhpczogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCBgb3ZlcmZsb3ctJHtheGlzfWAsICdhdXRvJyk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVTY3JvbGxiYXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScgJiYgIXRoaXMud3JhcHBlcikge1xuICAgICAgdGhpcy5wYXJlbnROb2RlID0gdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGU7XG5cbiAgICAgIC8vIGNyZWF0ZSBjb250YWluZXIgZWxlbWVudFxuICAgICAgdGhpcy53cmFwcGVyID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy53cmFwcGVyLCAnY2xhc3MnLCAnZHJhZy1zY3JvbGwtd3JhcHBlcicpO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy53cmFwcGVyLCAnZHJhZy1zY3JvbGwtY29udGFpbmVyJyk7XG5cbiAgICAgIHRoaXMucmVmcmVzaFdyYXBwZXJEaW1lbnNpb25zKCk7XG5cbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMud3JhcHBlciwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuXG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsIGBjYWxjKDEwMCUgKyAke3RoaXMuc2Nyb2xsYmFyV2lkdGh9KWApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgYGNhbGMoMTAwJSArICR7dGhpcy5zY3JvbGxiYXJXaWR0aH0pYCk7XG5cbiAgICAgIC8vIEFwcGVuZCBjb250YWluZXIgZWxlbWVudCB0byBjb21wb25lbnQgZWxlbWVudC5cbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy53cmFwcGVyKTtcblxuICAgICAgLy8gQXBwZW5kIGNvbnRlbnQgZWxlbWVudCB0byBjb250YWluZXIgZWxlbWVudC5cbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMud3JhcHBlciwgdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgdGhpcy5hZGp1c3RNYXJnaW5Ub0xhc3RDaGlsZCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2hvd1Njcm9sbGJhcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCB0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0KTtcbiAgICAgIGlmICh0aGlzLnBhcmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud3JhcHBlcik7XG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy53cmFwcGVyID0gbnVsbDtcblxuICAgICAgdGhpcy5hZGp1c3RNYXJnaW5Ub0xhc3RDaGlsZCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tTY3JvbGxiYXIoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA8PSB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGgpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIGBjYWxjKDEwMCUgKyAke3RoaXMuc2Nyb2xsYmFyV2lkdGh9KWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbEhlaWdodCA8PSB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgYGNhbGMoMTAwJSArICR7dGhpcy5zY3JvbGxiYXJXaWR0aH0pYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRTY3JvbGxCYXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFySGlkZGVuKSB7XG4gICAgICB0aGlzLmhpZGVTY3JvbGxiYXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93U2Nyb2xsYmFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTY3JvbGxiYXJXaWR0aCgpOiBudW1iZXIge1xuICAgIC8qKlxuICAgICAqIEJyb3dzZXIgU2Nyb2xsYmFyIFdpZHRocyAoMjAxNilcbiAgICAgKiBPU1ggKENocm9tZSwgU2FmYXJpLCBGaXJlZm94KSAtIDE1cHhcbiAgICAgKiBXaW5kb3dzIFhQIChJRTcsIENocm9tZSwgRmlyZWZveCkgLSAxN3B4XG4gICAgICogV2luZG93cyA3IChJRTEwLCBJRTExLCBDaHJvbWUsIEZpcmVmb3gpIC0gMTdweFxuICAgICAqIFdpbmRvd3MgOC4xIChJRTExLCBDaHJvbWUsIEZpcmVmb3gpIC0gMTdweFxuICAgICAqIFdpbmRvd3MgMTAgKElFMTEsIENocm9tZSwgRmlyZWZveCkgLSAxN3B4XG4gICAgICogV2luZG93cyAxMCAoRWRnZSAxMi8xMykgLSAxMnB4XG4gICAgICovXG4gICAgY29uc3Qgb3V0ZXIgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShvdXRlciwgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUob3V0ZXIsICd3aWR0aCcsICcxMDBweCcpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKG91dGVyLCAnbXNPdmVyZmxvd1N0eWxlJywgJ3Njcm9sbGJhcicpOyAgLy8gbmVlZGVkIGZvciBXaW5KUyBhcHBzXG4gICAgLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdXRlcik7XG4gICAgdGhpcy5fcmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5fZG9jdW1lbnQuYm9keSwgb3V0ZXIpO1xuICAgIC8vIHRoaXMuX3JlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLnNlbGVjdFJvb3RFbGVtZW50KCdib2R5JyksIG91dGVyKTtcbiAgICBjb25zdCB3aWR0aE5vU2Nyb2xsID0gb3V0ZXIub2Zmc2V0V2lkdGg7XG4gICAgLy8gZm9yY2Ugc2Nyb2xsYmFyc1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKG91dGVyLCAnb3ZlcmZsb3cnLCAnc2Nyb2xsJyk7XG5cbiAgICAvLyBhZGQgaW5uZXJkaXZcbiAgICBjb25zdCBpbm5lciA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGlubmVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHRoaXMuX3JlbmRlcmVyLmFwcGVuZENoaWxkKG91dGVyLCBpbm5lcik7XG5cbiAgICBjb25zdCB3aWR0aFdpdGhTY3JvbGwgPSBpbm5lci5vZmZzZXRXaWR0aDtcblxuICAgIC8vIHJlbW92ZSBkaXZzXG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5fZG9jdW1lbnQuYm9keSwgb3V0ZXIpO1xuXG4gICAgLyoqXG4gICAgICogU2Nyb2xsYmFyIHdpZHRoIHdpbGwgYmUgMCBvbiBNYWMgT1Mgd2l0aCB0aGVcbiAgICAgKiBkZWZhdWx0IFwiT25seSBzaG93IHNjcm9sbGJhcnMgd2hlbiBzY3JvbGxpbmdcIiBzZXR0aW5nIChZb3NlbWl0ZSBhbmQgdXApLlxuICAgICAqIHNldHRpbmcgZGVmYXVsdCB3aWR0aCB0byAyMDtcbiAgICAgKi9cbiAgICByZXR1cm4gd2lkdGhOb1Njcm9sbCAtIHdpZHRoV2l0aFNjcm9sbCB8fCAyMDtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaFdyYXBwZXJEaW1lbnNpb25zKCkge1xuICAgIGlmICh0aGlzLndyYXBwZXIpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMud3JhcHBlciwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMud3JhcHBlciwgJ2hlaWdodCcsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHRcbiAgICAgICAgfHwgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCArICdweCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICogVGhlIGJlbG93IHNvbHV0aW9uIGlzIGhlYXZpbHkgaW5zcGlyZWQgZnJvbVxuICAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2FuZGpvc2gvNjc2NDkzOVxuICAqL1xuICBwcml2YXRlIHNjcm9sbFRvKGVsZW1lbnQ6IEVsZW1lbnQsIHRvOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBzdGFydCA9IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIGNoYW5nZSA9IHRvIC0gc3RhcnQgLSB0aGlzLnNuYXBPZmZzZXQsXG4gICAgICBpbmNyZW1lbnQgPSAyMDtcbiAgICBsZXQgY3VycmVudFRpbWUgPSAwO1xuXG4gICAgLy8gdCA9IGN1cnJlbnQgdGltZVxuICAgIC8vIGIgPSBzdGFydCB2YWx1ZVxuICAgIC8vIGMgPSBjaGFuZ2UgaW4gdmFsdWVcbiAgICAvLyBkID0gZHVyYXRpb25cbiAgICBjb25zdCBlYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gKHQ6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIsIGQ6IG51bWJlcikge1xuICAgICAgdCAvPSBkIC8gMjtcbiAgICAgIGlmICh0IDwgMSkge1xuICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gICAgICB9XG4gICAgICB0LS07XG4gICAgICByZXR1cm4gLWMgLyAyICogKHQgKiAodCAtIDIpIC0gMSkgKyBiO1xuICAgIH07XG5cbiAgICBjb25zdCBhbmltYXRlU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3VycmVudFRpbWUgKz0gaW5jcmVtZW50O1xuICAgICAgZWxlbWVudC5zY3JvbGxMZWZ0ID0gZWFzZUluT3V0UXVhZChjdXJyZW50VGltZSwgc3RhcnQsIGNoYW5nZSwgZHVyYXRpb24pO1xuICAgICAgaWYgKGN1cnJlbnRUaW1lIDwgZHVyYXRpb24pIHtcbiAgICAgICAgc2VsZi5zY3JvbGxUb1RpbWVyID0gc2V0VGltZW91dChhbmltYXRlU2Nyb2xsLCBpbmNyZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcnVuIG9uZSBtb3JlIGZyYW1lIHRvIG1ha2Ugc3VyZSB0aGUgYW5pbWF0aW9uIGlzIGZ1bGx5IGZpbmlzaGVkXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZWxmLnNuYXBBbmltYXRpb25GaW5pc2hlZC5lbWl0KHNlbGYuY3VyckluZGV4KTtcbiAgICAgICAgfSwgaW5jcmVtZW50KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGFuaW1hdGVTY3JvbGwoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9jYXRlQ3VycmVudEluZGV4KHNuYXA/OiBib29sZWFuKSB7XG4gICAgdGhpcy5jdXJyZW50Q2hpbGRXaWR0aCgoY3VycmVudENoaWxkV2lkdGgsIG5leHRDaGlsZHJlbldpZHRoLCBjaGlsZHJlbldpZHRoLCBpZHg6IG51bWJlciwgc3RvcCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICAodGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPj0gY2hpbGRyZW5XaWR0aCAmJlxuICAgICAgICAgIHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0IDw9IG5leHRDaGlsZHJlbldpZHRoKVxuICAgICAgKSB7XG4gICAgICAgIGlmIChuZXh0Q2hpbGRyZW5XaWR0aCAtIHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID4gY3VycmVudENoaWxkV2lkdGggLyAyICYmICF0aGlzLmlzU2Nyb2xsUmVhY2hlc1JpZ2h0RW5kKCkpIHtcbiAgICAgICAgICAvLyByb2xsIGJhY2sgc2Nyb2xsaW5nXG4gICAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJJbmRleCA9IGlkeDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNuYXApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCBjaGlsZHJlbldpZHRoLCB0aGlzLnNuYXBEdXJhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbnRlbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ICE9PSAwKSB7XG4gICAgICAgICAgLy8gZm9yd2FyZCBzY3JvbGxpbmdcbiAgICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY3VyckluZGV4ID0gaWR4ICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNuYXApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LCBjaGlsZHJlbldpZHRoICsgY3VycmVudENoaWxkV2lkdGgsIHRoaXMuc25hcER1cmF0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RvcCgpO1xuICAgICAgfSBlbHNlIGlmICgoaWR4ICsgMSkgPT09ICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggLSAxKSkge1xuICAgICAgICAvLyByZWFjaGVzIGxhc3QgaW5kZXhcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJySW5kZXggPSBpZHggKyAxO1xuICAgICAgICB9XG4gICAgICAgIHN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3VycmVudENoaWxkV2lkdGgoY2I6IChcbiAgICBjdXJyZW50Q2xpbGRXaWR0aDogbnVtYmVyLFxuICAgIG5leHRDaGlsZHJlbldpZHRoOiBudW1iZXIsXG4gICAgY2hpbGRyZW5XaWR0aDogbnVtYmVyLFxuICAgIGluZGV4OiBudW1iZXIsXG4gICAgYnJlYWtGdW5jOiAoKSA9PiB2b2lkKSA9PiB2b2lkKSB7XG4gICAgbGV0IGNoaWxkcmVuV2lkdGggPSAwO1xuICAgIGxldCBzaG91bGRCcmVhayA9IGZhbHNlO1xuICAgIGNvbnN0IGJyZWFrRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNob3VsZEJyZWFrID0gdHJ1ZTtcbiAgICB9O1xuICAgIGNvbnN0IGNoaWxkcmVuQXJyID0gdGhpcy5fY2hpbGRyZW4udG9BcnJheSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbkFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGkgPT09IGNoaWxkcmVuQXJyLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkQnJlYWspIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5leHRDaGlsZHJlbldpZHRoID0gY2hpbGRyZW5XaWR0aCArIGNoaWxkcmVuQXJyW2kgKyAxXS5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgY29uc3QgY3VycmVudENsaWxkV2lkdGggPSBjaGlsZHJlbkFycltpXS5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgY2IoY3VycmVudENsaWxkV2lkdGgsIG5leHRDaGlsZHJlbldpZHRoLCBjaGlsZHJlbldpZHRoLCBpLCBicmVha0Z1bmMpO1xuXG4gICAgICBjaGlsZHJlbldpZHRoICs9IGN1cnJlbnRDbGlsZFdpZHRoO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdG9DaGlsZHJlbkxvY2F0aW9uKCk6IG51bWJlciB7XG4gICAgbGV0IHRvID0gMDtcbiAgICBjb25zdCBjaGlsZHJlbkFyciA9IHRoaXMuX2NoaWxkcmVuLnRvQXJyYXkoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VyckluZGV4OyBpKyspIHtcbiAgICAgIHRvICs9IGNoaWxkcmVuQXJyW2ldLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB0bztcbiAgfVxuXG4gIHByaXZhdGUgbG9jYXRlRHJhZ1Njcm9sbEl0ZW0oZWxlbWVudDogRWxlbWVudCk6IERyYWdTY3JvbGxJdGVtRGlyZWN0aXZlIHwgbnVsbCB7XG4gICAgbGV0IGl0ZW06IERyYWdTY3JvbGxJdGVtRGlyZWN0aXZlIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgY2hpbGRyZW5BcnIgPSB0aGlzLl9jaGlsZHJlbi50b0FycmF5KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbkFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsZW1lbnQgPT09IGNoaWxkcmVuQXJyW2ldLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgaXRlbSA9IGNoaWxkcmVuQXJyW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHByaXZhdGUgbWFya0VsRGltZW5zaW9uKCkge1xuICAgIGlmICh0aGlzLndyYXBwZXIpIHtcbiAgICAgIHRoaXMuZWxXaWR0aCA9IHRoaXMud3JhcHBlci5zdHlsZS53aWR0aDtcbiAgICAgIHRoaXMuZWxIZWlnaHQgPSB0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsV2lkdGggPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggfHwgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCArICdweCcpO1xuICAgICAgdGhpcy5lbEhlaWdodCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgfHwgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgKyAncHgnKTtcbiAgICB9XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy53cmFwcGVyIHx8IHRoaXMucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lciA/IGNvbnRhaW5lci5jbGllbnRXaWR0aCA6IDA7XG4gICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMuaW5kZXhCb3VuZCA9ICB0aGlzLm1heGltdW1JbmRleChjb250YWluZXJXaWR0aCwgdGhpcy5fY2hpbGRyZW4udG9BcnJheSgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1heGltdW1JbmRleChjb250YWluZXJXaWR0aDogbnVtYmVyLCBjaGlsZHJlbkVsZW1lbnRzOiBEcmFnU2Nyb2xsSXRlbURpcmVjdGl2ZVtdKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGxldCBjaGlsZHJlbldpZHRoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBjaGlsZHJlbkVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBsYXN0IE4gZWxlbWVudFxuICAgICAgY29uc3QgZHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmU6IERyYWdTY3JvbGxJdGVtRGlyZWN0aXZlID0gY2hpbGRyZW5FbGVtZW50c1tjaGlsZHJlbkVsZW1lbnRzLmxlbmd0aCAtIDEgLSBpXTtcbiAgICAgIGlmICghZHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gZHJhZ1Njcm9sbEl0ZW1EaXJlY3RpdmUuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgbGV0IGl0ZW1XaWR0aCA9IG5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIGlmIChpdGVtV2lkdGggPT09IDAgJiYgbmF0aXZlRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgIGl0ZW1XaWR0aCA9IGRyYWdTY3JvbGxJdGVtRGlyZWN0aXZlLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQuY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW5XaWR0aCArPSBpdGVtV2lkdGg7XG4gICAgICAgIGlmIChjaGlsZHJlbldpZHRoIDwgY29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbkVsZW1lbnRzLmxlbmd0aCAtIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpc1Njcm9sbFJlYWNoZXNSaWdodEVuZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBzY3JvbGxMZWZ0UG9zID0gdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgKyB0aGlzLl9jb250ZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgcmV0dXJuIHNjcm9sbExlZnRQb3MgPj0gdGhpcy5fY29udGVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZHMgYSBtYXJnaW4gcmlnaHQgc3R5bGUgdG8gdGhlIGxhc3QgY2hpbGQgZWxlbWVudCB3aGljaCB3aWxsIHJlc29sdmUgdGhlIGlzc3VlXG4gICAqIG9mIGxhc3QgaXRlbSBnZXRzIGN1dG9mZi5cbiAgICovXG4gIHByaXZhdGUgYWRqdXN0TWFyZ2luVG9MYXN0Q2hpbGQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoaWxkcmVuICYmIHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDAgJiYgdGhpcy5oaWRlU2Nyb2xsYmFyKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbkFyciA9IHRoaXMuX2NoaWxkcmVuLnRvQXJyYXkoKTtcbiAgICAgIGNvbnN0IGxhc3RJdGVtID0gY2hpbGRyZW5BcnJbY2hpbGRyZW5BcnIubGVuZ3RoIC0gMV0uX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGlmICh0aGlzLndyYXBwZXIgJiYgY2hpbGRyZW5BcnIubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShsYXN0SXRlbSwgJ21hcmdpbi1yaWdodCcsIHRoaXMuc2Nyb2xsYmFyV2lkdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUobGFzdEl0ZW0sICdtYXJnaW4tcmlnaHQnLCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==