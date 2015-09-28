;(function() {
    "use strict";

    var elems = document.querySelectorAll("input, textarea, [contenteditable]");

    var onelemfocus, onelemblur;

    var isKeyboardShown = false;
    var keyboardShowing, keyboardHiding;
    var fieldBlur = null;
    var currentInnerHeight;
    var currIndex = 0, prevIndex = 0;
    var isAClick = false;

    onelemfocus = function(evt) {
        var that = this;

        prevIndex = currIndex;
        currIndex = evt.target.dataset.servantIndex;

        if (!isKeyboardShown) {
            currentInnerHeight = window.innerHeight;
            keyboardShowing = window.setInterval(function() {
                if (currentInnerHeight === window.innerHeight) {
                    window.clearInterval(keyboardShowing);

                    var evtAfter = document.createEvent("Event");
                    evtAfter.initEvent('keyboardshow', true, true);
                    that.dispatchEvent(evtAfter);
                    isKeyboardShown = true;
                }
                currentInnerHeight = window.innerHeight;
            }, 20);
        } else {
            window.clearTimeout(fieldBlur);
        }

        if (!isAClick) {
            var evtName;
            
            if (prevIndex < currIndex) {
                evtName = "nextbuttonclick";
            } else {
                evtName = "previousbuttonclick";
            }

            var evtPrevNext = document.createEvent("Event");
            evtPrevNext.initEvent(evtName, true, true);
            that.dispatchEvent(evtPrevNext);
        }
    };

    onelemblur = function(evt) {
        var that = this;

        fieldBlur = window.setTimeout(function() {
            var evtBefore = document.createEvent("Event");
            evtBefore.initEvent('keyboardhide', true, true);
            that.dispatchEvent(evtBefore);
            isKeyboardShown = false;
        },1);
    };

    [].forEach.call(elems, function(elem, i) {
        elem.dataset.servantIndex = elem.getAttribute("tabindex") || (i + 1);
        elem.addEventListener("focus", onelemfocus, false);
        elem.addEventListener("blur", onelemblur, false);
    });

    // Hide keyboard when clicking document
    var pageXO, pageYO;
    document.documentElement.addEventListener("touchstart", function(evt) {
        // Prevent keyboardhide when scrolling while keyboard is visible
        pageXO = window.pageXOffset;
        pageYO = window.pageYOffset;
        isAClick = true;
        window.setTimeout(function() {
            isAClick = false;
        }, 1000);
    });

    document.documentElement.addEventListener("touchend", function(evt) {
        if (pageXO !== window.pageXOffset || pageYO !== window.pageYOffset) {
            return false;
        }
        
        var nodeName = evt.target.nodeName.toLowerCase();

        if (nodeName !== "input" && nodeName !== "textarea" && nodeName !== "select") {
            document.activeElement.blur();
        }
    });
}());
