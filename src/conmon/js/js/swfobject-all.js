var ttxVideoAll = {
    init: function (domId, width, height, params, playerType) {
        var path = this.getPath();
        this.playerPath = path + 'player.swf';
        this.domId = domId;
        this.width = width;
        this.height = height;
        this.version = '11.0.0';
        this.params = params;
        if (playerType === 'flash' || playerType === 'h5') {
            this.playerType = playerType;
        }
        if (this.isBrowseIE()) {
            this.playerType = 'flash';
        }
        if (!this.playerType && localStorage.playerType && localStorage.playerType === 'flash') {
            this.playerType = 'flash';
        }
        if (this.playerType === 'flash') {
            this.loadJs(path + "swfobject.js");
        } else {
            this.loadCss(path + "css/DPlayer.min.css");
            this.loadCss(path + "css/swfobject-h5.css");
            this.loadJs(path + "js/flv.min.js");
            this.loadJs(path + "js/DPlayer.min.js");
            this.loadJs(path + "js/swfobject-h5.js");
        }
        this.initTimer();
    },
    initTimer: function () {
        if (ttxVideoAll.playerType == 'flash') {
            if (typeof swfobject == "undefined") {
                setTimeout(this.initTimer, 300)
            } else {
                swfobject.embedSWF(ttxVideoAll.playerPath, ttxVideoAll.domId, ttxVideoAll.width, ttxVideoAll.height, "11.0.0", null, null, ttxVideoAll.params, null);
            }
        } else {
            if (typeof TtxH5Video == "undefined") {
                setTimeout(this.initTimer, 300)
            } else {
                var options = {
                    domId: ttxVideoAll.domId,
                    width: ttxVideoAll.width,
                    height: ttxVideoAll.height
                };
                if (ttxVideoAll.params.lang) {
                    options.lang = ttxVideoAll.params.lang
                }
                swfobject = new TtxH5Video(options);
            }
        }
    },
    getPath: function () {
        var scripts = document.getElementsByTagName('script')
        for (let i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src.indexOf('swfobject-all.js') > -1) {
                return src.replace(/[^\/]+$/, "");
            }
        }
        return '';
    },
    switchType: function (playerType) {
        if (this.isBrowseIE() && playerType != 'flash') {
            alert('ie浏览器只支持flash播放')
            return;
        }
        if (playerType !== 'flash' && playerType !== 'h5' && playerType !== 'auto') {
            return;
        }
        localStorage.playerType = playerType
        location.reload()
    },
    isBrowseIE: function () {
        return (this.getBrowseVersion().indexOf("msie") != -1) ? true : false;
    },
    getBrowseVersion: function () {
        var userAgent = navigator.userAgent.toLowerCase();
        var browser = userAgent.match(/(firefox|chrome|safari|opera|msie)/);
        var browserId = "msie";
        var browserVersion = "";
        var isIE11 = (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1);
        if (isIE11) {
            browserId = "msie";
            browserVersion = "11.0";
        } else {
            if (browser.length >= 2) {
                browserId = browser[1];
            } else {
                browserId = "msie";
            }
            browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:' + browserId + ')[\/: ]([\\d.]+)')) || [0, '0'])[1];
        }
        return browserId + browserVersion;
    },
    loadCss: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    loadJs: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}
export default ttxVideoAll;