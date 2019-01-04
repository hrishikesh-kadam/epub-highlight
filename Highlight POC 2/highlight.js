document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    console.log("-> onDOMContentLoaded");
    document.onkeypress = onKeyPressed;
}

var onKeyPressed = function (e) {
    console.log("-> onKeyPressed -> " + e.key);

    switch (e.key) {

        case "c":
            getSelectionCfi();
            break;

        case "h":
            highlight();
            break;

        case "a":
            initHorizontalDirection();
            break;

        case "1":
            test1();
            break;

        case "2":
            test2();
            break;
    }
};

function test1() {
    console.log("-> test1");

    var highlightElement = document.createElement("span");
    highlightElement.style.position = "absolute";
    highlightElement.style.width = "150px";
    highlightElement.style.height = "20px";
    highlightElement.style.left = "100px";
    highlightElement.style.top = "100px";
    //highlightDiv.style.backgroundColor = "#00FF00";
    highlightElement.classList.add("highlight-green");
    highlightElement.style.zIndex = "-1";

    highlightElement.setAttribute("onclick", "onClickHighlightTest1(this)");

    document.body.appendChild(highlightElement);
}

function test2() {
    console.log("-> test2");

    var highlightElement = document.createElement("span");
    highlightElement.style.position = "absolute";
    highlightElement.style.width = "150px";
    highlightElement.style.height = "20px";
    highlightElement.style.left = "100px";
    highlightElement.style.top = "100px";
    //highlightDiv.style.backgroundColor = "#00FF00";
    highlightElement.classList.add("highlight-green-alpha");
    highlightElement.style.zIndex = "99";

    highlightElement.setAttribute("onclick", "onClickHighlightTest2(this)");

    document.body.appendChild(highlightElement);
}

function onClickHighlightTest1(element) {
    console.log("-> onClickHighlightTest1");
}

function onClickHighlightTest2(element) {
    console.log("-> onClickHighlightTest2");
}

function getSelectionCfi() {
    console.log("-> getSelectionCfi");

    var range = window.getSelection().getRangeAt(0);
    var cfi = EPUBcfi.Generator.generateDocumentRangeComponent(range);
    console.log(range);
    console.log("-> getSelectionCfi -> cfi = " + cfi);
}

