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
        console.warn("-> rectList.length == 0");
    }

    var groupElement = createHighlightGroupElement(cfi);

    for (var i = 0; i < rectList.length; i++) {
        var rect = rectList[i];
        var rectElement = createRectElement(rect);
        groupElement.appendChild(rectElement);
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
    groupElement.setAttribute("class", "svg-highlight-green");
    return groupElement;
}

/**
 * @param {DOMRect} rect
 * @returns {HTMLElement}
 */
function createRectElement(rect) {

    var rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    var translatedX = rect.x + document.scrollingElement.scrollLeft;
    var translatedY = rect.y + document.scrollingElement.scrollTop;
    rectElement.setAttribute("x", appendPx(translatedX));
    rectElement.setAttribute("y", appendPx(translatedY));
    rectElement.setAttribute("width", appendPx(rect.width));
    rectElement.setAttribute("height", appendPx(rect.height));
    return rectElement;
}

/**
 * @param {MouseEvent} event
 * @return {SVGGElement | null}
 */
function onClickHighlight(event) {
    console.log("-> onClickHighlight");
    console.debug(event);

    var highlightSvgElement = getHighlightSvgElement();
    var groupCollection = highlightSvgElement.children;

    for (var i = 0; i < groupCollection.length; i++) {

        var groupElement = groupCollection[i];
        var clickInsideGroupElement = isClickInsideElement(event, groupElement);
        if (clickInsideGroupElement) {

            var rectCollection = groupElement.children;
            for (var j = 0; j < rectCollection.length; j++) {

                var rectElement = rectCollection[j];
                var clickInsideRectElement = isClickInsideElement(event, rectElement);
                if (clickInsideRectElement) {
                    return groupElement;
                }
            }
        }
    }

    return null;
}
