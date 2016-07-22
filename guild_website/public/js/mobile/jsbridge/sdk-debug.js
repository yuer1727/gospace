(typeof define === 'function' && define.scrat ? define : function(id, factory){factory();})('framework/jsbridge/jsbridge.js', function(require, exports, module){

var define;

/**
 * H5和Native的交互接口
 */
(function(global, undefined){
  'use strict';

  var getURLParameters = function(url, name) {
    var params = {};
    url.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m, key, value) {
      params[key] = decodeURIComponent(value);
    });
    return name ? params[name] : params;
  };

  // 由客户端webview注入JSBridge对象，iOS已实现,包含webViewId参数和init方法.(Android暂没有实现)
  // 刷新的时候webViewId拿不到，注入时机问题，需要端在url里面传递webViewId
  var JSBridge = window.JSBridge || {webViewId:getURLParameters(window.location.href, 'webViewId')};
  JSBridge.getURLParameters = getURLParameters;

  //依赖处理, 兼容不同模块化规范
  if(typeof module !== 'undefined' && module.exports){
    module.exports = JSBridge;
  }
  window['JSBridge'] = JSBridge;

  // 服务器地址
  JSBridge.CLIENT_SERVER = "client_server";
  JSBridge.GUILD_SERVER = "guild_server";
  JSBridge.ALL_SERVER = "all_server";
  JSBridge.ACTIVITY_SERVER = 'activity_server';

  /**
   * callbackId的前缀
   * @type {String}
   */
  JSBridge.callbackIdPrefix = '';

  /**
   * 回调函数的引用缓存
   *
   * @type {Object} key -> callbackIdPrefix + callbackId, value -> fn
   * @private
   */
  JSBridge.callbackCache = {};

  /**
   * prompt的次数, 统计用
   *
   * @type {Number}
   * @private
   */
  JSBridge.callCount = 0;

  /**
   * 延迟调用的临时cache, 用于callLater
   *
   * @type {Array}
   * @priavate
   */
  JSBridge.callLaterCache = [];

  // iOS 客户端  NineGameClient/ios
  JSBridge.isIOS = navigator.userAgent && navigator.userAgent.indexOf("NineGameClient/ios") > -1;

  // Android 客户端  NineGameClient/android
  JSBridge.isAndroid = navigator.userAgent && navigator.userAgent.indexOf("NineGameClient/android") > -1;

  // iOS 同步接口列表, 同步接口iOS需要设置参数:async:false 简化第三方Android iOS SDK调用
  JSBridge.syncMethod = ['getEnv','getConfig','getCache','getSession','getClipboard','getAccountInfo'].join('');
  /**
   * 是否支持批量调用, 默认为true
   * @returns {Boolean}
   */
  JSBridge.isSupportBatch = function(){
    return true;
  };

  /**
   * 调用Native的方法
   *
   * 第一个参数支持为Object/Array, {clz:'', method:'', args:{arg1:'', callbackId:123}}
   * @param {String/Object/Array} clz Native的类名
   * @param {String} [method] Native的方法名
   * @param {Object} [args] 参数对象,可选
   * @param {Function} [callback] 回调函数,可选
   * @returns {String}
   *  - 若没有回调,则直接返回string结果；
   *  - 若有回调，执行成功则不返回，反之若客户端找不到对应接口时，则返回对应的callbackId
   */
  JSBridge.callNative = function(clz, method, args, callback) {
    var jsonStr;
    if(typeof clz === 'object'){
      //callNative(obj)
      jsonStr = JSON.stringify(clz);
    }else{
      //callNative(clz, method, [args], [callback])
      jsonStr = JSON.stringify(JSBridge.collectParams(clz, method, args, callback));
    }
    JSBridge.callCount++;

    if(JSBridge.isIOS){

      // 默认异步
      var isAsync = JSBridge.syncMethod.indexOf(method)==-1 ;
      if((args && args.async!=undefined)){
        isAsync = args.async;
      }
      // 解决远端页面跨域问题
      var requestUrl = 'http://cn.9game/jsbridge';
      if(window.location.protocol=='http:' || window.location.protocol=='https:'){
        requestUrl = window.location.host + "/cn.9game/jsbridge";
      }
      // 发起ajax调用, ios拦截URL, 匹配url中是否包含 PROTOCOL_URL
      var xhr = new XMLHttpRequest();
      xhr.open("POST",requestUrl, isAsync);
      xhr.setRequestHeader("Content-Type","application/x-www-urlencoded");
      xhr.onReadyStateChange = function(){
        if (xhr.readyState==4 && xhr.status==200) {
          console.log('>>>H5 xhr result:' + xhr.responseText);
        }
      };
      xhr.send(jsonStr);
      // 同步直接返回结果
      if(!isAsync){
        return xhr.responseText;
      }
    }else if(JSBridge.isAndroid){
      return prompt(jsonStr);
    }
  };

  /**
   * 延迟执行, 每50ms执行一次
   *
   * @param {String/Object} clz Native的类名
   * @param {String} [method] Native的方法名
   * @param {Object} [args] 参数对象,可选
   * @param {Function} [callback] 回调函数,可选
   */
  JSBridge.callLater = function(clz, method, args, callback){
    //缓存参数
    JSBridge.callLaterCache.push(Array.prototype.slice.call(arguments, 0));
    //定时调用
    if(!JSBridge.isCallingLater){
      JSBridge.isCallingLater = setTimeout(function(){
        if(JSBridge.callLaterCache.length > 0) {
          JSBridge.callBatch(JSBridge.callLaterCache);
          JSBridge.callLaterCache = [];
        }
        JSBridge.isCallingLater = null;
      }, 50);
    }
  };

  /**
   * 批量调用, 若`isSupportBatch()`为false, 则循环逐个调用
   *
   * @param {Array} params 二维数组 [['NineGameClient', 'method1', {msg: 'test1'}, cb], ['NineGameClient', 'method2', {msg: 'test2'}]]
   * @returns {Array} 按顺序返回结果, 结果会被转换为JSON
   */
  JSBridge.callBatch = function(params){
    var result;
    if(JSBridge.isSupportBatch()){
      var jsonArr = params.map(function(item){
        return JSBridge.collectParams.apply(JSBridge, item);
      });
      result = JSON.parse(JSBridge.callNative(jsonArr) || '[]');
    }else{
      result = params.map(function(item){
        return JSBridge.callNative.apply(JSBridge, item);
      });
    }
    return result;
  };

  /**
   * 提供给Native的回调接口
   * @param {String} callbackId 之前H5传递过去的回调ID
   * @param {Object} data 数据对象
   */
  JSBridge.onCallback = function(callbackId, data){
    var cb = JSBridge.callbackCache[callbackId];
    if(cb){
      try {
        cb(data);
      }catch(e){
        console.warn('[JSBridge] callback exec error: ' + callbackId + ' , error: '  + e);
      }finally {
        JSBridge.callbackCache[callbackId] = undefined;
        delete JSBridge.callbackCache[callbackId];
      }
    }else{
      console.warn('[JSBridge] unavailable callbackId: ' + callbackId);
    }
  };


  /**
   * 重置JSBridge
   */
  JSBridge.reset = function(){
    delete JSBridge.callbackId;
    JSBridge.callbackCache = {};
    JSBridge.callCount = 0;
    JSBridge.callLaterCache = [];
  };
  
  /**
   * 组装接口交互参数
   *
   * 转换为 {clz:'', method:'', args:{arg1:'', callbackId:123}}
   * 如果提供callback, 则生成callbackId, 并cache到JSBridge.callbackCache
   *
   * @param {String} clz Native的类名
   * @param {String} method Native的方法名
   * @param {Object} [args] 参数对象,可选
   * @param {Function} [callback] 回调函数,可选
   * @return {Object} 返回{clz:'', method:'', args:{arg1:'', callbackId:123}}
   * @private
   */
  JSBridge.collectParams = function(clz, method, args, callback){

    var json = {
      clz: clz,
      method: method,
      args: args
    };
    // IOS 需要传递webViewId Android 没有设置 所以为空
    if(JSBridge.isIOS){
      json.args = args || {};
      json.args.webViewId = JSBridge.webViewId||'';
    }
    //alert('method:' + method + " json:" + JSON.stringify(json) + " JSBridge.isIOS:"+ JSBridge.isIOS + " JSBridge.webViewId:"+JSBridge.webViewId );
    //若需要回调,则存储引用,传递callbackId
    if(typeof callback === 'function'){
      var callbackId = JSBridge.nextCallbackId();
      JSBridge.callbackCache[callbackId] = callback;
      callback.callbackId = callbackId; //for test
      json.args = args || {};
      json.args.callbackId = callbackId;
    }

    return json;
  };

  /**
   * 生成下一个callbackId
   *
   * @returns {String}
   * @private
   */
  JSBridge.nextCallbackId = function(){
    if(!JSBridge.callbackId){
      JSBridge.callbackId = 1;
    }else{
      JSBridge.callbackId++;
    }
    return (JSBridge.callbackIdPrefix || '') + JSBridge.callbackId;
  };

})(this);;

});;
(typeof define === 'function' && define.scrat ? define : function(id, factory){factory();})('framework/sdk/sdk.js', function(require, exports, module){

var define;

//noinspection JSUnusedLocalSymbols
/**
 * 封装常用的Native-H5接口
 */
(function(global, undefined){
  'use strict';

  var Utils, JSBridge;

  //依赖处理, 兼容不同模块化规范
  if(typeof module !== 'undefined' && module.exports){
    Utils = require('framework/utils');
    JSBridge = require('framework/jsbridge');
    module.exports = JSBridge;
  }else{
    Utils = global['Utils'];
    JSBridge = global['JSBridge'];
    if(!JSBridge || !Utils){
      //throw new Error('missing JSBridge or Utils');
    }
  }

  if(JSBridge.envList || JSBridge.cfgList || JSBridge.eventList){
    console.warn('duplicate!!! JSBridge.envList || JSBridge.cfgList || JSBridge.eventList');
  }

  //===================================================================================
  // 针对九游客户端做一些特性定制
  //===================================================================================
  /**
   * 代理JSBridge.callNative, 省略clz参数
   *
   * @param {String} method Native的方法名
   * @param {Object} [args] 参数对象,可选
   * @param {Function} [callback] 回调函数,可选
   * @returns {String}
   *  - 若没有回调,则直接返回string结果；
   *  - 若有回调，执行成功则不返回，反之若客户端执行失败或接口不存在时，则返回一段字符串
   */
  function callNative(method, args, callback){
    var param = ['NineGameClient'].concat(Array.prototype.slice.call(arguments, 0));
    return JSBridge.callNative.apply(JSBridge, param);
  }

  /**
   * 代理JSBridge.callLater, 省略clz参数
   */
  function callLater(method, args, callback){
    var param = ['NineGameClient'].concat(Array.prototype.slice.call(arguments, 0));
    return JSBridge.callLater.apply(JSBridge, param);
  }

  /**
   * 简化应用层的调用
   * @param method
   * @param args
   * @param callback
   * @returns {String}
   */
  JSBridge.callNineGameClient = callNative;

  JSBridge.callNineGameLater = callLater;

  //===================================================================================
  // 基础
  //===================================================================================
  /**
   * 显示toast提示
   * @param {String} msg 消息内容
   * @param {String} [iconType] 图标, 取值: sigh 感叹号, speed 闪电, tick 打勾, gift 礼包
   * @param {Function} [callback] 回调函数, 可选. 注意: 当提供callback时, Native必须保证执行回调 -- 当用户点击时立即回调(传递result:true),一直未点击则在toast消失后回调(传递result:false)
   */
  JSBridge.showMessage = function (msg, iconType, callback) {
    if(Utils.isFunction(iconType)){
      callback = iconType;
      iconType = null;
    }
    callNative("showMessage", {msg: msg, iconType: iconType}, callback);
  };

  /**
   * 获取环境信息。
   * @history 键名由flag改为key, 接口名原为getAttributeValue。
   * @param {String} key 键名,取值如下:
   *  - uuid
   *  - model
   *  - imei
   *  - mac
   *  - network
   *  - apkversion
   *  - versioncode
   *  - templateversion
   *  - systemversion
   *  - cpucores
   *  - totalram
   *  - totalavailstorage
   *  - externalavailstorage
   *  - internalavailstorage
   *  - cpufreq
   *  - realscreenw
   *  - realscreenh
   *  - webviewid 当前webview的id
   * @return {String} 值
   */
  JSBridge.getEnv = function (key) {
    JSBridge.envList = JSBridge.envList || {};
    if(JSBridge.envList.hasOwnProperty(key)){
      return JSBridge.envList[key];
    }else{
      var value = callNative("getEnv", JSBridge.isIOS ? {"key": key, async: false}: {"key": key});
      if(['uuid', 'model', 'imei', 'mac', 'apkversion', 'versioncode', 'templateversion', 'systemversion', 'realscreenw', 'realscreenh', 'webviewid'].indexOf(key) != -1){
        JSBridge.envList[key] = value;
      }
      return value;
    }
  };

  /**
   * 读取配置信息。
   * @history 原接口getSettingProperties。
   * @param {String} [key] 键名, 可选, 若未给出则返回整个Object。取值如下:
   *   - h5_api_server      前端使用的服务端地址，只读。
   *   - console_level  前端日志输出级别, 只读, 取值: debug, info, warn, error, off
   *   - image_disabled  是否无图模式, 只读，取值: 1/0
   * @return {Object/String} 配置信息
   */
  JSBridge.getConfig = function (key) {
    if (!JSBridge.cfgList) {
      var config = JSBridge.isIOS ? callNative("getConfig",{async: false}):callNative("getConfig",{});
      JSBridge.cfgList = JSON.parse(config || '{}');
    }
    return key ? JSBridge.cfgList[key] : JSBridge.cfgList;
  };

  /**
   * 获取客户端配置的H5使用的服务端URL
   * @param [path] 二级路径
   * @returns {String} 返回请求url的地址, 会干掉url尾部的/
   */
  JSBridge.getServerUrl = function(path, server){
    var serverUrl = {};
    if(path && path.match(/^https?:\/\//)){
      serverUrl = path;
    }else{

      serverUrl.client = (JSBridge.getConfig('h5_api_server') || "http://assistant.9game.cn").replace(/\/$/, '');
      serverUrl.guild = (JSBridge.getConfig('guild_api_server') || "http://api.guild.9game.cn").replace(/\/$/, '');
      //serverUrl.guild = (JSBridge.getConfig('guild_api_server') || "http://a.test3.9game.cn:8110").replace(/\/$/, '');

      // 活动采用了新的域名，端还无法下发新域名
      serverUrl.activity = 'http://act.assistant.9game.cn'; // 正式环境
      // serverUrl.activity = (JSBridge.getConfig('activity_api_server') || 'http://a.test3.9game.cn:8230').replace(/\/$/, ''); // 测试环境

      if(path) {
        serverUrl.client += path;
        serverUrl.guild += path;
        serverUrl.activity += path;
      }
    }

    if(server == JSBridge.GUILD_SERVER){
      return serverUrl.guild;
    }else if(server == JSBridge.ALL_SERVER){
      return serverUrl;
    }else if (server == JSBridge.ACTIVITY_SERVER) {
      return serverUrl.activity;
    } else {
      return serverUrl.client;
    }
  };

  /**
   * 读取缓存数据。
   * @param {String} key
   * @param {Boolean} [clearCache] 是否读取后立即清除, 可选参数,默认false
   */
  JSBridge.getCache = function (key, clearCache) {
    return callNative("getCache", JSBridge.isIOS ? {"key":key, "clearCache":clearCache, async: false}:{"key":key, "clearCache":clearCache});
  };

  /**
   * 写入缓存数据。
   * @history 原setCacheString。
   * @param {String} key
   * @param {String/Number} value
   * @param {Number} [maxAge] 有效时间,单位毫秒,默认为7天
   */
  JSBridge.setCache = function (key, value, maxAge) {
    return callNative("setCache", JSBridge.isIOS ?
    {"key": key, "value": value, "maxAge": maxAge ? maxAge : 1000 * 60 * 60 * 24 * 7, async: false}
      : {"key": key, "value": value, "maxAge": maxAge ? maxAge : 1000 * 60 * 60 * 24 * 7});
  };

  /**
   * 读取Session数据。
   * @param {String} key
   * @param {Boolean} [clearCache] 是否读取后立即清除, 可选参数,默认false
   */
  JSBridge.getSession = function (key, clearCache) {
    return callNative("getSession",JSBridge.isIOS ? {"key": key, "clearCache": clearCache, async: false}:{"key": key, "clearCache": clearCache});
  };

  /**
   * 写入Session数据，仅在本次客户端启动期间保存。
   * @history 原setSessionString。
   * @param {String} key
   * @param {String} value
   */
  JSBridge.setSession = function (key, value) {
    return callNative("setSession", JSBridge.isIOS ? {"key": key, "value": value, async: false}:{"key": key, "value": value});
  };

  /**
   * 读取剪贴板。
   * @return{String} 剪贴板的值。
   */
  JSBridge.getClipboard = function () {
    return JSBridge.isIOS ?  callNative("getClipboard",{async: false}): callNative("getClipboard");
  };

  /**
   * 写入剪贴板。
   * @param {String} value 要复制到剪切板的值。
   */
  JSBridge.setClipboard = function (value) {
    return callNative("setClipboard", JSBridge.isIOS ? {"value": value, async: false}: {"value": value});
  };

  //===================================================================================
  // 统计
  //===================================================================================
  /**
   * 添加Action统计
   * @param {String/Object} action 动作, 必须
   * @param {String} [a1]
   * @param {String} [a2]
   * @param {String} [a3]
   * @param {String/Number} [adpId]
   * @param {String/Number} [admId]
   */
  JSBridge.addActionStat = function (action, a1, a2, a3, adpId, admId) {
    //console.debug('>>>addActionStat:' + action + " " + a1 + " " + a2 + " " + a3 + " " + adpId + " " + admId );
    if(Utils.isString(action) && a1){
      callLater("addStat", {statInfo:{action: action, a1: a1, a2: a2, a3: a3, ad: admId, ad_position: adpId}});
    }else if((Utils.isObject(action) && action['action'] && action['a1']) || Utils.isArray(action)){
      callLater("addStat", {statInfo: action});
    }else{
      console.warn('The action=[%s] & a1=[%s] is not valid!', action, a1);
    }
  };


  var statArray = [];
  var isFlushingStat;
  /**
   * 批量添加统计
   * @param {String} action 动作, 必须
   * @param {String} [a1]
   * @param {String} [a2]
   * @param {String} [a3]
   * @param {String/Number} [adpId]
   * @param {String/Number} [admId]
   */
  JSBridge.batchAddActionStat = function (action, a1, a2, a3, adpId, admId) {
    if(action && a1){
      statArray.push({action: action, a1: a1, a2: a2, a3: a3, ad: admId, ad_position: adpId});
    }
    if(!isFlushingStat && statArray.length > 0){
      isFlushingStat = setTimeout(function(){
        callNative("addStat", {statInfo: statArray});
        statArray = [];
        isFlushingStat = null;
      }, 500);
    }
  };

  /**
   * 添加Region统计, 注意参数顺序,position在前面
   * @param {String/Object} region
   * @param {String/Number} [position]
   * @param {String} [p1]
   * @param {String} [p2]
   * @param {String} [p3]
   */
  JSBridge.addRegionStat = function (region, position, p1, p2, p3) {
    if(Utils.isString(region)){
      callLater("addStat", {statInfo: {region: region, position: position, p1: p1, p2: p2, p3: p3}});
    }else if(Utils.isObject(region) && region['region']){
      callLater("addStat", {statInfo: region});
    }else{
      console.warn('The region [%s] is not valid!', region);
    }
  };

  //===================================================================================
  // 事件
  //===================================================================================

  /**
   * 已注册的事件列表
   */
  JSBridge.eventList = {};

  /**
   * 提供给Native的事件回调接口
   * @param {String} type 事件类型。
   * @param {Object} [data] 回调数据。
   * @param {Object} [params] 注册事件时传递的事件参数。
   */
  JSBridge.onEvent = function(type, data, params){

    console.log('[JSBridge] default onEvent handler: ', type, data);
    if (JSBridge.eventList.hasOwnProperty(type)) {
      setTimeout(function(){
        //注册时提供listener,则直接调用, 否则全局广播
        var listener = JSBridge.eventList[type];
        if(typeof listener === 'function'){
          listener(type, data, params);
        }else{

        }
      },1);
    } else {
      console.log('receive unregister event:' + type);
    }
  };


  /**
   * 注册事件，WebView声明自己关注的事件类型，当事件发生时，由壳通知事件。
   * 注：若注册多次，则最后一个生效。当WebView重新loadUrl的时候，Native需注销该WebView上的所有事件。
   * @param {String} type 事件类型，取值如下文。
   * @param {Object|String} [params] 事件参数，可选。
   * @param {Function} [listener] 事件处理器, 若提供该参数, 则事件触发时用调用, 否则$rootScope.$broadcast广播
   */
  JSBridge.registerEvent = function (type, params, listener) {
    //只传两个参数的情况下
    if(arguments.length == 2 && Utils.isFunction(params)){
      listener = params;
      params = {};
    }
    //提示重复注册
    if (JSBridge.eventList.hasOwnProperty(type)){
      console.debug('[NativeApp] registerEvent ' + type + ' multi time');
    }

    //提供listener时则缓存起来
    if(Utils.isFunction(listener)){
      JSBridge.eventList[type] = listener;
    }else{
      JSBridge.eventList[type] = params;
    }

    //console.debug('[NativeApp] registerEvent: ' + type);
    callLater("registerEvent", {"type": type, params: params});
  };

  /**
   * 注销事件
   * @param {String} type 事件类型，取值如下文。值为空，则注销该WebView注册的所有事件。
   */
  JSBridge.unregisterEvent = function (type) {
    callLater("unregisterEvent", {"type":type});
    delete JSBridge.eventList[type];
  };

  /**
   * 发布事件，壳将把事件广播给注册了该事件的WebView。
   * @param {String} type 事件类型，取值如下文。
   * @param {Object} [data] 回调数据
   */
  JSBridge.triggerEvent = function (type, data) {
    callLater("triggerEvent", {"type":type, "data":data});
  };

  //===================================================================================
  // 数据查询
  //===================================================================================
  /**
   * 发起DataApi请求, 客户端代理前端,向服务端发起数据请求(POST).
   * 客户端封装了传输协议和数据协议, 即签名和压缩由客户端实现, 对前端是透明的。
   *
   * @param {Object} params 查询数据, 包括url, data, page, client。
   *  - url {String} 请求的服务API名称
   *  - data {Object} 请求的参数
   *  - page {Object} 请求的分页参数, 无分页参数或组合请求时为null
   *  - cache {Number} 缓存时间,单位为毫秒。
   *  - client {Object} 请求者相关信息, 页面未给出的参数则由客户端取默认值
   * @param {Function} [callback] 回调函数 {status: 200, data: {}}
   * @returns {promise}
   */
  /**
  * 格式一

    var params = {
      "service": "user.task.stat",
      "data": {},
      "page": {
          "page": 1,
          "size": 10
      },
      "cache": 600,
      "server": "client_server"
    }


  * 格式二

   var params = {
    "data": [{
      "id": "guessList",
      "service": "op.ka.gift.getByRecommend",
      "data": {
        "gameIds": "",
        "giftCount": 0,
        "maxCount": 8,
        "giftType": "0"
      },
      "page": {
        "page": 1,
        "size": 10
      }
    },{
      "id": "carousel",
      "service": "op.ad.getAdPositionList",
      "data": {
        "adposid": 1297
      },
      "page": {
        "page": 1,
        "size": 10
      }
    }],
    "cache": 600,
    "server": "client_server",
    option: {
      combineMode:"parallel",
      serialInterruptOnError: false
    }
  }
  *
  *
  *
  *
  */

  JSBridge.requestDataApi = function(params, callback){
    var query = Utils.copy(params);
    query.data = query.data || {};
    if(query.option && query.option.combineMode) {
      var url = '/combine';
    } else {
      var url = '/api/' + params.service;
    }
    query.url = JSBridge.getServerUrl(url, params.server);
    if(query.sub_server=='biz') {
      // 一般情况的请求地址
      //query.url = query.url.replace(/http:\/\/biz/, 'http://biz');
    } else if(query.sub_server=='sys') {
      query.url = query.url.replace(/http:\/\/biz/, 'http://sys');
    } else {
      // 默认情况的请求地址
    }
    query.client = query.client || {};
    query.client.caller = query.client.caller || 'h5';
    console.log('>>> request server：%s, url:%s',query.server, query.url);
    callNative("DataApi", query, function(json){

      console.log('requestDataApi>>>>> ', json);

      if(callback) {
        callback({
          status: 200,
          data: json
        });
      }
    });
  };

  //===================================================================================
  // WebView交互
  //===================================================================================
  /**
   * 设置WebView顶部标题。
   * @history 原接口setTopNavTitle
   * @param {String} value 标题内容
   */
  JSBridge.setNavTitle = function (value) {
    document.title = value;
    callLater("setNavTitle", {value: value});
  };

  /**
   * 礼包首页tab切换
   * @param index  顺序从1开始,依次递增。例如index 等于 1 2 3 分别对应礼包页面第一个tab，第二个tab，第三个tab
   * @param tag  表示游戏详情tab个数不固定的情况 目前游戏专区: 详情： zq_detail  礼包： zq_gift  论坛 zq_forum  攻略:zq_strategy
   * 优先匹配tag 此时 index = 0， 否则tag传空或者不穿
   */
  JSBridge.switchTab = function(index, tag){
    callNative("switchTab", {index: index, tag: tag});
  };

  /**
   * 设置WebView的Tab标题。
   * @history 原接口setCommentNumInTab功能扩展
   * @param {String} value 标题内容
   * @param {Number} [index] Tab的顺序, 可选, 为空则表示当前所在tab, 其他则从左到右,由1开始计算
   */
  JSBridge.setTabTitle = function (value, index) {
    callLater("setTabTitle", {value: value, index: index});
  };

  /**
   * 跳转页面。
   * @param {String} url 要访问的网址，支持内链（相对路径，并且会考虑UrlMapping）和外链（http://)。
   * @param {Object} [params] 传递的参数,在UrlMapping转换完成后，再附加到url上。如果PAGETYPE为原始界面,则为传递的参数
   * @param {String} [target] 目标窗口, 可选参数，取值:
   *   - self: 在当前窗口切换页面
   *   - blank: 在新窗口中显示页面
   *   - common  弹出窗口  有返回按钮, 标题和搜索框, 默认值。
   *   - fullscreen  全屏
   *   - system: 在系统浏览器中显示页面
   *   - 特定的pagetype: 在特殊的webview中显示,此时url参数无效, 特殊的webview使用的多个URL直接从UrlMapping文件读取,使用约定的key。支持通过该参数来切换到Native原生界面,如切换底部标签或显示侧边栏里面的页面。
   * @param {Object} [options] 窗口参数，可选参数，取值： (特定的pagetype可以忽略以下参数)
   *  当left+width超出屏幕的时候, 右侧取屏幕最右边, top同理。 当width/height都未指定时,全屏显示。
   *   - width： 宽度，单位px，未指定则为最大宽度，当该值大于窗口最大宽度时，客户端采用最大宽度。
   *   - height： 高度，单位px，未指定则最大高度，当该值大于窗口最大高度时，客户端采用最大高度。
   *   - left：窗口左边距，单位px，未指定时窗口居中
   *   - top：窗口上边距，单位px，未指定时窗口居中
   * @param {Function} [callback] 回调函数,当新窗口关闭时回调父窗口, 回调结果为JSON。仅对target为_blank和特定Page的情况进行回调。
   */
  JSBridge.openWindow = function (url, params, target, options, callback) {
    //有URL但没有target时, 智能判断是否有pageType参数
    if (url && !target) {
      var urlParams = Utils.getURLParameters(url);
      target = urlParams['pageType'];
      //参数也没有pageType时,如果http开头则用browser,否则common
      if (!target) {
        target = /^http/.test(url) || /^https/.test(url) || /^www/.test(url) ? 'browser' : 'common';
      }
      if (/^www/.test(url)) {
        url = "http://" + url;
      }
    }
    //调用客户端接口
    callNative("openWindow", {
      "url": url, //url.replace(/^\//, ''),
      "params": params,
      "target": target || "common",
      "options": options || {}
    }, callback);

    console.debug('openWindow: ' + url);
    return url;
  };

  /**
   * 关闭当前窗口
   * @param {Object} [json] 回调父窗口的参数, 可选参数
   */
  JSBridge.closeWindow = function (json) {
    callNative("closeWindow", json);
  };

  //===================================================================================
  // 特殊业务接口 - 游戏
  //===================================================================================
  /**
   * 获取游戏包状态
   * @param {Object/Array} gameInfo 游戏包信息
   * @param {Function} callback 回调函数, 参数为json,取值如下:
   *  - result {Boolean}
   *  - msg {String}
   *  - data {Object/Array}
   *    - gameId {String}
   *    - pkgName {String}
   *    - state {Number} 状态值, 取值如下：
   *      - '0' : 表示本地不存在此应用(显示"安装"，启动下载，或者把下载任务添加到pending队列)
   *      - '1' : 表示已安装的包版本>=门户上的包的版本(显示"打开"，点击启动应用)
   *      - '2' : 表示已安装的包版本<门户上的包的版本(显示"升级"，启动下载，或者把下载任务添加到pending队列)
   *      - '3' : 表示正在下载(显示"暂停")
   *      - '4' : 表示下载任务被暂停(显示"继续"，启动下载，或者把下载任务添加到pending队列)
   *      - '5' : 表示本地不存在此应用，但已下载完成(显示"安装"，启动安装程序)
   *      - '6' : 表示已安装的包版本<门户上的包的版本，并且已成功下载最新版本(显示"升级/安装"，启动安装程序)
   *      - '7' : 表示正在安装(静默安装使用)
   *      - '8' : 表示该游戏已加入下载队列(显示"继续",点击后开始下载)
   *   - cursize {Number} 当前已下载的大小,单位byte
   *   - totalsize {Number} 文件总大小,单位byte
   */
  JSBridge.getPackageState = function (gameInfo, callback) {
    //注意: 在angular里面使用时, 要把callback里面套个$timeout, 避免apply错误
    callLater("getPackageState", {"gameInfo": gameInfo}, callback);
  };

  /**
   * 启动下载
   * @history 原接口downloadApp, downloadApp合并，Native下载失败也续回调，否则JS内存无法回收。并把统计交给壳，下同。
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息, 包含a1, a2, a3
   * @param {Function} [callback] 回调函数, 回调参数为{"result": true/false, "msg":"失败原因说明", "data": {}}。
   */
  JSBridge.startDownloadApp = function (gameInfo, statInfo, callback) {
    callNative("startDownloadApp", {"gameInfo": gameInfo, statInfo: statInfo}, callback);
  };

  /**
   * 恢复下载
   * @history 原接口resumeDownloadTask。
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息
   * @param {Function} callback 回调函数, 定义参见startDownloadApp接口定义。
   */
  JSBridge.resumeDownloadApp = function (gameInfo, statInfo, callback) {
    callNative("resumeDownloadApp", {"gameInfo": gameInfo, statInfo: statInfo}, callback);
  };

  /**
   * 暂停下载
   * @history 原接口stopDownloadTask
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息
   */
  JSBridge.stopDownloadApp = function (gameInfo, statInfo) {
    callNative("stopDownloadApp", {"gameInfo": gameInfo, statInfo: statInfo});
  };

  /**
   * 安装游戏
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息
   */
  JSBridge.installApp = function (gameInfo, statInfo) {
    callNative("installApp", {"gameInfo": gameInfo, statInfo: statInfo});
  };

  /**
   * 打开游戏
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息
   */
  JSBridge.startupApp = function (gameInfo, statInfo) {
    callNative("startupApp", {"gameInfo": gameInfo, statInfo: statInfo});
  };

  /**
   * 打开页游
   * @param {Object} gameInfo 包信息。
   * @param {Object/Array} [statInfo] 统计信息
   */
  JSBridge.startupWebApp = function (gameInfo, statInfo) {
    JSBridge.openWindow(gameInfo.base.serverUrl, {}, 'system');
    if(statInfo){
      JSBridge.addActionStat(statInfo);
    }
  };

  /**
   * 启动系统下载
   * @param {String} url 下载地址。
   * @param {Object/Array} [statInfo] 统计信息, 包含a1, a2, a3
   * @param {Function} [callback] 回调函数, 回调参数为{"result": true/false, "msg":"失败原因说明", "data": {}}。
   */
  JSBridge.downloadBySystem = function (url, statInfo, callback) {
    callNative("downloadBySystem", {"url": url, statInfo: statInfo}, callback);
  };

  /**
   * 检测客户端版本并升级
   */
  JSBridge.checkClientUpdate = function(callback){
    callNative("checkClientUpdate", {}, callback);
  };

  /**
   * 登录
   * @param {Object} loginInfo 取值:{"type" : "floatview","tag" : "subscribeGift","title" : "登录","content" : "登录领取礼包","account" : ""}
   * @param {Object} statInfo
   * @param [callback] 回调函数
   */
  JSBridge.login = function(loginInfo, statInfo, callback){
    var params = Utils.applyIf(loginInfo, {"type": "floatview", "title": "登录", "content": "登录领取礼包", "accountType":"uc"});
    callNative('login', {"loginInfo":params,"statInfo":statInfo}, callback);
  };

  /**
   * 获取登陆信息
   * @returns {Object} {sid:'', ucid:'', nickName:''}
   */
  JSBridge.getAccountInfo = function(){
    var accountInfo = JSBridge.isIOS ? callNative('getAccountInfo',{async:false}):callNative('getAccountInfo');
    return JSON.parse(accountInfo || '{}');
  };

  /**
   * 用户是否已经登录
   */
  JSBridge.isLogin = function() {
    var accountInfo = JSBridge.getAccountInfo();
    return accountInfo && accountInfo.data && accountInfo.data.ucid;
  };


  /**
   * 设置分享信息
   * @param {Object} shareInfo
   * @param {Object} statInfo
   * @param {Boolean} disabled
   * @example
   *  - 取消分享 JSBridge.setShareInfo({}, {}, true);
   */
  JSBridge.setShareInfo = function (shareInfo, statInfo, disabled) {
    callLater("setShareInfo", {"shareInfo": shareInfo, "statInfo" : statInfo, disabled: disabled});
  };

  /**
   * 分享
   * @param shareInfo
   * @param statInfo
   */
  JSBridge.share = function (shareInfo, statInfo) {
    callNative("share", {"shareInfo": shareInfo, "statInfo" : statInfo});
  };


  /**
   * 设置收藏信息
   * @param favoriteInfo
   * @param statInfo
   */
  JSBridge.setFavoriteInfo = function(favoriteInfo,statInfo){
    callLater("setFavoriteInfo", {"favoriteInfo": favoriteInfo, "statInfo" : statInfo});
  };


  //===================================================================================
  // 特殊业务接口 - 兼容旧版本
  //===================================================================================
  /**
   * 检查是否是新接口版本 (>=1.3.2)
   */
  JSBridge.isNewInterface = function(){
    if(!JSBridge.isNewInterface.hasOwnProperty('cache')){
      JSBridge.isNewInterface.cache = !!callNative("getEnv", JSBridge.isIOS ? {"key": "version_code", async:false}:{"key": "version_code"});
    }
    return JSBridge.isNewInterface.cache;
  };

  /**
   * 是否支持批量调用, 2.9.0以上为true
   *
   * @returns {Boolean}
   * @override
   */
  JSBridge.isSupportBatch = function(){
    if(!JSBridge.isSupportBatch.hasOwnProperty('cache')){
      JSBridge.isSupportBatch.cache = JSBridge.isNewInterface() && !JSBridge.needUpdate('2.9.0');
    }
    return JSBridge.isSupportBatch.cache;
  };

  /**
   * 获取当前Native的版本
   */
  JSBridge.getApkVersion = function(){
    if(!JSBridge.getApkVersion.hasOwnProperty('cache')){
      JSBridge.getApkVersion.cache = callNative("getEnv",JSBridge.isIOS ? {"key": 'apk_version', async:false}: {"key": 'apk_version'}) || callNative("getAttributeValue", {"flag": 'apkversion'});
    }
    return JSBridge.getApkVersion.cache;
  };

  /**
   * 比较版本, targetVer > currentVer --> false
   *
   * console.log(compareVersion('2.0.0', '2.0.1') == false)
   * console.log(compareVersion('2.0.0.1', '2.0.1') == false)
   * console.log(compareVersion('3.0.0', '2.16.1') == true)
   * console.log(compareVersion('2.16.0.0', '2.16.1') == false)
   * console.log(compareVersion('3.0.0', '2.16.1.1') == true)
   * console.log(compareVersion('3.0.0', '3.0.0.1') == false)
   * console.log(compareVersion('3.0.0.0', '3.0.0') == false)
   */
  JSBridge.needUpdate = function(targetVer, currentVer) {
    currentVer = currentVer || JSBridge.getApkVersion();
    var result = Utils.compareVersion(currentVer, targetVer);
    return result < 0 || result === false;
  };

  /**
   * 大于等于3.3.1版本是新的数据格式 数据清洗
   * @param newGameInfo
   */
  JSBridge.formatNewGameToOldGame = function (newGameInfo) {
    var base = newGameInfo.base || {};
    var detail = newGameInfo.detail || {};
    var rank = newGameInfo.rank || {};
    var evaluation = newGameInfo.evaluation || {};
    var gift = newGameInfo.gift || {};
    var op = newGameInfo.op || {};
    var time = newGameInfo.time || {};
    var pkgBase = newGameInfo.pkgBase || {};
    var pkgDatas = newGameInfo.pkgDatas || [];
    var pkgDetail = newGameInfo.pkgDetail || {};
    var group = newGameInfo.group || {};
    var event = newGameInfo.event || {};
    var adm = newGameInfo.adm || {};

    var gameInfo = {
      base: {
        gameId: base.gameId,                         //游戏ID
        oldGameId: base.gameOldId,                        // 发行平台旧游戏ID
        gameName: base.name || base.shortName,          //游戏名称
        shortName: base.shortName,                    //游戏短名
        gameIcon: base.iconUrl,                       //游戏图标路径
        isSimple: base.isSimple,                    //是否单机游戏, true/false
        opStatus: op.status,                        //运营状态: 内测,封测...
        category: base.category,                      //分类: 休闲,射击,动作...
        playType: base.playType,                      //下载类型: 端游,页游,混合
        serverUrl: base.svrUrl,                       //页游服务器地址
        uploadTime: time.pkgUploadTime,                   //发布时间
        modifyTime: time.modifyTime,                   //修改时间
        createTime: time.createTime,                   //创建时间
        operationType: op.type,                      // 资费类型
        groupName: group.name,                      // 自由列表分组中文名称
        groupFlag: group.flag                       // 自由列表分组标识
      },
      //状态信息
      status: {
        scoreTotal: evaluation.scoreCount,             //评分人数
        commentTotal: evaluation.commentCount,         //评价人数
        avgScore: evaluation.avgScore,                //平均评分(原avrgScore)
        downloadTotal: rank.downloadTotal,             //总下载量
        downloadMonth: rank.downloadMonth,             //月下载量
        downloadWeek: rank.downloadWeek,               //周下载量
        gift: gift.hasGift,                            //是否有礼包
        excellent: evaluation.isExcellent ? 9 : 0,     //优质游戏:9, 非优质游戏:0
        hasActiCode: gift.hasActivationCode || false,  // 是否有激活码   false 空没有激活码； true 有激活码
        hotValue: rank.hotValue,                       //热度/期待值
        trend: rank.trend,                             //趋势
        stage: op.stageId                              // 1  预热期、 2 测试期、 3 运营期
      },
      //详细信息
      detail: {
        versionName: pkgBase.versionName,                    //版本号(显示用)
        customerInfo: detail.supportInfo,              //客服信息
        lang: detail.lang,                          //语言
        description: detail.description,                //详细介绍
        instruction: evaluation.instruction,                //一句话点评
        versionUpdateDesc: detail.readme      // 版本更新说明（玩家必读）
      },
      pkg: {
        apk: {
          pkgId: pkgBase.pkgId,                            //安装包ID(重要)
          pkgName: pkgBase.pkgName,                 //安装包名
          downloadUrl: pkgBase.downloadUrl,                 //下载地址(已抛包)
          fileSize: pkgBase.fileSize || 0,                   //文件大小(单位byte)
          chId: pkgBase.chId,                           //渠道ID
          overrideChId: "",           //服务器不返回，客户端自己设置覆盖渠道ID(特殊的活动需求, 2.0.2+)
          isDefaultCh: pkgBase.isDefaultCh,             //是否写入默认的CH, 2.0.2+
          versionCode: pkgBase.versionCode,          //版本号(旧版本读取orgVersionCode)
          versionName: pkgBase.versionName,             //版本号(显示用)
          highVer: pkgDetail.highVer,                     //最高系统版本要求，包括系统版本号和版本名，以“|”隔开。比如”17|4.2”
          lowVer: pkgDetail.lowVer,                       //最低系统版本要求
          targetVer: pkgDetail.targetVer
        },
        data: []
      },
      key: {
        gameId: base.gameId,
        pkgId: pkgBase.pkgId,
        pkgName: pkgBase.pkgName,
        versionCode: pkgBase.versionCode
      }
    };

    // 游戏列表分组信息
    if (group) {
      gameInfo.group = {
        groupName:group.name,                     // 分组名称
        createDate:group.createTime,               // 创建时间
        total:group.total                          // 组下面记录数
      }
    }

    // 事件信息
    if(event){
      gameInfo.event ={
        title:event.name,
        beginTime:event.startTime,
        dimBeginTime:event.publishTime,
        type:event.type                            //大事件状态
      }
    }

    if(adm){
      gameInfo.adm ={
        adpId:adm.adpId,          // 广告位编号
        adWord: adm.adWord,       // 文案。当为新游期待榜时，表示为热度。
        admId: adm.admId,         // 广告物料编号
        admType: adm.admTypeId,
        imageUrl: adm.imageUrl   // 图片链接地址。当为图片广告位时，才会有此值
      }
    }

    for (var i = 0; i < pkgDatas.length; i++) {
      var item = pkgDatas.dataPkgsField[i];
      gameInfo.pkg.data.push({
        pkgId: item.pkgId,                    //数据包ID
        downloadUrl: item.downloadUrl,     //下载地址
        fileSize: item.fileSize,           //文件大小(单位byte)
        extractPath: item.extractPath      //数据包的解压地址
      });
      gameInfo.base.fileSize += (item.fileSize || 0);
    }


    console.info("GameHelper.formatNewGameToOldGame", newGameInfo, gameInfo);

    return gameInfo;
  }

  /**
   * 下载九游客户端, 兼容新旧接口
   * @param channel
   */
  JSBridge.downloadNineGameClient = function(channel){
    console.log('>>>>downloadNineGameClient start<<<<<');
    var gameInfo ={
      "base": {
        "gameId": 79532,
        "name": "九游",
        "shortName": "九游",
        "iconUrl": "http://image.game.uc.cn/2014/1/3/9587508_.png",
        "isSimple": true,
        "playType": 1,
        "category": "软件"
      },
      "pkgBase": {
        "pkgId": 695329,
        "pkgName": "cn.ninegame.gamemanager",
        "downloadUrl": "http://assistant.9game.cn/client/down?type=1" + (channel ? ('&ch=' + channel) : ''),
        "fileSize": 1161513,
        "chId": channel,
        "versionCode": 16,
        "versionName": "1.0.10.0"
      },
      "pkgDetail": {
        "lowVer": "8|2.2"
      }
    };

    if(JSBridge.isNewInterface()){

      var cv = Utils.compareVersion(JSBridge.getApkVersion(),'3.3.1');
      console.log('cv:' + cv);
      if(cv == -1) {
        // 兼容版本号小于3.3.1 转换gameInfo为旧数据格式
        gameInfo = JSBridge.formatNewGameToOldGame(gameInfo);
      }
      //{"result": true/false, "msg":"失败原因说明", "data": {}}。
      callNative('startDownloadApp', {"gameInfo": gameInfo});
    }else{
      gameInfo = {
        "id": 695329,
        "gameId": 79532,
        "platformId": 2,
        "gameName": "九游",
        "logoImagePath": "http://image.game.uc.cn/2014/1/3/9587508_.png",
        "chId": channel,
        "downUrl": "http://assistant.9game.cn/client/down?type=1&ch=" + channel,
        "name": "九游",
        "fileSize": 695329,
        "type": 0,
        "dataPackageIds": "",
        "packageName": "cn.ninegame.gamemanager",
        "versionName": "1.1.8",
        "versionCode": 16,
        "signMD5": "cc20fc7c235c3411e147d27ff6adf4f1",
        "description": "",
        "versionUpdateDesc": "",
        "gameType": 1,
        "category": "软件",
        "categoryId": 0,
        "datapkgRootEntries": "",
        "pkgDescription": "",
        "orgVersionCode": 16,
        "playType": 1
      };
      callNative('downloadApp', {"jsonObj": gameInfo});
    }
  };

    /**
     * 提供给h5发IM消息给指定的人（ucid）或者群组（群id）
     * @param {Object} msgInfo
     *      -- type        {Number} 1:群聊  2:单聊
     *      -- targetId    {String} 群聊:群id  单聊:ucid
     *      -- contentType {Number} 可选参数，预填入消息类型（富文本类型--4）
     *      -- content     {String} 可选参数，预填入消息内容
     */
    JSBridge.chat = function(msgInfo) {
      callNative("chat", {"msgInfo":msgInfo});
    };

    /**
     * 调用Native文件选择接口。
     * @param {Boolean} [maxSize] 多选数量, 默认1（代表单选）
     * @param {Function} 可选
     */
    JSBridge.chooseImage = function (maxSize, callback) {
      callNative("chooseImage", {"maxSize": maxSize}, callback);
    }


})(this);;

});