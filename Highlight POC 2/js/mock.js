// Mocked @JavascriptInterface function from Android

var FolioPageFragment = {

    setHorizontalPageCount: function (pageCount) {
        console.warn("-> Mock call to FolioPageFragment.setHorizontalPageCount(" + pageCount + ")");
    }
};

var FolioWebView = {

    isPopupShowing: function () {
        var popupShowing = false;
        console.warn("-> Mock call to FolioWebView.isPopupShowing(), returning " + popupShowing);
        return popupShowing;
    },

    dismissPopupWindow: function () {
        console.warn("-> Mock call to FolioWebView.dismissPopupWindow()");
    },

    toggleSystemUI: function () {
        console.warn("-> Mock call to FolioWebView.toggleSystemUI()");
    }
};