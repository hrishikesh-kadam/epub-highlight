var Highlight = {
    clickedHighlight: null
};

function highlight() {
    console.log("-> highlight");

    var range = window.getSelection().getRangeAt(0);
    var cfi = EPUBcfi.Generator.generateDocumentRangeComponent(range);
    cfi = EPUBcfi.Generator.generateCompleteCFI("/0!", cfi);
    console.debug(range);
    console.debug("-> highlight -> cfi = " + cfi);

    console.debug(range.getBoundingClientRect());
    console.debug(range.getClientRects());

    var svgElement = getHighlightSvgElement();
    var rectList = range.getClientRects();

    if (rectList.length === 0) {
        console.warn("-> highlight -> rectList.length == 0");
        return;
    }

    var groupElement = createHighlightGroupElement(cfi);

    for (var i = 0; i < rectList.length; i++) {
        var rect = rectList[i];
        var rectElement = createRectElement(rect, "svg-highlight-green");
        groupElement.appendChild(rectElement);
    }

    svgElement.appendChild(groupElement);
    window.getSelection().removeRange(range);
}

function underlinedHighlight() {
    console.log("-> underlinedHighlight");

    var range = window.getSelection().getRangeAt(0);
    var cfi = EPUBcfi.Generator.generateDocumentRangeComponent(range);
    cfi = EPUBcfi.Generator.generateCompleteCFI("/0!", cfi);
    console.debug(range);
    console.debug("-> underlinedHighlight -> cfi = " + cfi);

    console.debug(range.getBoundingClientRect());
    console.debug(range.getClientRects());

    var svgElement = getHighlightSvgElement();
    var rectList = range.getClientRects();

    if (rectList.length === 0) {
        console.warn("-> underlinedHighlight -> rectList.length == 0");
        return;
    }

    var groupElement = createHighlightGroupElement(cfi);

    for (var i = 0; i < rectList.length; i++) {
        var rect = rectList[i];
        var rectElement = createRectElement(rect);
        groupElement.appendChild(rectElement);
        var lineElement = createLineElement(rectElement);
        groupElement.appendChild(lineElement);
    }

    svgElement.appendChild(groupElement);
    window.getSelection().removeRange(range);
}

/**
 * @return {SVGElement}
 */
function getHighlightSvgElement() {

    var svgElement = document.getElementById("svg-highlight");
    if (svgElement == null) {
        svgElement = createHighlightSvgElement();
        document.body.appendChild(svgElement);
        //document.body.appendChild(createTempPElement());
    }
    return svgElement;
}

function createTempPElement() {

    var pElement = document.createElement("p");
    pElement.innerText = "Temp p element";
    return pElement;
}

function createHighlightSvgElement() {

    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute("id", "svg-highlight");
    svgElement.setAttribute("class", "svg-highlight");
    svgElement.style.position = "absolute";
    svgElement.style.left = appendPx(0);
    svgElement.style.top = appendPx(0);
    svgElement.style.zIndex = "-1";
    svgElement.style.width = appendPx(document.scrollingElement.scrollWidth);
    svgElement.style.height = appendPx(document.scrollingElement.scrollHeight);
    return svgElement;
}

function createHighlightGroupElement(cfi) {

    var groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    groupElement.setAttribute("epubcfi", cfi);
    return groupElement;
}

/**
 * @param {DOMRect} rect
 * @param {string} className
 * @returns {SVGRectElement}
 */
function createRectElement(rect, className) {

    var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    if (className !== undefined) {
        rectElement.setAttribute("class", className);
    }
    var translatedX = rect.x + document.scrollingElement.scrollLeft;
    var translatedY = rect.y + document.scrollingElement.scrollTop;
    rectElement.setAttribute("x", appendPx(translatedX));
    rectElement.setAttribute("y", appendPx(translatedY));
    rectElement.setAttribute("width", appendPx(rect.width));
    rectElement.setAttribute("height", appendPx(rect.height));
    return rectElement;
}

/**
 * @param {SVGRectElement} rectElement
 * @return {SVGLineElement}
 */
function createLineElement(rectElement) {

    var lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineElement.setAttribute("class", "svg-highlight-underline-red");
    // TODO -> try to get stroke-width from css in js
    var strokeWidth = 2;
    var translatedY = rectElement.y.baseVal.value + rectElement.height.baseVal.value + (strokeWidth / 2);
    lineElement.setAttribute("x1", appendPx(rectElement.x.baseVal.value));
    lineElement.setAttribute("y1", appendPx(translatedY));
    lineElement.setAttribute("x2",
        appendPx(rectElement.x.baseVal.value + rectElement.width.baseVal.value));
    lineElement.setAttribute("y2", appendPx(translatedY));
    return lineElement;
}

/**
 * @param {MouseEvent} event
 * @return {SVGGElement | null}
 */
function anyHighlightClicked(event) {
    console.log("-> anyHighlightClicked");
    console.debug(event);

    var highlightSvgElement = getHighlightSvgElement();
    var groupCollection = highlightSvgElement.children;

    for (var i = groupCollection.length - 1; i >= 0; i--) {

        var groupElement = groupCollection[i];
        var clickInsideGroupElement = isClickInsideElement(event, groupElement);
        if (clickInsideGroupElement) {

            var svgElementCollection = groupElement.children;
            for (var j = 0; j < svgElementCollection.length; j++) {

                var svgElement = svgElementCollection[j];
                var clickInsideSvgElement = isClickInsideElement(event, svgElement);
                if (clickInsideSvgElement) {
                    return groupElement;
                }
            }
        }
    }

    return null;
}

function deleteClickedHighlight() {
    console.debug("-> deleteClickedHighlight");

    if (Highlight.clickedHighlight == null) {
        return;
    }

    var highlightSvgElement = getHighlightSvgElement();
    highlightSvgElement.removeChild(Highlight.clickedHighlight);
    Highlight.clickedHighlight = null;
}
