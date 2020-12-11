var swfobjectH5 = function (undefined) {
    "use strict"
    var _global;

    function extend(o, n, override) {
        for (var key in n) {
            if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                o[key] = n[key];
            }
        }
        return o;
    }

    function TtxH5Video(opt) {
        this._initial(opt);
    }

    TtxH5Video.prototype = {
        constructor: this,

        _initial: function (opt) {
            // 默认参数
            var options = {
                domId: '',
                live: true,
                screenshot: true,
                autoplay: true,
                mutex: false,
                width: 400,
                height: 400,
                loop: false,
                volume: 0,
                lang: 'zh-cn', //可选值: 'en', 'zh-cn', 'zh-tw'
                contextmenu: [],
                viewSize: 'full',
                needSeek: false,
                tbarBgColor: {},
                rightMousedown: function () {

                }
            };
            this.options = extend(options, opt, true);
            this.options.contextmenu = this.options.contextmenu.concat([{
                text: 'cmsv6 20200103',
                click: function () {

                }
            }]);
            if (this.options.lang.indexOf('cn.xml') > -1) {
                this.options.lang = 'zh-cn'
            }
            if (this.options.lang.indexOf('tw.xml') > -1) {
                this.options.lang = 'zh-tw'
            }
            if (this.options.lang.indexOf('en.xml') > -1) {
                this.options.lang = 'en'
            }
            this.itemPre = 'TtxH5Video';
            this.listeners = [];
            this.handlers = {};
            this.num = 1;
            this.lastIndex = 1;
            this.playVideos = {};
            this.playVideosTimer = {};
            this.videoText = {};
            this.devInfoMap = {};
            this.reloadMap = {};
            this.reloadMapTime = {};
            this.initEventType();
            this.serverInfoMap = {};
            this.mediaPortMap = {};
            this.timeMap808 = {};
            this.speedZeroNum = {};
            this.beforeReconnectionVolume = {};
            this.playWating = false;
            this.playWatingTimer = null;
            this.playWatingNum = 0;
            this.soundDomId = 'ttxH5VideoSound';
            this.winDom = $('#' + this.options.domId);
            this.winDom.empty();
            this.winDom.css('width', this.options.width).css('height', this.options.height).addClass('ttx-video-h5');
            this.bindEvent()
        },
        initEventType: function () {
            this.eventType = {
                select: 'select',//窗口事件
                full: 'full',//全屏
                norm: 'norm',//退出全屏
                stop: 'stop',//停止播放
                start: 'start',//开始播放
                sound: 'sound',//开启声音
                silent: 'silent',//静音
                play: 'play',//暂停或停止后重新播放
                PicSave: 'PicSave',//截图
                startRecive: 'startRecive',//开启对讲
                uploadRecive: 'uploadRecive',//开启对讲
                loadRecive: 'loadRecive',//开启对讲
                stopTalk: 'stopTalk', //关闭对讲
                playRecive: 'playRecive',//对讲中
                reciveStreamStop: 'reciveStreamStop',//对讲异常(网络异常等)
                reciveNetError: 'reciveNetError',//对讲异常(网络异常等)
                reciveStreamNotFound: 'reciveStreamNotFound',//对讲异常(网络异常等)
                uploadNetClosed: 'uploadNetClosed',//连接异常
                uploadNetError: 'uploadNetError',//连接异常
                upload: 'upload',//对讲讲话
                uploadfull: 'uploadfull',//对讲讲话结束
                startListen: 'startListen',//开始监听
                stopListen: 'stopListen',//主动停止监听
                listenNetError: 'listenNetError',//网络异常
                playListen: 'playListen',//监听中
                loadListen: 'loadListen',//等待请求监听
                listenStreamNotFound: 'listenStreamNotFound',//等待请求监听
                listenStreamStop: 'listenStreamStop',//等待请求监听
            }
        },
        playAll: function () {
            for (var index in this.playVideos) {
                this.playVideos[index].play()
            }
        },
        pauseAll: function () {
            for (var index in this.playVideos) {
                this.playVideos[index].pause()
            }
        },
        setWindowNum: function (num) {
            if (!num) {
                return;
            }
            num = parseInt(num);
            $('.ttx-video-h5-item-full').removeClass('ttx-video-h5-item-full')
            num = num > 36 ? 36 : num;
            this.num = num;
            this.winDom.children().addClass('hide');
            var itemClass;
            if (num == 8) {
                itemClass = 'video-basis-4'
            } else {
                itemClass = 'video-basis-' + Math.ceil(Math.sqrt(num))
            }

            for (var i = 0; i < num; i++) {
                var itemId = this.itemPre + '-' + i;
                var _item = $('#' + itemId);
                var itemClassTmp = itemClass;
                if ((num == 6 || num == 8) && i === 0) {
                    itemClassTmp = 'video-basis-' + num + '-1'
                }
                if (_item.length === 0) {
                    var item = $("<div data-index='" + i + "' class='ttx-video-h5-item " + itemClassTmp + "' id='" + itemId + "'></div>");
                    this.winDom.append(item);
                    this.bindItemEvent(item)
                } else {
                    var classArr = _item.attr('class').split(' ');
                    classArr = classArr.filter(function (s) {
                        return s.indexOf('video-basis-') === -1;
                    })
                    _item.attr('class', classArr.join(' '));
                    _item.addClass('ttx-video-h5-item').addClass(itemClassTmp).removeClass('hide').show();
                }
            }
            if (!this.selectIndex) {
                $('.ttx-video-h5-item:eq(0)').click();
            }
            this.setVideoFrame();
        },
        setSize: function (width, height) {
            this.options.width = width
            this.options.height = height
            this.winDom.css('width', this.options.width).css('height', this.options.height)
        },
        getObjectById: function () {
            return this;
        },
        setServerInfo: function (serverIp, serverPort) {
            this.options.serverIp = serverIp;
            this.options.serverPort = serverPort;
        },
        setVideoServer: function (index, serverIp, serverPort) {
            index = index.toString();
            this.serverInfoMap[index] = {
                serverIp: serverIp,
                serverPort: serverPort
            }
        },
        stopVideo: function (index) {
            var that = this
            if (index >= this.num) {
                return
            }
            // this.reSetVideo(index)
            var video = this.playVideos[index];
            if (video) {
                video.pause();
                video.video.currentTime = 0;
                try {
                    var url = video.options.video.url;
                    var devidno = url.split('DevIDNO=')[1].split('&')[0];
                    that.timeMap808[devidno] = new Date().getTime()
                } catch (e) {

                }
            }
            delete this.reloadMapTime[index];
            delete this.speedZeroNum[index];
            this.emit(index, this.eventType.stop)
        },
        toggleVideo: function (index) {
            if (index >= this.num) {
                return
            }
            var video = this.playVideos[index];
            if (video) {
                video.toggle();
                if (video.video.paused) {
                    this.emit(index, this.eventType.stop)
                } else {
                    this.emit(index, this.eventType.start)
                }
            }
        },
        reSetVideo: function (index) {
            var video = this.playVideos[index];
            if (video) {
                video.destroy();
                delete this.playVideos[index]
                delete this.mediaPortMap[index]
            }
        },
        hideAllMenu: function () {
            for (var index in this.playVideos) {
                this.playVideos[index].contextmenu.hide()
            }
        },
        startVideo: function (index, jsession, devIdno, channel, stream, isVideo) {
            var that = this;
            if (!index && index !== 0) {
                return
            }
            if (parseInt(index) >= that.num) {
                return
            }
            var devInfo = {
                devIdno: devIdno,
                channel: channel,
            }
            that.devInfoMap[index.toString()] = devInfo
            that.createUrlAndplay(index, jsession, devIdno, channel, stream, 1);
        },
        /**
         *
         * @param index
         * @param url
         * @param type 当实时视频时，传1，监听时，传2，双向对讲时传3   广播功能 4
         */
        startVod: function (index, url, type, notDeleteTime) {
            // url = 'http://cyberplayerplay.kaywang.cn/cyberplayer/demo201711-L1.flv'
            var that = this;
            url = that.handleUrl(url);
            //防止多次点击
            if (that.playWating) {
                return;
            }
            if (!notDeleteTime) {
                delete that.reloadMapTime[index]
            }
            try {
                if (rootParent) {
                    //录像回放 808设备的录像拖动，先停止，再5秒后，再发请求。  其它协议类型不用
                    var devidno = url.split('DevIDNO=')[1].split('&')[0];
                    var device = rootParent.vehicleManager.getDevice(devidno);
                    var is808 = device.isCan808ParamConfig();
                    var fileloc = url.split('FILELOC=')[1].split('&')[0];
                    if (is808 && fileloc == 1) {
                        if (that.timeMap808[devidno]) {
                            var timeDiff = 5000 - (new Date().getTime() - that.timeMap808[devidno]);
                            if (timeDiff > 0) {
                                $('#video_mask').show();
                                setTimeout(function () {
                                    $('#video_mask').hide();
                                    that.playWating = false;
                                    that.startVod(index, url, type, notDeleteTime)
                                }, timeDiff)
                                that.playWatingNum = Math.ceil(timeDiff / 1000);
                                $('#video_mask_text').html(that.playWatingNum)
                                that.playWatingTimer = setInterval(function () {
                                    that.playWatingNum--;
                                    $('#video_mask_text').html(that.playWatingNum)
                                    if (that.playWatingNum <= 0) {
                                        clearInterval(that.playWatingTimer)
                                    }
                                }, 1000)
                                that.playWating = true;
                                return
                            }
                        }
                    }
                }
            } catch (e) {

            }
            var itemId = this.itemPre + '-' + index;
            var dp = that.playVideos[index];
            if (dp) {
                dp.destroy();
            }
            var videoType = 'flv'
            if (url.indexOf('PLAYBEG=') == -1 && (url.indexOf('.mp4') > -1 || url.indexOf('.MP4') > -1)) {
                videoType = 'normal'
            }
            if (url.indexOf('.m3u8') > -1 || url.indexOf('.m3u8') > -1) {
                videoType = 'hls'
            }
            var volume = that.options.volume;
            if (this.beforeReconnectionVolume[index]) {
                volume = this.beforeReconnectionVolume[index];
            }
            dp = new DPlayer({
                container: document.getElementById(itemId),
                live: that.options.live,
                liveText: that.videoText[index],
                screenshot: that.options.screenshot,
                autoplay: that.options.autoplay,
                mutex: that.options.mutex,
                loop: that.options.loop,
                volume: volume,
                lang: that.options.lang,
                video: {
                    url: url,
                    type: videoType
                },
                contextmenu: that.options.contextmenu
            });
            delete this.beforeReconnectionVolume[index]
            this.playVideos[index] = dp;
            this.speedZeroNum[index] = 0;
            this.bindDpEvent(dp, type);
            this.emit(index, this.eventType.start)
            this.setVideoFrame();
            var bcolor = that.options.tbarBgColor[index];
            bcolor = bcolor ? bcolor : '000';
            $('#' + dp.container.id).find('.dplayer-controller').css('background','#'+bcolor);
        },
        seekVideo: function (index, time) {
            var that = this
            var dp = that.playVideos[index];
            if (dp) {
                var dpId = dp.container.id;
                var url = dp.options.video.url;
                try {
                    var devidno = url.split('DevIDNO=')[1].split('&')[0];
                    that.timeMap808[devidno] = new Date().getTime()
                } catch (e) {

                }

                if (url.indexOf('PLAYBEG=') > -1) {
                    dp.video.currentTime = 0;
                    if (that.options.needSeek) {
                        that.reloadMapTime[index] = time
                        var urlArr = url.split('PLAYBEG=');
                        var index1 = urlArr[1].indexOf("&")
                        var url2 = urlArr[1].substring(index1, urlArr[1].length);
                        url = urlArr[0] + 'PLAYBEG=' + (time * 1000) + url2
                    }
                    dp.destroy();
                    delete that.playVideos[index]
                    that.startVod(index, url, 1, true);
                    delete that.reloadMap[dpId]
                    that.emit(index, that.eventType.start)
                }
            }
        },
        getServerInfo: function (index) {
            var serverInfo = this.serverInfoMap[index]
            var serverIp, serverPort;
            if (serverInfo) {
                serverIp = serverInfo.serverIp
                serverPort = serverInfo.serverPort
            } else {
                serverIp = this.options.serverIp
                serverPort = this.options.serverPort
            }
            return {serverIp: serverIp, serverPort: serverPort}
        },
        /**
         * @param index
         * @param jsession
         * @param devIdno
         * @param channel
         * @param stream
         * @param type 当实时视频时，传1，监听时，传2，双向对讲时传3   广播功能 4
         * @returns {string}
         */
        createUrlAndplay: function (index, jsession, devIdno, channel, stream, type) {
            var that = this
            index = index.toString();
            var serverInfo = this.getServerInfo(index.toString())
            var splicingSymbol = ":";
            //如果是http直接访问c++ 端口，否则需要nginx转发
            var webPort = ''
            if (location.protocol == 'https:') {
                splicingSymbol = "/";
                webPort = ":" + location.port
            }

            var action = location.protocol + '//' + serverInfo.serverIp + webPort + splicingSymbol + serverInfo.serverPort;
            action += '/3/1?MediaType=1&Type=0' + '&AVType=' + type + '&DevIDNO=' + devIdno + '&Channel=' + channel
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', action, true);
            httpRequest.send();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    var json = httpRequest.responseText;//获取到json字符串，还需解析
                    if (json) {
                        json = JSON.parse(json);
                    }
                    if (json.result === 0) {
                        var server = json.server;
                        var lstSvrIp = [];
                        lstSvrIp.push(server.clientIp);
                        lstSvrIp.push(server.lanip);
                        lstSvrIp.push(server.clientIp2);
                        lstSvrIp.push(server.clientIp3);
                        var mediaServer = {};
                        var ports = [];
                        if (server.clientOtherPort) {
                            ports = server.clientOtherPort.split(';')
                        }
                        ports.push(server.clientPort);
                        mediaServer.ip = that.getComServerIp(lstSvrIp);
                        mediaServer.port = that.getMinPort(ports);
                        that.mediaPortMap[index] = mediaServer.port;
                        var url = that.getUrl(jsession, devIdno, channel, stream, mediaServer, type);
                        if (type === 1) {
                            that.startVod(index, url, type)
                        }
                        if (type === 2) {
                            that.startListenByUrl(url, type)
                        }
                    } else {
                        that.startVod(index, '', type)
                    }
                }
            };
        },
        getComServerIp: function (lstSvrIp) {
            if (lstSvrIp != null && lstSvrIp.length > 0) {
                var host = window.location.host.split(':');
                if (host.length >= 1) {
                    var addr = host[0];
                    if (addr == 'localhost') {
                        return "127.0.0.1";
                    }
                    for (var i = 0; i < lstSvrIp.length; ++i) {
                        if (addr == lstSvrIp[i]) {
                            return lstSvrIp[i];
                        }
                    }
                }
                return lstSvrIp[0];
            }
            return "127.0.0.1";
        },
        getUrl: function (jsession, devIdno, channel, stream, mediaServer, type) {
            var url;
            var urlPrefix = 'http://' + mediaServer.ip + ':' + mediaServer.port;

            if (flvjs.isSupported()) {
                var params = []
                params.push(jsession)
                params.push(type)
                params.push(devIdno)
                params.push(channel)
                params.push(stream)
                params.push(0)
                params.push(0)
                url = urlPrefix + '/rtmp/' + new Date().getTime() + '/?' + btoa(params.join(','));
            } else {
                url = urlPrefix + '/hls/1_' + devIdno + '_' + channel + '_' + stream + '.m3u8?JSESSIONID=' + jsession;
            }
            return url;
        },
        getMinPort: function (ports) {
            var that = this
            var portNumMap = {};
            for (var index in that.mediaPortMap) {
                var port = that.mediaPortMap[index];
                if (portNumMap[port]) {
                    portNumMap[port] = ++portNumMap[port]
                } else {
                    portNumMap[port] = 1
                }
            }
            for (var i = 0; i < ports.length; i++) {
                var port = ports[i];
                if (!portNumMap[port]) {
                    portNumMap[port] = 0;
                }
            }
            var portArr = Object.keys(portNumMap)
            portArr.sort(function (a, b) {
                return portNumMap[a] - portNumMap[b]
            });
            return portArr[0];
        },
        startListen: function (jsession, devIdno, channel, ip, port) {
            this.serverInfoMap['-1'] = {
                serverIp: ip,
                serverPort: port
            }
            this.createUrlAndplay('-1', jsession, devIdno, channel, 1, 2);
        },
        startListenByUrl: function (url, type) {
            url = this.handleUrl(url);
            for (var index in this.playVideos) {
                if (this.playVideos[index].volume() > 0) {
                    this.playVideos[index].volume(0, true, false)
                }
            }
            if ($('#' + this.soundDomId).length === 0) {
                var soundDom = $("<div class='hide' id='" + this.soundDomId + "'></div>");
                $('body').append(soundDom)
            }
            this.soundDp = new DPlayer({
                container: document.getElementById(this.soundDomId),
                live: true,
                autoplay: true,
                mutex: false,
                volume: 1,
                video: {
                    url: url,
                    type: 'flv'
                }
            });
            this.speedZeroNum['-1'] = 0
            this.bindDpEvent(this.soundDp, type);
            this.soundDp.play();
        },
        stopListen: function () {
            if (this.soundDp) {
                this.soundDp.pause();
                this.soundDp.destroy();
                this.soundDp = '';
                delete this.mediaPortMap['-1']
                delete this.speedZeroNum['-1'];
            }
        },
        setVideoInfo: function (index, title) {
            // dplayer-live-text
            this.videoText[index] = title;
            var video = this.playVideos[index];
            if (video) {
                $(video.container).find('.dplayer-live-text').html(title);
                video.options.liveText = title;
            }
        },
        getDataset: function (ele) {
            if (ele.dataset) {
                return ele.dataset;
            } else {
                var attrs = ele.attributes,//元素的属性集合
                    dataset = {}, name, matchStr;
                for (var i = 0; i < attrs.length; i++) { //是否是data- 开头
                    matchStr = attrs[i].name.match(/^data-(.+)/);
                    if (matchStr) { //data-auto-play 转成驼峰写法 autoPlay
                        name = matchStr[1].replace(/-([\da-z])/gi, function (all, letter) {
                            return letter.toUpperCase();
                        });
                        dataset[name] = attrs[i].value;
                    }
                }
                return dataset;
            }
        },
        bindItemEvent: function (obj) {
            var that = this;
            obj.click(function () {
                $('.ttx-video-h5-item').removeClass('ttx-video-h5-item-check');
                $(this).addClass('ttx-video-h5-item-check');
                that.hideAllMenu()
                var dataset = that.getDataset(this)
                that.selectIndex = dataset.index;
                that.emit(that.selectIndex, that.eventType.select)
            })
            obj.mousedown(function (e) {
                if (3 == e.which) {
                    var dataset = that.getDataset(this)
                    that.selectMenuIndex = dataset.index.toString();
                    that.options.rightMousedown();
                }
            })
            obj.dblclick(function () {
                if ($(this).hasClass('ttx-video-h5-item-full')) {
                    $(this).removeClass('ttx-video-h5-item-full')
                    $('.ttx-video-h5-item').show()
                } else {
                    $('.ttx-video-h5-item').hide()
                    $(this).addClass('ttx-video-h5-item-full').show()
                }
                that.setVideoFrame();
            })
        },
        /**
         *
         * @param dp
         * @param type 当实时视频时，传1，监听时，传2，双向对讲时传3   广播功能 4
         */
        bindDpEvent: function (dp, type) {
            var that = this;
            var index = dp.container.id.replace(that.itemPre + '-', '');
            if (type === 1) {
                dp.on('play', function () {
                    // if (!dp.options.live) {
                    //     return;
                    // }
                    var dpId = dp.container.id;
                    if (that.reloadMap[dpId]) {
                        var url = dp.options.video.url;
                        if (that.options.needSeek && url.indexOf('PLAYBEG=') > -1) {
                            var currentTime = Math.floor(dp.video.currentTime);
                            if (that.reloadMapTime[index]) {
                                currentTime += that.reloadMapTime[index]
                            }
                            that.reloadMapTime[index] = currentTime
                            var urlArr = url.split('PLAYBEG=');
                            var index1 = urlArr[1].indexOf("&")
                            var url2 = urlArr[1].substring(index1, urlArr[1].length);
                            url = urlArr[0] + 'PLAYBEG=' + (currentTime * 1000) + url2
                        }
                        dp.destroy();
                        // $('#' + dp.container.id).empty();
                        delete that.playVideos[index]
                        that.startVod(index, url, type, true);
                        delete that.reloadMap[dpId]
                        that.emit(index, that.eventType.start)
                    }
                });
                dp.on('pause', function () {
                    if (dp.plugins && dp.plugins.flvjs && dp.plugins.flvjs._transmuxer) {
                        // if (that.options.live && dp.plugins && dp.plugins.flvjs && dp.plugins.flvjs._transmuxer) {
                        dp.plugins.flvjs._transmuxer.close()
                    }
                    that.emit(index, that.eventType.stop)
                    that.reloadMap[dp.container.id] = dp.container.id;
                });
                dp.on('fullscreen', function () {
                    that.fullScreen()
                    $('.map_btn').css('z-index', 0)
                });
                dp.on('volumechange', function () {
                    if (dp.volume() > 0) {
                        for (var index in that.playVideos) {
                            if (index != that.selectIndex && that.playVideos[index].volume() > 0) {
                                that.playVideos[index].volume(0, true, false)
                            }
                        }
                        if (that.soundDp && ttxPlayer && typeof ttxPlayer.doRightMenuMsg == "function") {
                            ttxPlayer.doRightMenuMsg(that.selectIndex, 'stopListen');
                        }
                    }
                });
                if (!that.playVideosTimer[index]) {
                    that.playVideosTimer[index] = setInterval(function () {
                        if (!that.playVideos[index]) {
                            return;
                        }
                        var speed = 0
                        if (that.playVideos[index].plugins.flvjs) {
                            speed = parseInt(that.playVideos[index].plugins.flvjs.statisticsInfo.speed)
                        }
                        if (isNaN(speed)) {
                            speed = 0
                        }
                        var speedStr = speed + 'KB/S';
                        if (that.playVideos[index].paused || !that.playVideos[index].plugins.flvjs) {
                            speedStr = '';
                        }
                        var liveText;
                        if (that.videoText[index]) {
                            liveText = that.videoText[index] + ' ' + speedStr;
                        } else {
                            liveText = '　' + speedStr;
                        }
                        if ($(that.playVideos[index].container).find('.dplayer-live-text').length > 0) {
                            $(that.playVideos[index].container).find('.dplayer-live-text').html(liveText).attr('title', liveText);
                        } else {
                            var liveTextHtml =
                                '<span class="dplayer-live-badge" title="' + liveText + '">' +
                                '    <span class="dplayer-live-text">' + liveText + '</span>' +
                                '</span>';
                            $(that.playVideos[index].container).find('.dplayer-time').after(liveTextHtml);
                        }
                    }, 1000)
                }
            }
            if (type === 2) {
                dp.on('waiting', function () {
                    that.emit('-1', that.eventType.loadListen)
                });
                dp.on('playing', function () {
                    that.emit('-1', that.eventType.playListen)
                });
            }
        },
        bindEvent: function () {
            var that = this;
            $(document).mousedown(function (e) {
                if (3 == e.which) {
                    that.hideAllMenu()
                }
            })
            try {
                $(parent.document).mousedown(function (e) {
                    that.hideAllMenu()
                })
            } catch (e) {
                // TODO: handle exception
            }
            that.winDom.bind('contextmenu', function () {
                return false;
            });

            $(document).keyup(function (e) {
                var key = e.which || e.keyCode;
                if (key == 27) {
                    that.exitFullScreen()
                }
            });
            window.onresize = function () {
                if (!that.checkFull()) {
                    that.exitFullScreen()
                }
            }
            if (that.options.reconnect) {
                setInterval(function () {
                    for (var index in that.playVideos) {
                        var dpVideo = that.playVideos[index];
                        that.reconnectionCheck(index, dpVideo)
                        if (that.soundDp) {
                            that.reconnectionCheck(-1, that.soundDp);
                        }
                    }
                }, 500)
            }
        },
        /**
         * 断线重连
         * @param index
         * @param dpVideo
         */
        reconnectionCheck: function (index, dpVideo) {
            var that = this;
            if (!that.speedZeroNum[index]) {
                that.speedZeroNum[index] = 0
            }
            if (dpVideo.plugins.flvjs) {
                var speed = parseInt(dpVideo.plugins.flvjs.statisticsInfo.speed)
                if (!speed && !dpVideo.paused) {
                    that.speedZeroNum[index]++;
                } else {
                    that.speedZeroNum[index] = 0;
                }
            }
            if (that.speedZeroNum[index] >= 60) {
                var url = dpVideo.options.video.url;
                if (index === -1) {
                    that.startListenByUrl(url, 2);
                } else {
                    that.beforeReconnectionVolume[index] = dpVideo.volume()
                    that.startVod(index, url, 1);
                }
                console.log('断线重连:' + index)
            }
        },
        getVideoPlayTime: function (index) {
            var that = this;
            index = index ? index : '0';
            var video = that.playVideos[index];
            if (video) {
                var time = parseInt(video.video.currentTime);
                if (this.reloadMapTime[index]) {
                    time = time + this.reloadMapTime[index];
                }
                return time;
            }
            return 0;
        },
        setVideoFocus: function (index) {
            $('.ttx-video-h5-item:eq(' + index + ')').click();
        },
        fullScreen: function () {
            this.winDom.addClass('ttx-video-h5-full')
            $('body').addClass('ttx-video-body-full')
            var el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        },
        exitFullScreen: function () {
            this.winDom.removeClass('ttx-video-h5-full')
            $('body').removeClass('ttx-video-body-full')
        },
        checkFull: function () {
            return document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement || false;
        },
        emit: function (index, type) {
            if (typeof onTtxVideoMsg == 'function') {
                onTtxVideoMsg(index, type)
            }
        },
        setVideoFrame: function (viewSize) {
            viewSize = viewSize ? viewSize : this.options.viewSize;
            this.options.viewSize = viewSize
            this.winDom.find('video').each(function (i, obj) {
                var _obj = $(obj)
                _obj.css('width', '100%').css('height', '100%')
                var width = _obj.width();
                var height = _obj.height();
                if (viewSize === '4:3') {
                    if ((width / height) > (4 / 3)) {
                        _obj.css('width', (height * 4 / 3))
                    } else {
                        _obj.css('height', (width * 3 / 4))
                    }
                }
                if (viewSize === '16:9') {
                    if ((width / height) > (16 / 9)) {
                        _obj.css('width', (height * 16 / 9))
                    } else {
                        _obj.css('height', (width * 9 / 16))
                    }
                }

            })
        },
        /**
         * 处理URL
         * 如果是http直接访问c++ 端口，否则需要nginx转发
         */
        handleUrl: function (url) {
            if (location.protocol == 'http:') {
                return url;
            }
            if (url && url.startWith('https:')){
                return url;
            }
            var portReg = /.+:(\d{1,5})/;
            var urlPortArr = url.match(portReg);
            if (!urlPortArr || urlPortArr.length < 2) {
                return url;
            }
            var videoPort = urlPortArr[1];
            //用端口分开链接
            var urlArr = url.split(videoPort);
            try {
                if(rootParent && rootParent.httpsMapHttpPortParams){
                    var httpsPort = rootParent.httpsMapHttpPortParams[videoPort];
                    httpsPort = httpsPort ? httpsPort : ('1' + videoPort);
                    return 'https://' + location.hostname + ":" + httpsPort + urlArr[1];
                }
            } catch (e) {
                console.log(e)
            }
            return 'https://' + location.host + "/" + videoPort + urlArr[1];
        },
        /************************下面的方法无实际意义**********************************/
        embedSWF: function () {

        },
        setLanguage: function () {

        },
        setBufferTime: function () {

        },
        setBufferTimeMax: function () {

        },
        setListenParam: function () {

        },
        setVideoTbarBgColor: function (index,color) {
            this.options.tbarBgColor[index] = color;
            var dp = this.playVideos[index];
            if(dp && dp.container && dp.container.id){
                $('#' + dp.container.id).find('.dplayer-controller').css('background','#'+color);
            }
        },
        clearVideoMenu: function () {

        },
        setTalkParam: function () {
            alert('h5播放器暂时不支持对讲功能，请使用flash播放器')
        },
        startTalkback: function () {
            alert('h5播放器暂时不支持对讲功能，请使用flash播放器')
        },
        setTalkMaxParam: function () {
            alert('h5播放器暂时不支持对讲功能，请使用flash播放器')
        },
        stopTalkback: function () {
        }
    }

    _global = (function () {
        return this || (0, eval)('this');
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = TtxH5Video;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return TtxH5Video;
        });
    } else {
        !('TtxH5Video' in _global) && (_global.TtxH5Video = TtxH5Video);
    }
};

export default swfobjectH5;