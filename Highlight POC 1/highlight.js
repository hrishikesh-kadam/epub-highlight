document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

var currentHighlightId;

function onClickBody() {
    console.log("-> onClickBody");
}

function onDOMContentLoaded() {
    console.log("-> onDOMContentLoaded");
    document.onkeypress = onKeyPressed;
}

var onKeyPressed = function (e) {
    console.log("-> onKeyPressed -> " + e.key);

    switch (e.key) {

        case "h":
            highlightCurrentSelection();
            break;

        case "d":
            deleteHighlight();
            break;

        case "c":
            getSelectionCfi();
            break;

        case "t":
            test();
            break;
    }
};

function test() {
    console.log("-> test");

    // var $obj1 = EPUBcfi.Interpreter.getTextTerminusInfoWithPartialCFI("epubcfi(/4/2/4/1:152)", document, ["highlight"]);
    // console.log($obj1);
    //
    // var $obj2 = EPUBcfi.Interpreter.getTextTerminusInfoWithPartialCFI("epubcfi(/4/2/4/1:168)", document, ["highlight"]);
    // console.log($obj2);

    // var $obj = EPUBcfi.Interpreter.getRangeTargetElements("epubcfi(/4/2[introduction]/4,/1:152,/1:168)",
    //     document, ["highlight"]);

    // var $obj = EPUBcfi.Interpreter.getRangeTargetElements("epubcfi(/4/2[introduction]/4/4,/1:2,/1:5)",
    //     document);

    // var $obj = EPUBcfi.Interpreter.getRangeTargetElements("epubcfi(/0!/4/2[introduction]/4/4,/1:2,/1:5)",
    //     document);

    var $obj = EPUBcfi.Interpreter.getTargetElement("epubcfi(/0!/4/2[introduction]/4/8)",
        document);

    // var $obj = EPUBcfi.Interpreter.getTargetElementWithPartialCFI("epubcfi(/4/2/4/2)", document, ["highlight"]);

    console.log($obj);

}

function getSelectionCfi() {
    console.log("-> getSelectionCfi");

    var range = window.getSelection().getRangeAt(0);
    var cfi = EPUBcfi.Generator.generateDocumentRangeComponent(range);
    console.log(range);
    console.log("-> getSelectionCfi -> cfi = " + cfi);
}

function highlightCurrentSelection() {

    getSelectionCfi();
    var range = window.getSelection().getRangeAt(0);
    highlightRange(range);
    window.getSelection().removeRange(range);
}

/**
 * @param {Range} range
 */
function highlightRange(range) {

    var selectedText = range.toString();
    console.log("-> highlightRange -> " + selectedText);

    var highlightId = UUID.generate();

    if (range.startContainer === range.endContainer) {
        highlightRangeWithSameContainer(range, highlightId);

    } else {
        var startContainer = range.startContainer;
        var startRange = document.createRange();
        startRange.setStart(startContainer, range.startOffset);
        startRange.setEnd(startContainer, startContainer.length);
        console.log("-> startRange -> see below");
        console.log(startRange);

        var endContainer = range.endContainer;
        var endRange = document.createRange();
        endRange.setStart(endContainer, 0);
        endRange.setEnd(endContainer, range.endOffset);
        console.log("-> endRange -> see below");
        console.log(endRange);

        var textNodes = collectIntermediateTextNodes(range, startRange, endRange);
        console.log(textNodes);
        highlightTextNodes(textNodes, highlightId);

        highlightRangeWithSameContainer(startRange, highlightId);
        highlightRangeWithSameContainer(endRange, highlightId);
    }
}

function highlightRangeWithSameContainer(range, highlightId) {

    var documentFragment = range.extractContents();
    var highlightElement = createHighlightElement(documentFragment, highlightId);
    range.insertNode(highlightElement);
    return highlightElement;
}

/**
 * @param {Range} originalRange
 * @param {Range} startRange
 * @param {Range} endRange
 * @returns {Array}
 */
function collectIntermediateTextNodes(originalRange, startRange, endRange) {

    var textNodes = [];

    collectTextNodeInRange(originalRange.commonAncestorContainer, startRange.startContainer,
        endRange.startContainer, textNodes);
    textNodes.shift();
    textNodes.pop();

    return textNodes;
}

/**
 * @param {Node} node
 * @param {Text} startTextNode
 * @param {Text} endTextNode
 * @param {Array} textNodes
 */
function collectTextNodeInRange(node, startTextNode, endTextNode, textNodes) {

    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];

        if (childNode.nodeType === Node.TEXT_NODE) {
            if (childNode === startTextNode) {
                textNodes.push(childNode);
            } else if (childNode === endTextNode) {
                textNodes.push(childNode);
                return;
            } else if (textNodes.length > 0) {
                if (childNode.textContent.trim() !== "")
                    textNodes.push(childNode);
            }
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {

            collectTextNodeInRange(childNode, startTextNode, endTextNode, textNodes);
            if (textNodes.length > 0) {
                if (textNodes[textNodes.length - 1] === endTextNode) {
                    return;
                }
            }
        }
    }
}

/**
 * @param {Node} parentNode
 * @param {Node} childNode
 * @returns {number}
 */
function getIndexOfChildNode(parentNode, childNode) {

    var childNodes = parentNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] === childNode)
            return i;
    }
    return -1;
}

function createHighlightElement(documentFragment, id) {

    var highlightElement = document.createElement("span");
    highlightElement.classList.add("highlight");
    highlightElement.setAttribute("onclick", "onClickHighlight(this)");
    highlightElement.setAttribute("highlight-id", id);
    highlightElement.appendChild(documentFragment);
    return highlightElement;
}

/**
 * @param {Text[]} textNodes
 */
function highlightTextNodes(textNodes, id) {

    for (var i = 0; i < textNodes.length; i++) {
        var textNode = textNodes[i];
        var range = document.createRange();
        range.selectNode(textNode);
        var textNodeFragment = range.extractContents();
        var highlightElement = createHighlightElement(textNodeFragment, id);
        range.insertNode(highlightElement);
    }
}

function onClickHighlight(element) {
    console.log("-> onClickHighlight");
    currentHighlightId = element.getAttribute("highlight-id");
}

function deleteHighlight() {
    console.log("-> deleteHighlight");

    var highlightElements = document.querySelectorAll("[highlight-id=\"" + currentHighlightId + "\"]");
    console.log(highlightElements);

    highlightElements.forEach(function (highlightElement) {
        highlightElement.outerHTML = highlightElement.innerHTML;
    });

    currentHighlightId = null;
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
var UUID = (function () {
    var self = {};
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    self.generate = function () {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };
    return self;
})();