function highlight() {
    console.log("-> highlight");

    var range = window.getSelection().getRangeAt(0);
    var cfi = EPUBcfi.Generator.generateDocumentRangeComponent(range);
    cfi = EPUBcfi.Generator.generateCompleteCFI("/0!", cfi);
    console.log(range);
    console.log("-> highlight -> cfi = " + cfi);

    console.log(range.getBoundingClientRect());
    console.log(range.getClientRects());

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
 * @param rect {DOMRect}
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

var horizontalInterval;
var horizontalIntervalPeriod = 1000;
var horizontalIntervalCounter = 0;
var horizontalIntervalLimit = 3000;

function horizontalRecheck() {

    horizontalIntervalCounter += horizontalIntervalPeriod;

    if (window.scrollWidth !== document.documentElement.scrollWidth) {
        // Rare condition
        // This might happen when document.documentElement.scrollWidth gives incorrect value
        // when the webview is busy re-drawing contents.
        //console.log("-> horizontalIntervalCounter = " + horizontalIntervalCounter);
        console.warn("-> scrollWidth changed from " + window.scrollWidth + " to " +
            document.documentElement.scrollWidth);
        postInitHorizontalDirection();
    }

    if (horizontalIntervalCounter >= horizontalIntervalLimit)
        clearInterval(horizontalInterval);
}

function initHorizontalDirection() {

    preInitHorizontalDirection();
    postInitHorizontalDirection();

    horizontalInterval = setInterval(horizontalRecheck, horizontalIntervalPeriod);
}

function preInitHorizontalDirection() {

    //console.log(window);
    //console.log("-> " + document.getElementsByTagName('title')[0].innerText);
    var htmlElement = document.getElementsByTagName('html')[0];
    var bodyElement = document.getElementsByTagName('body')[0];

    // Required when initHorizontalDirection() is called multiple times.
    // Currently it is called only once per page.
    htmlElement.style.width = null;
    bodyElement.style.width = null;
    htmlElement.style.height = null;
    bodyElement.style.height = null;

    var bodyStyle = bodyElement.currentStyle || window.getComputedStyle(bodyElement);
    var paddingTop = parseInt(bodyStyle.paddingTop, 10);
    var paddingRight = parseInt(bodyStyle.paddingRight, 10);
    var paddingBottom = parseInt(bodyStyle.paddingBottom, 10);
    var paddingLeft = parseInt(bodyStyle.paddingLeft, 10);
    //console.log("-> padding = " + paddingTop + ", " + paddingRight + ", " + paddingBottom + ", " + paddingLeft);

    //document.documentElement.clientWidth is window.innerWidth excluding x scrollbar width
    var pageWidth = document.documentElement.clientWidth - (paddingLeft + paddingRight);
    //document.documentElement.clientHeight is window.innerHeight excluding y scrollbar height
    var pageHeight = document.documentElement.clientHeight - (paddingTop + paddingBottom);

    bodyElement.style.columnGap = (paddingLeft + paddingRight) + 'px';
    bodyElement.style.columnWidth = pageWidth + 'px';
    bodyElement.style.columnFill = 'auto';

    //console.log("-> window.innerWidth = " + window.innerWidth);
    //console.log("-> window.innerHeight = " + window.innerHeight);
    //console.log("-> clientWidth = " + document.documentElement.clientWidth);
    //console.log("-> clientHeight = " + document.documentElement.clientHeight);
    //console.log("-> bodyElement.offsetWidth = " + bodyElement.offsetWidth);
    //console.log("-> bodyElement.offsetHeight = " + bodyElement.offsetHeight);
    //console.log("-> pageWidth = " + pageWidth);
    //console.log("-> pageHeight = " + pageHeight);

    htmlElement.style.height = (pageHeight + (paddingTop + paddingBottom)) + 'px';
    bodyElement.style.height = pageHeight + 'px';
}

function postInitHorizontalDirection() {

    var htmlElement = document.getElementsByTagName('html')[0];
    var bodyElement = document.getElementsByTagName('body')[0];
    var bodyStyle = bodyElement.currentStyle || window.getComputedStyle(bodyElement);
    var paddingTop = parseInt(bodyStyle.paddingTop, 10);
    var paddingRight = parseInt(bodyStyle.paddingRight, 10);
    var paddingBottom = parseInt(bodyStyle.paddingBottom, 10);
    var paddingLeft = parseInt(bodyStyle.paddingLeft, 10);
    var clientWidth = document.documentElement.clientWidth;

    var scrollWidth = document.documentElement.scrollWidth;
    //console.log("-> document.documentElement.offsetWidth = " + document.documentElement.offsetWidth);
    if (scrollWidth > clientWidth
        && scrollWidth > document.documentElement.offsetWidth) {
        scrollWidth += paddingRight;
    }
    var newBodyWidth = scrollWidth - (paddingLeft + paddingRight);
    window.scrollWidth = scrollWidth;

    htmlElement.style.width = scrollWidth + 'px';
    bodyElement.style.width = newBodyWidth + 'px';

    // pageCount deliberately rounded instead of ceiling to avoid any unexpected error
    var pageCount = Math.round(scrollWidth / clientWidth);
    var pageCountFloat = scrollWidth / clientWidth;

    if (pageCount !== pageCountFloat) {
        console.warn("-> pageCount = " + pageCount + ", pageCountFloat = " + pageCountFloat
            + ", Something wrong in pageCount calculation");
    }

    //console.log("-> scrollWidth = " + scrollWidth);
    //console.log("-> newBodyWidth = " + newBodyWidth);
    //console.log("-> pageCount = " + pageCount);

    //FolioPageFragment.setHorizontalPageCount(pageCount);
}

function appendPx(dim) {
    return dim + "px";
}
