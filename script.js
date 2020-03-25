// bootstrap qw from runeappslib.js since minimap.js uses it
qw = function(){};

var playerDot = null;
ImageData.fromBase64(function (result) { 
    playerDot = result; 
}, "iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV/TiiIVB4tocchQnSyIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi5Oik6CIl/i8ptIjx4Lgf7+497t4BQqPCVDMwAaiaZaTiMTGbWxW7X+HHMAYRQFhipp5IL2bgOb7u4ePrXZRneZ/7c/QpeZMBPpF4jumGRbxBPLNp6Zz3iUOsJCnE58TjBl2Q+JHrsstvnIsOCzwzZGRS88QhYrHYwXIHs5KhEk8TRxRVo3wh67LCeYuzWqmx1j35C4N5bSXNdZojiGMJCSQhQkYNZVRgIUqrRoqJFO3HPPxhx58kl0yuMhg5FlCFCsnxg//B727NwtSkmxSMAV0vtv0xCnTvAs26bX8f23bzBPA/A1da219tALOfpNfbWuQI6N8GLq7bmrwHXO4AQ0+6ZEiO5KcpFArA+xl9Uw4YuAV619zeWvs4fQAy1NXyDXBwCIwVKXvd4909nb39e6bV3w9STnKavhnvdQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+QDGRYKHaryymAAAAA+SURBVAgdATMAzP8Ar6ecAP//////////pp6TAAH/////AAAAAPf39wDn5ucAAHV1dQDy8PL/3dvd/15dXgBGwB83YaWK7QAAAABJRU5ErkJggg==");

var minimapReader = new MinimapReader();
var minimap = null;

var minimapRefreshInterval = 5000;
var playerFinderInterval = 1000;

var Status = {
    STARTING: {
        id: "STARTING",
        text: "Starting...",
        class: "paused"
    },
    PAUSED: {
        id: "PAUSED",
        text: "Paused",
        class: "paused"
    },
    RUNNING: {
        id: "RUNNING",
        text: "OK",
        class: "ok"
    },
    ALERT: {
        id: "ALERT",
        text: "PLAYERS DETECTED!",
        class: "alert"
    }
};

var status = Status.PAUSED.id;

var statusText = null;
var container = null;
var stateButton = null;

function start() {
    statusText = document.getElementById("status");

    if (!window.alt1) {
        statusText.innerText = "Alt1 not detected!";
        return false;
    }
    
    container = document.getElementById("container");
    stateButton = document.getElementById("state-button");
    
    setStatus(Status.STARTING);

    findMinimap();
    setInterval(function() {
        findMinimap();
    }, minimapRefreshInterval);

    setInterval(function() {
        if (!minimap || status == Status.PAUSED.id) {
            return;
        }

        var minimapRegion = a1lib.getregion(minimap.x, minimap.y, minimap.w, minimap.h);
        var players = findPlayers(minimapRegion);
        setStatus(players > 0 ? Status.ALERT : Status.RUNNING);
    }, playerFinderInterval);
}

function changeState() {
    if (window.status != Status.PAUSED.id) {
        setStatus(Status.PAUSED);
    } else {
        setStatus(Status.RUNNING);
    }
}

function setStatus(status) {
    if (statusText) {
        statusText.innerText = status.text;
    }
    if (container) {
        container.className = status.class;
    }

    if (stateButton) {
        var stateButtonText = status.id == Status.PAUSED.id ? "Start" : "Pause";
        stateButton.innerText = stateButtonText;
    }

    window.status = status.id;
}

function findPlayers(minimapRegion) {
    if (!minimap) {
        return 0;
    }
    return a1lib.findsubimg(minimapRegion, playerDot).length;
}

function findMinimap() {
    minimap = minimapReader.find();
}