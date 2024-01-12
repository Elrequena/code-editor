/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OverviewRulerPart_1;
import { EventType, addDisposableListener, addStandardDisposableListener, h } from '../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ScrollbarState } from '../../../../base/browser/ui/scrollbar/scrollbarState.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, autorunWithStore, derived, observableFromEvent, observableSignalFromEvent } from '../../../../base/common/observable.js';
import { appendRemoveOnDispose } from './utils.js';
import { Position } from '../../../common/core/position.js';
import { OverviewRulerZone } from '../../../common/viewModel/overviewZoneManager.js';
import { defaultInsertColor, defaultRemoveColor, diffInserted, diffOverviewRulerInserted, diffOverviewRulerRemoved, diffRemoved } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
let OverviewRulerPart = OverviewRulerPart_1 = class OverviewRulerPart extends Disposable {
    constructor(_editors, _rootElement, _diffModel, _rootWidth, _rootHeight, _modifiedEditorLayoutInfo, _options, _themeService) {
        super();
        this._editors = _editors;
        this._rootElement = _rootElement;
        this._diffModel = _diffModel;
        this._rootWidth = _rootWidth;
        this._rootHeight = _rootHeight;
        this._modifiedEditorLayoutInfo = _modifiedEditorLayoutInfo;
        this._options = _options;
        this._themeService = _themeService;
        const currentColorTheme = observableFromEvent(this._themeService.onDidColorThemeChange, () => this._themeService.getColorTheme());
        const currentColors = derived(reader => {
            /** @description colors */
            const theme = currentColorTheme.read(reader);
            const insertColor = theme.getColor(diffOverviewRulerInserted) || (theme.getColor(diffInserted) || defaultInsertColor).transparent(2);
            const removeColor = theme.getColor(diffOverviewRulerRemoved) || (theme.getColor(diffRemoved) || defaultRemoveColor).transparent(2);
            return { insertColor, removeColor };
        });
        const scrollTopObservable = observableFromEvent(this._editors.modified.onDidScrollChange, () => this._editors.modified.getScrollTop());
        const scrollHeightObservable = observableFromEvent(this._editors.modified.onDidScrollChange, () => this._editors.modified.getScrollHeight());
        this._register(autorunWithStore((reader, store) => {
            /** @description create diff editor overview ruler if enabled */
            if (!this._options.renderOverviewRuler.read(reader)) {
                return;
            }
            const viewportDomElement = createFastDomNode(document.createElement('div'));
            viewportDomElement.setClassName('diffViewport');
            viewportDomElement.setPosition('absolute');
            const diffOverviewRoot = h('div.diffOverview', {
                style: { position: 'absolute', top: '0px', width: OverviewRulerPart_1.ENTIRE_DIFF_OVERVIEW_WIDTH + 'px' }
            }).root;
            store.add(appendRemoveOnDispose(diffOverviewRoot, viewportDomElement.domNode));
            store.add(addStandardDisposableListener(diffOverviewRoot, EventType.POINTER_DOWN, (e) => {
                this._editors.modified.delegateVerticalScrollbarPointerDown(e);
            }));
            store.add(addDisposableListener(diffOverviewRoot, EventType.MOUSE_WHEEL, (e) => {
                this._editors.modified.delegateScrollFromMouseWheelEvent(e);
            }, { passive: false }));
            store.add(appendRemoveOnDispose(this._rootElement, diffOverviewRoot));
            store.add(autorunWithStore((reader, store) => {
                /** @description recreate overview rules when model changes */
                const m = this._diffModel.read(reader);
                const originalOverviewRuler = this._editors.original.createOverviewRuler('original diffOverviewRuler');
                if (originalOverviewRuler) {
                    store.add(originalOverviewRuler);
                    store.add(appendRemoveOnDispose(diffOverviewRoot, originalOverviewRuler.getDomNode()));
                }
                const modifiedOverviewRuler = this._editors.modified.createOverviewRuler('modified diffOverviewRuler');
                if (modifiedOverviewRuler) {
                    store.add(modifiedOverviewRuler);
                    store.add(appendRemoveOnDispose(diffOverviewRoot, modifiedOverviewRuler.getDomNode()));
                }
                if (!originalOverviewRuler || !modifiedOverviewRuler) {
                    // probably no model
                    return;
                }
                const origViewZonesChanged = observableSignalFromEvent('viewZoneChanged', this._editors.original.onDidChangeViewZones);
                const modViewZonesChanged = observableSignalFromEvent('viewZoneChanged', this._editors.modified.onDidChangeViewZones);
                const origHiddenRangesChanged = observableSignalFromEvent('hiddenRangesChanged', this._editors.original.onDidChangeHiddenAreas);
                const modHiddenRangesChanged = observableSignalFromEvent('hiddenRangesChanged', this._editors.modified.onDidChangeHiddenAreas);
                store.add(autorun(reader => {
                    var _a;
                    /** @description set overview ruler zones */
                    origViewZonesChanged.read(reader);
                    modViewZonesChanged.read(reader);
                    origHiddenRangesChanged.read(reader);
                    modHiddenRangesChanged.read(reader);
                    const colors = currentColors.read(reader);
                    const diff = (_a = m === null || m === void 0 ? void 0 : m.diff.read(reader)) === null || _a === void 0 ? void 0 : _a.mappings;
                    function createZones(ranges, color, editor) {
                        const vm = editor._getViewModel();
                        if (!vm) {
                            return [];
                        }
                        return ranges
                            .filter(d => d.length > 0)
                            .map(r => {
                            const start = vm.coordinatesConverter.convertModelPositionToViewPosition(new Position(r.startLineNumber, 1));
                            const end = vm.coordinatesConverter.convertModelPositionToViewPosition(new Position(r.endLineNumberExclusive, 1));
                            // By computing the lineCount, we won't ask the view model later for the bottom vertical position.
                            // (The view model will take into account the alignment viewzones, which will give
                            // modifications and deletetions always the same height.)
                            const lineCount = end.lineNumber - start.lineNumber;
                            return new OverviewRulerZone(start.lineNumber, end.lineNumber, lineCount, color.toString());
                        });
                    }
                    const originalZones = createZones((diff || []).map(d => d.lineRangeMapping.original), colors.removeColor, this._editors.original);
                    const modifiedZones = createZones((diff || []).map(d => d.lineRangeMapping.modified), colors.insertColor, this._editors.modified);
                    originalOverviewRuler === null || originalOverviewRuler === void 0 ? void 0 : originalOverviewRuler.setZones(originalZones);
                    modifiedOverviewRuler === null || modifiedOverviewRuler === void 0 ? void 0 : modifiedOverviewRuler.setZones(modifiedZones);
                }));
                store.add(autorun(reader => {
                    /** @description layout overview ruler */
                    const height = this._rootHeight.read(reader);
                    const width = this._rootWidth.read(reader);
                    const layoutInfo = this._modifiedEditorLayoutInfo.read(reader);
                    if (layoutInfo) {
                        const freeSpace = OverviewRulerPart_1.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * OverviewRulerPart_1.ONE_OVERVIEW_WIDTH;
                        originalOverviewRuler.setLayout({
                            top: 0,
                            height: height,
                            right: freeSpace + OverviewRulerPart_1.ONE_OVERVIEW_WIDTH,
                            width: OverviewRulerPart_1.ONE_OVERVIEW_WIDTH,
                        });
                        modifiedOverviewRuler.setLayout({
                            top: 0,
                            height: height,
                            right: 0,
                            width: OverviewRulerPart_1.ONE_OVERVIEW_WIDTH,
                        });
                        const scrollTop = scrollTopObservable.read(reader);
                        const scrollHeight = scrollHeightObservable.read(reader);
                        const scrollBarOptions = this._editors.modified.getOption(102 /* EditorOption.scrollbar */);
                        const state = new ScrollbarState(scrollBarOptions.verticalHasArrows ? scrollBarOptions.arrowSize : 0, scrollBarOptions.verticalScrollbarSize, 0, layoutInfo.height, scrollHeight, scrollTop);
                        viewportDomElement.setTop(state.getSliderPosition());
                        viewportDomElement.setHeight(state.getSliderSize());
                    }
                    else {
                        viewportDomElement.setTop(0);
                        viewportDomElement.setHeight(0);
                    }
                    diffOverviewRoot.style.height = height + 'px';
                    diffOverviewRoot.style.left = (width - OverviewRulerPart_1.ENTIRE_DIFF_OVERVIEW_WIDTH) + 'px';
                    viewportDomElement.setWidth(OverviewRulerPart_1.ENTIRE_DIFF_OVERVIEW_WIDTH);
                }));
            }));
        }));
    }
};
OverviewRulerPart.ONE_OVERVIEW_WIDTH = 15;
OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH = OverviewRulerPart_1.ONE_OVERVIEW_WIDTH * 2;
OverviewRulerPart = OverviewRulerPart_1 = __decorate([
    __param(7, IThemeService)
], OverviewRulerPart);
export { OverviewRulerPart };
