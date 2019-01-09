document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    console.log("-> onDOMContentLoaded");
    document.onkeypress = onKeyPressed;
    document.documentElement.onclick = onClickHtml;
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

        case "u":
            underlinedHighlight();
            break;

        case "a":
            initHorizontalDirection();
            break;

        case "d":
            deleteClickedHighlight();
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
    console.debug(range);
    console.debug("-> getSelectionCfi -> cfi = " + cfi);
}

function onClickHtml(event) {
    console.debug("-> onClickHtml");
    Highlight.clickedHighlight = null;

    if (FolioWebView.isPopupShowing()) {
        FolioWebView.dismissPopupWindow();
        return;
    }

    var groupElement = anyHighlightClicked(event);
    if (groupElement === null) {
        FolioWebView.toggleSystemUI();
        return;
    } else {
        console.debug("-> onClickHtml -> Following highlight clicked");
        console.debug(groupElement);
        Highlight.clickedHighlight = groupElement;
        console.log(window);
        return;
    }
}
