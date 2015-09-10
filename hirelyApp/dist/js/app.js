/* ======= Animations ======= */
$(document).ready(function() {

    //Only animate elements when using non-mobile devices    
    if (isMobile.any === false) { 

        /* Animate elements in #promo (homepage) */
        $('#promo .intro .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        $('#promo .intro .summary').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        
        /* Animate elements in #why (homepage) */
        /*
        $('#why .benefits').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });

        $('#why .testimonials').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
         $('#why .btn').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp6');}
        });
        */
        
        
        /* Animate elements in #video (homepage) */
        $('#video .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#video .summary').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        
        /* Animate elements in #faq */
        /*
        $('#faq .panel').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
        $('#faq .more').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp3');}
        });
        */
    
        
        /* Animate elements in #features-promo */
        $('#features-promo .title').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#features-promo .features-list').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        
        /*
        $('#features-promo .video-container').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp6');}
        });
        
        $('#features .from-left').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInLeft delayp1');}
        });
        
        $('#features .from-right').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInRight delayp3');}
        });
        */
        
        /* Animate elements in #price-plan */
        $('#price-plan .price-figure').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
        $('#price-plan .heading .label').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInDown delayp6');}
        });
        
        /* Animate elements in #blog-list */
        /*
        $('#blog-list .post').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        */
        
        /* Animate elements in #contact-main */
        $('#contact-main .item .icon').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
        
         /* Animate elements in #signup */
        
        $('#signup .signup-form').css('opacity', 0).one('inview', function(isInView) {
            if (isInView) {$(this).addClass('animated fadeInUp delayp1');}
        });
    }
        
});
(function (window, ng) {
  ng.module('app', ['uiGmapgoogle-maps'])
    .factory('channel', function(){
      return function () {
        var callbacks = [];
        this.add = function (cb) {
          callbacks.push(cb);
        };
        this.invoke = function () {
          callbacks.forEach(function (cb) {
            cb();
          });
        };
        return this;
      };
    })
    .service('drawChannel',['channel',function(channel){
      return new channel()
    }])
    .service('clearChannel',['channel',function(channel){
      return new channel()
    }])
    .controller('mapWidgetCtrl', ['$scope', 'drawChannel','clearChannel', function ($scope, drawChannel, clearChannel) {
      $scope.drawWidget = {
        controlText: 'draw',
        controlClick: function () {
          drawChannel.invoke()
        }
      };
      $scope.clearWidget = {
        controlText: 'clear',
        controlClick: function () {
          clearChannel.invoke()
        }
      };
    }])
    .controller('ctrl', ['$rootScope', '$scope',"uiGmapLogger", 'drawChannel','clearChannel',function ($rootScope, $scope, $log,drawChannel, clearChannel) {
      $scope.map = {
        center: {
          latitude: 53.406754,
          longitude: -2.158843
        },
        pan: true,
        zoom: 14,
        refresh: false,
        options: {
          disableDefaultUI: true
        },
        events: {},
        bounds: {},
        polys: [],
        draw: undefined
      };
      var clear = function(){
        $scope.map.polys = [];
      };
      var draw = function(){
        $scope.map.draw();//should be defined by now
      };
      //add beginDraw as a subscriber to be invoked by the channel, allows controller to controller coms
      drawChannel.add(draw);
      clearChannel.add(clear);
    }])
    .run(['$templateCache','uiGmapLogger', function ($templateCache,Logger) {
      Logger.doLog = true;
      $templateCache.put('draw.tpl.html', '<button class="btn btn-lg btn-primary"  ng-click="drawWidget.controlClick()">{{drawWidget.controlText}}</button>');
      $templateCache.put('clear.tpl.html', '<button class="btn btn-lg btn-primary"  ng-click="clearWidget.controlClick()">{{clearWidget.controlText}}</button>');
    }]);
})(window, angular);

/* == jquery mousewheel plugin == Version: 3.1.12, License: MIT License (MIT) */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/* == malihu jquery custom scrollbar plugin == Version: 3.0.9, License: MIT License (MIT) */
!function(e){"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:",i="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min.js";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//"+i+"%3E%3C/script%3E"))),t()}(function(){var t,o="mCustomScrollbar",a="mCS",n=".mCustomScrollbar",i={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:!0,autoUpdateTimeout:60},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},r=0,l={},s=window.attachEvent&&!window.addEventListener?1:0,c=!1,d=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],u={init:function(t){var t=e.extend(!0,{},i,t),o=f.call(this);if(t.live){var s=t.liveSelector||this.selector||n,c=e(s);if("off"===t.live)return void m(s);l[s]=setTimeout(function(){c.mCustomScrollbar(t),"once"===t.live&&c.length&&m(s)},500)}else m(s);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":p(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=g(t.scrollButtons.scrollType),h(t),e(o).each(function(){var o=e(this);if(!o.data(a)){o.data(a,{idx:++r,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null});var n=o.data(a),i=n.opt,l=o.data("mcs-axis"),s=o.data("mcs-scrollbar-position"),c=o.data("mcs-theme");l&&(i.axis=l),s&&(i.scrollbarPosition=s),c&&(i.theme=c,h(i)),v.call(this),e("#mCSB_"+n.idx+"_container img:not(."+d[2]+")").addClass(d[2]),u.update.call(null,o)}})},update:function(t,o){var n=t||f.call(this);return e(n).each(function(){var t=e(this);if(t.data(a)){var n=t.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];if(!r.length)return;n.tweenRunning&&V(t),t.hasClass(d[3])&&t.removeClass(d[3]),t.hasClass(d[4])&&t.removeClass(d[4]),S.call(this),_.call(this),"y"===i.axis||i.advanced.autoExpandHorizontalScroll||r.css("width",x(r.children())),n.overflowed=B.call(this),O.call(this),i.autoDraggerLength&&b.call(this),C.call(this),k.call(this);var s=[Math.abs(r[0].offsetTop),Math.abs(r[0].offsetLeft)];"x"!==i.axis&&(n.overflowed[0]?l[0].height()>l[0].parent().height()?T.call(this):(Q(t,s[0].toString(),{dir:"y",dur:0,overwrite:"none"}),n.contentReset.y=null):(T.call(this),"y"===i.axis?M.call(this):"yx"===i.axis&&n.overflowed[1]&&Q(t,s[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==i.axis&&(n.overflowed[1]?l[1].width()>l[1].parent().width()?T.call(this):(Q(t,s[1].toString(),{dir:"x",dur:0,overwrite:"none"}),n.contentReset.x=null):(T.call(this),"x"===i.axis?M.call(this):"yx"===i.axis&&n.overflowed[0]&&Q(t,s[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&n&&(2===o&&i.callbacks.onImageLoad&&"function"==typeof i.callbacks.onImageLoad?i.callbacks.onImageLoad.call(this):3===o&&i.callbacks.onSelectorChange&&"function"==typeof i.callbacks.onSelectorChange?i.callbacks.onSelectorChange.call(this):i.callbacks.onUpdate&&"function"==typeof i.callbacks.onUpdate&&i.callbacks.onUpdate.call(this)),X.call(this)}})},scrollTo:function(t,o){if("undefined"!=typeof t&&null!=t){var n=f.call(this);return e(n).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l={trigger:"external",scrollInertia:r.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},s=e.extend(!0,{},l,o),c=Y.call(this,t),d=s.scrollInertia>0&&s.scrollInertia<17?17:s.scrollInertia;c[0]=j.call(this,c[0],"y"),c[1]=j.call(this,c[1],"x"),s.moveDragger&&(c[0]*=i.scrollRatio.y,c[1]*=i.scrollRatio.x),s.dur=d,setTimeout(function(){null!==c[0]&&"undefined"!=typeof c[0]&&"x"!==r.axis&&i.overflowed[0]&&(s.dir="y",s.overwrite="all",Q(n,c[0].toString(),s)),null!==c[1]&&"undefined"!=typeof c[1]&&"y"!==r.axis&&i.overflowed[1]&&(s.dir="x",s.overwrite="none",Q(n,c[1].toString(),s))},s.timeout)}})}},stop:function(){var t=f.call(this);return e(t).each(function(){var t=e(this);t.data(a)&&V(t)})},disable:function(t){var o=f.call(this);return e(o).each(function(){var o=e(this);if(o.data(a)){{o.data(a)}X.call(this,"remove"),M.call(this),t&&T.call(this),O.call(this,!0),o.addClass(d[3])}})},destroy:function(){var t=f.call(this);return e(t).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx),s=e("#mCSB_"+i.idx+"_container"),c=e(".mCSB_"+i.idx+"_scrollbar");r.live&&m(r.liveSelector||e(t).selector),X.call(this,"remove"),M.call(this),T.call(this),n.removeData(a),Z(this,"mcs"),c.remove(),s.find("img."+d[2]).removeClass(d[2]),l.replaceWith(s.contents()),n.removeClass(o+" _"+a+"_"+i.idx+" "+d[6]+" "+d[7]+" "+d[5]+" "+d[3]).addClass(d[4])}})}},f=function(){return"object"!=typeof e(this)||e(this).length<1?n:this},h=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=e.inArray(t.theme,o)>-1?!1:t.autoDraggerLength,t.autoExpandScrollbar=e.inArray(t.theme,a)>-1?!1:t.autoExpandScrollbar,t.scrollButtons.enable=e.inArray(t.theme,n)>-1?!1:t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1?!0:t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},m=function(e){l[e]&&(clearTimeout(l[e]),Z(l,e))},p=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},g=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},v=function(){var t=e(this),n=t.data(a),i=n.opt,r=i.autoExpandScrollbar?" "+d[1]+"_expand":"",l=["<div id='mCSB_"+n.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_vertical"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+n.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_horizontal"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],s="yx"===i.axis?"mCSB_vertical_horizontal":"x"===i.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===i.axis?l[0]+l[1]:"x"===i.axis?l[1]:l[0],u="yx"===i.axis?"<div id='mCSB_"+n.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",f=i.autoHideScrollbar?" "+d[6]:"",h="x"!==i.axis&&"rtl"===n.langDir?" "+d[7]:"";i.setWidth&&t.css("width",i.setWidth),i.setHeight&&t.css("height",i.setHeight),i.setLeft="y"!==i.axis&&"rtl"===n.langDir?"989999px":i.setLeft,t.addClass(o+" _"+a+"_"+n.idx+f+h).wrapInner("<div id='mCSB_"+n.idx+"' class='mCustomScrollBox mCS-"+i.theme+" "+s+"'><div id='mCSB_"+n.idx+"_container' class='mCSB_container' style='position:relative; top:"+i.setTop+"; left:"+i.setLeft+";' dir="+n.langDir+" /></div>");var m=e("#mCSB_"+n.idx),p=e("#mCSB_"+n.idx+"_container");"y"===i.axis||i.advanced.autoExpandHorizontalScroll||p.css("width",x(p.children())),"outside"===i.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),p.wrap(u)),w.call(this);var g=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];g[0].css("min-height",g[0].height()),g[1].css("min-width",g[1].width())},x=function(t){return Math.max.apply(Math,t.map(function(){return e(this).outerWidth(!0)}).get())},_=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx+"_container");n.advanced.autoExpandHorizontalScroll&&"y"!==n.axis&&i.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(i[0].getBoundingClientRect().right+.4)-Math.floor(i[0].getBoundingClientRect().left),position:"relative"}).unwrap()},w=function(){var t=e(this),o=t.data(a),n=o.opt,i=e(".mCSB_"+o.idx+"_scrollbar:first"),r=te(n.scrollButtons.tabindex)?"tabindex='"+n.scrollButtons.tabindex+"'":"",l=["<a href='#' class='"+d[13]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[14]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[15]+"' oncontextmenu='return false;' "+r+" />","<a href='#' class='"+d[16]+"' oncontextmenu='return false;' "+r+" />"],s=["x"===n.axis?l[2]:l[0],"x"===n.axis?l[3]:l[1],l[2],l[3]];n.scrollButtons.enable&&i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])},S=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=t.css("max-height")||"none",r=-1!==i.indexOf("%"),l=t.css("box-sizing");if("none"!==i){var s=r?t.parent().height()*parseInt(i)/100:parseInt(i);"border-box"===l&&(s-=t.innerHeight()-t.height()+(t.outerHeight()-t.innerHeight())),n.css("max-height",Math.round(s))}},b=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[n.height()/i.outerHeight(!1),n.width()/i.outerWidth(!1)],c=[parseInt(r[0].css("min-height")),Math.round(l[0]*r[0].parent().height()),parseInt(r[1].css("min-width")),Math.round(l[1]*r[1].parent().width())],d=s&&c[1]<c[0]?c[0]:c[1],u=s&&c[3]<c[2]?c[2]:c[3];r[0].css({height:d,"max-height":r[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":c[0]+"px"}),r[1].css({width:u,"max-width":r[1].parent().width()-10})},C=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[i.outerHeight(!1)-n.height(),i.outerWidth(!1)-n.width()],s=[l[0]/(r[0].parent().height()-r[0].height()),l[1]/(r[1].parent().width()-r[1].width())];o.scrollRatio={y:s[0],x:s[1]}},y=function(e,t,o){var a=o?d[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(d[0]+" "+a),n.toggleClass(d[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(d[0]),n.removeClass(d[1])):(e.addClass(d[0]),n.addClass(d[1])))},B=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=null==o.overflowed?i.height():i.outerHeight(!1),l=null==o.overflowed?i.width():i.outerWidth(!1);return[r>n.height(),l>n.width()]},T=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx),r=e("#mCSB_"+o.idx+"_container"),l=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(V(t),("x"!==n.axis&&!o.overflowed[0]||"y"===n.axis&&o.overflowed[0])&&(l[0].add(r).css("top",0),Q(t,"_resetY")),"y"!==n.axis&&!o.overflowed[1]||"x"===n.axis&&o.overflowed[1]){var s=dx=0;"rtl"===o.langDir&&(s=i.width()-r.outerWidth(!1),dx=Math.abs(s/o.scrollRatio.x)),r.css("left",s),l[1].css("left",dx),Q(t,"_resetX")}},k=function(){function t(){r=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(r),W.call(o[0])):t()},100)}var o=e(this),n=o.data(a),i=n.opt;if(!n.bindEvents){if(R.call(this),i.contentTouchScroll&&D.call(this),E.call(this),i.mouseWheel.enable){var r;t()}P.call(this),H.call(this),i.advanced.autoScrollOnFocus&&z.call(this),i.scrollButtons.enable&&U.call(this),i.keyboard.enable&&F.call(this),n.bindEvents=!0}},M=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar",l=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+r+" ."+d[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+r+">a"),s=e("#mCSB_"+o.idx+"_container");n.advanced.releaseDraggableSelectors&&l.add(e(n.advanced.releaseDraggableSelectors)),o.bindEvents&&(e(document).unbind("."+i),l.each(function(){e(this).unbind("."+i)}),clearTimeout(t[0]._focusTimeout),Z(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),Z(o.sequential,"step"),clearTimeout(s[0].onCompleteTimeout),Z(s[0],"onCompleteTimeout"),o.bindEvents=!1)},O=function(t){var o=e(this),n=o.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container_wrapper"),l=r.length?r:e("#mCSB_"+n.idx+"_container"),s=[e("#mCSB_"+n.idx+"_scrollbar_vertical"),e("#mCSB_"+n.idx+"_scrollbar_horizontal")],c=[s[0].find(".mCSB_dragger"),s[1].find(".mCSB_dragger")];"x"!==i.axis&&(n.overflowed[0]&&!t?(s[0].add(c[0]).add(s[0].children("a")).css("display","block"),l.removeClass(d[8]+" "+d[10])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[0].css("display","none"),l.removeClass(d[10])):(s[0].css("display","none"),l.addClass(d[10])),l.addClass(d[8]))),"y"!==i.axis&&(n.overflowed[1]&&!t?(s[1].add(c[1]).add(s[1].children("a")).css("display","block"),l.removeClass(d[9]+" "+d[11])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[1].css("display","none"),l.removeClass(d[11])):(s[1].css("display","none"),l.addClass(d[11])),l.addClass(d[9]))),n.overflowed[0]||n.overflowed[1]?o.removeClass(d[5]):o.addClass(d[5])},I=function(e){var t=e.type;switch(t){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return e.target.ownerDocument!==document?[e.originalEvent.screenY,e.originalEvent.screenX,!1]:[e.originalEvent.pageY,e.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var o=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0],a=e.originalEvent.touches.length||e.originalEvent.changedTouches.length;return e.target.ownerDocument!==document?[o.screenY,o.screenX,a>1]:[o.pageY,o.pageX,a>1];default:return[e.pageY,e.pageX,!1]}},R=function(){function t(e){var t=m.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}}function o(e,t,o,a){if(m[0].idleTimer=u.scrollInertia<233?250:0,n.attr("id")===h[1])var i="x",r=(n[0].offsetLeft-t+a)*d.scrollRatio.x;else var i="y",r=(n[0].offsetTop-e+o)*d.scrollRatio.y;Q(l,r.toString(),{dir:i,drag:!0})}var n,i,r,l=e(this),d=l.data(a),u=d.opt,f=a+"_"+d.idx,h=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],m=e("#mCSB_"+d.idx+"_container"),p=e("#"+h[0]+",#"+h[1]),g=u.advanced.releaseDraggableSelectors?p.add(e(u.advanced.releaseDraggableSelectors)):p;p.bind("mousedown."+f+" touchstart."+f+" pointerdown."+f+" MSPointerDown."+f,function(o){if(o.stopImmediatePropagation(),o.preventDefault(),$(o)){c=!0,s&&(document.onselectstart=function(){return!1}),t(!1),V(l),n=e(this);var a=n.offset(),d=I(o)[0]-a.top,f=I(o)[1]-a.left,h=n.height()+a.top,m=n.width()+a.left;h>d&&d>0&&m>f&&f>0&&(i=d,r=f),y(n,"active",u.autoExpandScrollbar)}}).bind("touchmove."+f,function(e){e.stopImmediatePropagation(),e.preventDefault();var t=n.offset(),a=I(e)[0]-t.top,l=I(e)[1]-t.left;o(i,r,a,l)}),e(document).bind("mousemove."+f+" pointermove."+f+" MSPointerMove."+f,function(e){if(n){var t=n.offset(),a=I(e)[0]-t.top,l=I(e)[1]-t.left;if(i===a)return;o(i,r,a,l)}}).add(g).bind("mouseup."+f+" touchend."+f+" pointerup."+f+" MSPointerUp."+f,function(e){n&&(y(n,"active",u.autoExpandScrollbar),n=null),c=!1,s&&(document.onselectstart=null),t(!0)})},D=function(){function o(e){if(!ee(e)||c||I(e)[2])return void(t=0);t=1,S=0,b=0,C.removeClass("mCS_touch_action");var o=M.offset();d=I(e)[0]-o.top,u=I(e)[1]-o.left,A=[I(e)[0],I(e)[1]]}function n(e){if(ee(e)&&!c&&!I(e)[2]&&(e.stopImmediatePropagation(),!b||S)){p=J();var t=k.offset(),o=I(e)[0]-t.top,a=I(e)[1]-t.left,n="mcsLinearOut";if(R.push(o),D.push(a),A[2]=Math.abs(I(e)[0]-A[0]),A[3]=Math.abs(I(e)[1]-A[1]),y.overflowed[0])var i=O[0].parent().height()-O[0].height(),r=d-o>0&&o-d>-(i*y.scrollRatio.y)&&(2*A[3]<A[2]||"yx"===B.axis);if(y.overflowed[1])var l=O[1].parent().width()-O[1].width(),f=u-a>0&&a-u>-(l*y.scrollRatio.x)&&(2*A[2]<A[3]||"yx"===B.axis);r||f?(e.preventDefault(),S=1):(b=1,C.addClass("mCS_touch_action")),_="yx"===B.axis?[d-o,u-a]:"x"===B.axis?[null,u-a]:[d-o,null],M[0].idleTimer=250,y.overflowed[0]&&s(_[0],E,n,"y","all",!0),y.overflowed[1]&&s(_[1],E,n,"x",W,!0)}}function i(e){if(!ee(e)||c||I(e)[2])return void(t=0);t=1,e.stopImmediatePropagation(),V(C),m=J();var o=k.offset();f=I(e)[0]-o.top,h=I(e)[1]-o.left,R=[],D=[]}function r(e){if(ee(e)&&!c&&!I(e)[2]){e.stopImmediatePropagation(),S=0,b=0,g=J();var t=k.offset(),o=I(e)[0]-t.top,a=I(e)[1]-t.left;if(!(g-p>30)){x=1e3/(g-m);var n="mcsEaseOut",i=2.5>x,r=i?[R[R.length-2],D[D.length-2]]:[0,0];v=i?[o-r[0],a-r[1]]:[o-f,a-h];var d=[Math.abs(v[0]),Math.abs(v[1])];x=i?[Math.abs(v[0]/4),Math.abs(v[1]/4)]:[x,x];var u=[Math.abs(M[0].offsetTop)-v[0]*l(d[0]/x[0],x[0]),Math.abs(M[0].offsetLeft)-v[1]*l(d[1]/x[1],x[1])];_="yx"===B.axis?[u[0],u[1]]:"x"===B.axis?[null,u[1]]:[u[0],null],w=[4*d[0]+B.scrollInertia,4*d[1]+B.scrollInertia];var C=parseInt(B.contentTouchScroll)||0;_[0]=d[0]>C?_[0]:0,_[1]=d[1]>C?_[1]:0,y.overflowed[0]&&s(_[0],w[0],n,"y",W,!1),y.overflowed[1]&&s(_[1],w[1],n,"x",W,!1)}}}function l(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&Q(C,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var d,u,f,h,m,p,g,v,x,_,w,S,b,C=e(this),y=C.data(a),B=y.opt,T=a+"_"+y.idx,k=e("#mCSB_"+y.idx),M=e("#mCSB_"+y.idx+"_container"),O=[e("#mCSB_"+y.idx+"_dragger_vertical"),e("#mCSB_"+y.idx+"_dragger_horizontal")],R=[],D=[],E=0,W="yx"===B.axis?"none":"all",A=[],P=M.find("iframe"),z=["touchstart."+T+" pointerdown."+T+" MSPointerDown."+T,"touchmove."+T+" pointermove."+T+" MSPointerMove."+T,"touchend."+T+" pointerup."+T+" MSPointerUp."+T];M.bind(z[0],function(e){o(e)}).bind(z[1],function(e){n(e)}),k.bind(z[0],function(e){i(e)}).bind(z[2],function(e){r(e)}),P.length&&P.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind(z[0],function(e){o(e),i(e)}).bind(z[1],function(e){n(e)}).bind(z[2],function(e){r(e)})})})},E=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function n(e,t,o){d.type=o&&i?"stepped":"stepless",d.scrollAmount=10,q(r,e,t,"mcsLinearOut",o?60:null)}var i,r=e(this),l=r.data(a),s=l.opt,d=l.sequential,u=a+"_"+l.idx,f=e("#mCSB_"+l.idx+"_container"),h=f.parent();f.bind("mousedown."+u,function(e){t||i||(i=1,c=!0)}).add(document).bind("mousemove."+u,function(e){if(!t&&i&&o()){var a=f.offset(),r=I(e)[0]-a.top+f[0].offsetTop,c=I(e)[1]-a.left+f[0].offsetLeft;r>0&&r<h.height()&&c>0&&c<h.width()?d.step&&n("off",null,"stepped"):("x"!==s.axis&&l.overflowed[0]&&(0>r?n("on",38):r>h.height()&&n("on",40)),"y"!==s.axis&&l.overflowed[1]&&(0>c?n("on",37):c>h.width()&&n("on",39)))}}).bind("mouseup."+u,function(e){t||(i&&(i=0,n("off",null)),c=!1)})},W=function(){function t(t,a){if(V(o),!A(o,t.target)){var r="auto"!==i.mouseWheel.deltaFactor?parseInt(i.mouseWheel.deltaFactor):s&&t.deltaFactor<100?100:t.deltaFactor||100;if("x"===i.axis||"x"===i.mouseWheel.axis)var d="x",u=[Math.round(r*n.scrollRatio.x),parseInt(i.mouseWheel.scrollAmount)],f="auto"!==i.mouseWheel.scrollAmount?u[1]:u[0]>=l.width()?.9*l.width():u[0],h=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetLeft),m=c[1][0].offsetLeft,p=c[1].parent().width()-c[1].width(),g=t.deltaX||t.deltaY||a;else var d="y",u=[Math.round(r*n.scrollRatio.y),parseInt(i.mouseWheel.scrollAmount)],f="auto"!==i.mouseWheel.scrollAmount?u[1]:u[0]>=l.height()?.9*l.height():u[0],h=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetTop),m=c[0][0].offsetTop,p=c[0].parent().height()-c[0].height(),g=t.deltaY||a;"y"===d&&!n.overflowed[0]||"x"===d&&!n.overflowed[1]||((i.mouseWheel.invert||t.webkitDirectionInvertedFromDevice)&&(g=-g),i.mouseWheel.normalizeDelta&&(g=0>g?-1:1),(g>0&&0!==m||0>g&&m!==p||i.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),Q(o,(h-g*f).toString(),{dir:d}))}}if(e(this).data(a)){var o=e(this),n=o.data(a),i=n.opt,r=a+"_"+n.idx,l=e("#mCSB_"+n.idx),c=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")],d=e("#mCSB_"+n.idx+"_container").find("iframe");d.length&&d.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+r,function(e,o){t(e,o)})})}),l.bind("mousewheel."+r,function(e,o){t(e,o)})}},L=function(e){var t=null;try{var o=e.contentDocument||e.contentWindow.document;t=o.body.innerHTML}catch(a){}return null!==t},A=function(t,o){var n=o.nodeName.toLowerCase(),i=t.data(a).opt.mouseWheel.disableOver,r=["select","textarea"];return e.inArray(n,i)>-1&&!(e.inArray(n,r)>-1&&!e(o).is(":focus"))},P=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container"),r=i.parent(),l=e(".mCSB_"+o.idx+"_scrollbar ."+d[12]);l.bind("touchstart."+n+" pointerdown."+n+" MSPointerDown."+n,function(e){c=!0}).bind("touchend."+n+" pointerup."+n+" MSPointerUp."+n,function(e){c=!1}).bind("click."+n,function(a){if(e(a.target).hasClass(d[12])||e(a.target).hasClass("mCSB_draggerRail")){V(t);var n=e(this),l=n.find(".mCSB_dragger");if(n.parent(".mCSB_scrollTools_horizontal").length>0){if(!o.overflowed[1])return;var s="x",c=a.pageX>l.offset().left?-1:1,u=Math.abs(i[0].offsetLeft)-.9*c*r.width()}else{if(!o.overflowed[0])return;var s="y",c=a.pageY>l.offset().top?-1:1,u=Math.abs(i[0].offsetTop)-.9*c*r.height()}Q(t,u.toString(),{dir:s,scrollEasing:"mcsEaseInOut"})}})},z=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=e("#mCSB_"+o.idx+"_container"),l=r.parent();r.bind("focusin."+i,function(o){var a=e(document.activeElement),i=r.find(".mCustomScrollBox").length,s=0;a.is(n.advanced.autoScrollOnFocus)&&(V(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=i?(s+17)*i:0,t[0]._focusTimeout=setTimeout(function(){var e=[oe(a)[0],oe(a)[1]],o=[r[0].offsetTop,r[0].offsetLeft],i=[o[0]+e[0]>=0&&o[0]+e[0]<l.height()-a.outerHeight(!1),o[1]+e[1]>=0&&o[0]+e[1]<l.width()-a.outerWidth(!1)],c="yx"!==n.axis||i[0]||i[1]?"all":"none";"x"===n.axis||i[0]||Q(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:c,dur:s}),"y"===n.axis||i[1]||Q(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:c,dur:s})},t[0]._focusTimer))})},H=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container").parent();i.bind("scroll."+n,function(t){(0!==i.scrollTop()||0!==i.scrollLeft())&&e(".mCSB_"+o.idx+"_scrollbar").css("visibility","hidden")})},U=function(){var t=e(this),o=t.data(a),n=o.opt,i=o.sequential,r=a+"_"+o.idx,l=".mCSB_"+o.idx+"_scrollbar",s=e(l+">a");s.bind("mousedown."+r+" touchstart."+r+" pointerdown."+r+" MSPointerDown."+r+" mouseup."+r+" touchend."+r+" pointerup."+r+" MSPointerUp."+r+" mouseout."+r+" pointerout."+r+" MSPointerOut."+r+" click."+r,function(a){function r(e,o){i.scrollAmount=n.snapAmount||n.scrollButtons.scrollAmount,q(t,e,o)}if(a.preventDefault(),$(a)){var l=e(this).attr("class");switch(i.type=n.scrollButtons.scrollType,a.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===i.type)return;c=!0,o.tweenRunning=!1,r("on",l);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===i.type)return;c=!1,i.dir&&r("off",l);break;case"click":if("stepped"!==i.type||o.tweenRunning)return;r("on",l)}}})},F=function(){function t(t){function a(e,t){r.type=i.keyboard.scrollType,r.scrollAmount=i.snapAmount||i.keyboard.scrollAmount,"stepped"===r.type&&n.tweenRunning||q(o,e,t)}switch(t.type){case"blur":n.tweenRunning&&r.dir&&a("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,s="on";if("x"!==i.axis&&(38===l||40===l)||"y"!==i.axis&&(37===l||39===l)){if((38===l||40===l)&&!n.overflowed[0]||(37===l||39===l)&&!n.overflowed[1])return;"keyup"===t.type&&(s="off"),e(document.activeElement).is(u)||(t.preventDefault(),t.stopImmediatePropagation(),a(s,l))}else if(33===l||34===l){if((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){V(o);var f=34===l?-1:1;if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=Math.abs(c[0].offsetLeft)-.9*f*d.width();else var h="y",m=Math.abs(c[0].offsetTop)-.9*f*d.height();Q(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(u)&&((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=35===l?Math.abs(d.width()-c.outerWidth(!1)):0;else var h="y",m=35===l?Math.abs(d.height()-c.outerHeight(!1)):0;Q(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),n=o.data(a),i=n.opt,r=n.sequential,l=a+"_"+n.idx,s=e("#mCSB_"+n.idx),c=e("#mCSB_"+n.idx+"_container"),d=c.parent(),u="input,textarea,select,datalist,keygen,[contenteditable='true']",f=c.find("iframe"),h=["blur."+l+" keydown."+l+" keyup."+l];f.length&&f.each(function(){e(this).load(function(){L(this)&&e(this.contentDocument||this.contentWindow.document).bind(h[0],function(e){t(e)})})}),s.attr("tabindex","0").bind(h[0],function(e){t(e)})},q=function(t,o,n,i,r){function l(e){var o="stepped"!==f.type,a=r?r:e?o?p/1.5:g:1e3/60,n=e?o?7.5:40:2.5,s=[Math.abs(h[0].offsetTop),Math.abs(h[0].offsetLeft)],d=[c.scrollRatio.y>10?10:c.scrollRatio.y,c.scrollRatio.x>10?10:c.scrollRatio.x],u="x"===f.dir[0]?s[1]+f.dir[1]*d[1]*n:s[0]+f.dir[1]*d[0]*n,m="x"===f.dir[0]?s[1]+f.dir[1]*parseInt(f.scrollAmount):s[0]+f.dir[1]*parseInt(f.scrollAmount),v="auto"!==f.scrollAmount?m:u,x=i?i:e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear",_=e?!0:!1;return e&&17>a&&(v="x"===f.dir[0]?s[1]:s[0]),Q(t,v.toString(),{dir:f.dir[0],scrollEasing:x,dur:a,onComplete:_}),e?void(f.dir=!1):(clearTimeout(f.step),void(f.step=setTimeout(function(){l()},a)))}function s(){clearTimeout(f.step),Z(f,"step"),V(t)}var c=t.data(a),u=c.opt,f=c.sequential,h=e("#mCSB_"+c.idx+"_container"),m="stepped"===f.type?!0:!1,p=u.scrollInertia<26?26:u.scrollInertia,g=u.scrollInertia<1?17:u.scrollInertia;switch(o){case"on":if(f.dir=[n===d[16]||n===d[15]||39===n||37===n?"x":"y",n===d[13]||n===d[15]||38===n||37===n?-1:1],V(t),te(n)&&"stepped"===f.type)return;l(m);break;case"off":s(),(m||c.tweenRunning&&f.dir)&&l(!0)}},Y=function(t){var o=e(this).data(a).opt,n=[];return"function"==typeof t&&(t=t()),t instanceof Array?n=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(n[0]=t.y?t.y:t.x||"x"===o.axis?null:t,n[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof n[0]&&(n[0]=n[0]()),"function"==typeof n[1]&&(n[1]=n[1]()),n},j=function(t,o){if(null!=t&&"undefined"!=typeof t){var n=e(this),i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx+"_container"),s=l.parent(),c=typeof t;o||(o="x"===r.axis?"x":"y");var d="x"===o?l.outerWidth(!1):l.outerHeight(!1),f="x"===o?l[0].offsetLeft:l[0].offsetTop,h="x"===o?"left":"top";switch(c){case"function":return t();case"object":var m=t.jquery?t:e(t);if(!m.length)return;return"x"===o?oe(m)[1]:oe(m)[0];case"string":case"number":if(te(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(f-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var p=f+parseInt(t.split("+=")[1]);return p>=0?0:Math.abs(p)}if(-1!==t.indexOf("px")&&te(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(s.height()-l.outerHeight(!1));if("right"===t)return Math.abs(s.width()-l.outerWidth(!1));if("first"===t||"last"===t){var m=l.find(":"+t);return"x"===o?oe(m)[1]:oe(m)[0]}return e(t).length?"x"===o?oe(e(t))[1]:oe(e(t))[0]:(l.css(h,t),void u.update.call(null,n[0]))}}},X=function(t){function o(){return clearTimeout(h[0].autoUpdate),0===s.parents("html").length?void(s=null):void(h[0].autoUpdate=setTimeout(function(){return f.advanced.updateOnSelectorChange&&(m=r(),m!==w)?(l(3),void(w=m)):(f.advanced.updateOnContentResize&&(p=[h.outerHeight(!1),h.outerWidth(!1),v.height(),v.width(),_()[0],_()[1]],(p[0]!==S[0]||p[1]!==S[1]||p[2]!==S[2]||p[3]!==S[3]||p[4]!==S[4]||p[5]!==S[5])&&(l(p[0]!==S[0]||p[1]!==S[1]),S=p)),f.advanced.updateOnImageLoad&&(g=n(),g!==b&&(h.find("img").each(function(){i(this)}),b=g)),void((f.advanced.updateOnSelectorChange||f.advanced.updateOnContentResize||f.advanced.updateOnImageLoad)&&o()))},f.advanced.autoUpdateTimeout))}function n(){var e=0;return f.advanced.updateOnImageLoad&&(e=h.find("img").length),e}function i(t){function o(e,t){return function(){return t.apply(e,arguments)}}function a(){this.onload=null,e(t).addClass(d[2]),l(2)}if(e(t).hasClass(d[2]))return void l();var n=new Image;n.onload=o(n,a),n.src=t.src}function r(){f.advanced.updateOnSelectorChange===!0&&(f.advanced.updateOnSelectorChange="*");var t=0,o=h.find(f.advanced.updateOnSelectorChange);return f.advanced.updateOnSelectorChange&&o.length>0&&o.each(function(){t+=e(this).height()+e(this).width()}),t}function l(e){clearTimeout(h[0].autoUpdate),u.update.call(null,s[0],e)}var s=e(this),c=s.data(a),f=c.opt,h=e("#mCSB_"+c.idx+"_container");if(t)return clearTimeout(h[0].autoUpdate),void Z(h[0],"autoUpdate");var m,p,g,v=h.parent(),x=[e("#mCSB_"+c.idx+"_scrollbar_vertical"),e("#mCSB_"+c.idx+"_scrollbar_horizontal")],_=function(){return[x[0].is(":visible")?x[0].outerHeight(!0):0,x[1].is(":visible")?x[1].outerWidth(!0):0]},w=r(),S=[h.outerHeight(!1),h.outerWidth(!1),v.height(),v.width(),_()[0],_()[1]],b=n();o()},N=function(e,t,o){return Math.round(e/t)*t-o},V=function(t){var o=t.data(a),n=e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal");n.each(function(){K.call(this)})},Q=function(t,o,n){function i(e){return s&&c.callbacks[e]&&"function"==typeof c.callbacks[e]}function r(){return[c.callbacks.alwaysTriggerOffsets||_>=w[0]+b,c.callbacks.alwaysTriggerOffsets||-C>=_]}function l(){var e=[h[0].offsetTop,h[0].offsetLeft],o=[v[0].offsetTop,v[0].offsetLeft],a=[h.outerHeight(!1),h.outerWidth(!1)],i=[f.height(),f.width()];t[0].mcs={content:h,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(a[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(a[1])-i[1])),direction:n.dir}}var s=t.data(a),c=s.opt,d={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:c.scrollInertia,overwrite:"all",
callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},n=e.extend(d,n),u=[n.dur,n.drag?0:n.dur],f=e("#mCSB_"+s.idx),h=e("#mCSB_"+s.idx+"_container"),m=h.parent(),p=c.callbacks.onTotalScrollOffset?Y.call(t,c.callbacks.onTotalScrollOffset):[0,0],g=c.callbacks.onTotalScrollBackOffset?Y.call(t,c.callbacks.onTotalScrollBackOffset):[0,0];if(s.trigger=n.trigger,(0!==m.scrollTop()||0!==m.scrollLeft())&&(e(".mCSB_"+s.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||s.contentReset.y||(i("onOverflowYNone")&&c.callbacks.onOverflowYNone.call(t[0]),s.contentReset.y=1),"_resetX"!==o||s.contentReset.x||(i("onOverflowXNone")&&c.callbacks.onOverflowXNone.call(t[0]),s.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){switch(!s.contentReset.y&&t[0].mcs||!s.overflowed[0]||(i("onOverflowY")&&c.callbacks.onOverflowY.call(t[0]),s.contentReset.x=null),!s.contentReset.x&&t[0].mcs||!s.overflowed[1]||(i("onOverflowX")&&c.callbacks.onOverflowX.call(t[0]),s.contentReset.x=null),c.snapAmount&&(o=N(o,c.snapAmount,c.snapOffset)),n.dir){case"x":var v=e("#mCSB_"+s.idx+"_dragger_horizontal"),x="left",_=h[0].offsetLeft,w=[f.width()-h.outerWidth(!1),v.parent().width()-v.width()],S=[o,0===o?0:o/s.scrollRatio.x],b=p[1],C=g[1],B=b>0?b/s.scrollRatio.x:0,T=C>0?C/s.scrollRatio.x:0;break;case"y":var v=e("#mCSB_"+s.idx+"_dragger_vertical"),x="top",_=h[0].offsetTop,w=[f.height()-h.outerHeight(!1),v.parent().height()-v.height()],S=[o,0===o?0:o/s.scrollRatio.y],b=p[0],C=g[0],B=b>0?b/s.scrollRatio.y:0,T=C>0?C/s.scrollRatio.y:0}S[1]<0||0===S[0]&&0===S[1]?S=[0,0]:S[1]>=w[1]?S=[w[0],w[1]]:S[0]=-S[0],t[0].mcs||(l(),i("onInit")&&c.callbacks.onInit.call(t[0])),clearTimeout(h[0].onCompleteTimeout),(s.tweenRunning||!(0===_&&S[0]>=0||_===w[0]&&S[0]<=w[0]))&&(G(v[0],x,Math.round(S[1]),u[1],n.scrollEasing),G(h[0],x,Math.round(S[0]),u[0],n.scrollEasing,n.overwrite,{onStart:function(){n.callbacks&&n.onStart&&!s.tweenRunning&&(i("onScrollStart")&&(l(),c.callbacks.onScrollStart.call(t[0])),s.tweenRunning=!0,y(v),s.cbOffsets=r())},onUpdate:function(){n.callbacks&&n.onUpdate&&i("whileScrolling")&&(l(),c.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(n.callbacks&&n.onComplete){"yx"===c.axis&&clearTimeout(h[0].onCompleteTimeout);var e=h[0].idleTimer||0;h[0].onCompleteTimeout=setTimeout(function(){i("onScroll")&&(l(),c.callbacks.onScroll.call(t[0])),i("onTotalScroll")&&S[1]>=w[1]-B&&s.cbOffsets[0]&&(l(),c.callbacks.onTotalScroll.call(t[0])),i("onTotalScrollBack")&&S[1]<=T&&s.cbOffsets[1]&&(l(),c.callbacks.onTotalScrollBack.call(t[0])),s.tweenRunning=!1,h[0].idleTimer=0,y(v,"hide")},e)}}}))}},G=function(e,t,o,a,n,i,r){function l(){S.stop||(x||m.call(),x=J()-v,s(),x>=S.time&&(S.time=x>S.time?x+f-(x-S.time):x+f-1,S.time<x+1&&(S.time=x+1)),S.time<a?S.id=h(l):g.call())}function s(){a>0?(S.currVal=u(S.time,_,b,a,n),w[t]=Math.round(S.currVal)+"px"):w[t]=o+"px",p.call()}function c(){f=1e3/60,S.time=x+f,h=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=h(l)}function d(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}function u(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return e/=a/2,1>e?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return e/=a/2,1>e?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(-Math.pow(2,-10*e)+2)+t);case"easeInOut":case"mcsEaseInOut":return e/=a/2,1>e?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(-Math.pow(2,-10*e/a)+1)+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var f,h,r=r||{},m=r.onStart||function(){},p=r.onUpdate||function(){},g=r.onComplete||function(){},v=J(),x=0,_=e.offsetTop,w=e.style,S=e._mTween[t];"left"===t&&(_=e.offsetLeft);var b=o-_;S.stop=0,"none"!==i&&d(),c()},J=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},K=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},Z=function(e,t){try{delete e[t]}catch(o){e[t]=null}},$=function(e){return!(e.which&&1!==e.which)},ee=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},te=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},oe=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]};e.fn[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o].defaults=i,window[o]=!0,e(window).load(function(){e(n)[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),a=[i[0].offsetTop,i[0].offsetLeft],a[0]+oe(n)[0]>=0&&a[0]+oe(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+oe(n)[1]>=0&&a[1]+oe(n)[1]<o.width()-n.outerWidth(!1)},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data(a);if(o)return o.overflowed[0]||o.overflowed[1]}})})})});
$(document).ready(function() {

    /* ======= Fixed header when scrolled ======= */

    $(window).bind('scroll', function() {
        if ($(window).scrollTop() > 0) {
            $('#header').addClass('navbar-fixed-top');
        }
        else {
            $('#header').removeClass('navbar-fixed-top');
        }
    });

});
/* =================================
 ===  WOW ANIMATION             ====
 =================================== */

new WOW().init();

/**
 * Created by labrina.loving on 9/10/2015.
 */
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map
/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.account', []);
})();
/**
 * Created by labrina.loving on 8/16/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.candidate', []);
})();

/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.core', []);
})();

/**
 * Created by labrina.loving on 8/5/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.home', []);
})();


/**
 * Created by mike.baker on 8/10/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.job', []);
})();


/**
 * Created by mike.baker on 8/17/2015.
 */

(function() {
    'use strict';

    angular.module('hirelyApp.jobdetails', []);
})();


/**
 * Created by labrina.loving on 8/6/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.layout', []);
})();
/**
 * Created by labrina.loving on 8/5/2015.
 */
(function() {
    'use strict';

    angular.module('hirelyApp.shared', []);
})();

'use strict';

var myApp = angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'uiGmapgoogle-maps',
        'firebase',
        'ngMask',
        'tc.chartjs',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
        'hirelyApp.jobdetails',
        'hirelyApp.core',
        'hirelyApp.account',
        'hirelyApp.candidate'
    ])



    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateProvider: function($templateCache){
                    return $templateCache.get('app/layout/master.html');
                }
            })
            .state('appFS', {
                url: "/appFS",
                abstract: true,
                templateProvider: function($templateCache){

                    return $templateCache.get('app/layout/master-fullscreen.html');
                }
            })
            .state('appFS.home', {
                url: '/home',
                parent: 'appFS',

                templateProvider: function($templateCache){
                    return $templateCache.get('app/home/home.html');
                },
                controller: 'HomeCtrl'
            })
            .state('app.login', {
                url: '/login',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/login.html');
                },
                controller: 'LoginCtrl'
            })
            .state('appFS.job', {
                url: '/job',
                parent: 'appFS',
                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/job/job-search.html');
                },
                controller: 'JobSearchCtrl'
            })
            .state('app.jobdetails', {
                url: '/jobdetails',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/jobdetails/jobDetails.html');
                },
                controller: 'JobCtrl'
            })
            .state('app.register', {
                url: '/register',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/register.html');
                },
                controller: 'RegisterCtrl'
            })
            .state('app.candidate', {
                url: '/candidate',
                abstract: true,

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate.html');
                },
                authRequired: true,
                controller: 'CandidateCtrl'
            })
            .state('app.candidate.dashboard', {
                url: '/dashboard',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-dashboard.html');
                },
                controller: 'CandidateDashboardCtrl',
                authRequired: true
            })
            .state('app.candidate.profile', {
                abstract: true,
                url: '/profile',

                templateProvider: function ($templateCache) {
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile.html');

                },
                controller: 'CandidateProfileCtrl',
                authRequired: true,
                resolve: {
                    profile: function ($q, CandidateService, UserService) {
                        //retrieve profile before loading
                        var user = UserService.getCurrentUser();
                        return CandidateService.getProfile(user.providerId).then(function(profile) {

                           return profile;
                        }, function(err) {
                            deferred.reject(err);
                        });

                    }
                }
            })
            .state('app.candidate.profile.basics', {
                url: '/basics',

                templateProvider: function($templateCache){

                    return $templateCache.get('app/candidate/profile/candidate-profile-basics.html');
                },
                controller: 'CandidateProfileBasicsCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.availability', {
                url: '/Availability',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-availability.html');
                },
                controller: 'CandidateProfileAvailabilityCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.experience', {
                url: '/Experience',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-experience.html');
                },
                // controller: 'CandidateProfileCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.personality', {
                url: '/candidateProfileEducation',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-education.html');
                },
                //  controller: 'CandidateProfileCtrl',
                authRequired: true
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/appFS/home');
    });

/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', LoginCtrl ]);


    function LoginCtrl($scope, $stateParams, $modalInstance, AuthService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};

        vm.FbLogin = function(){
           authService.thirdPartyLogin('facebook')
               .then(function(data){
                   $modalInstance.close();

               }, function(err) {

                   $scope.error = errMessage(err);
               }
           );

        };

        vm.PasswordLogin = function() {
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(function(auth){
                    $modalInstance.close();
                }, function(err) {
                    alert(err)
                });
        };


        vm.CloseModal = function (){
            $modalInstance.close();
        };


    }
})();
/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('RegisterCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', 'UserService', RegisterCtrl ]);

    function RegisterCtrl($scope, $stateParams,  $modalInstance,AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: ''}

        vm.FbRegister = function () {

            registerThirdPartyUser('facebook')
        }

        vm.GoogleRegister = function () {

            registerThirdPartyUser('google')
        }

        vm.TwitterRegister = function () {

            registerThirdPartyUser('twitter')
        }

        vm.registerNewUser = function() {
            registerPasswordUser($scope.user)
        }

        vm.CloseModal = function (){
            $modalInstance.close();
        }

        //this function registers user in 3rd party and
        //and then creates Firebase db
        function registerThirdPartyUser(provider, scope) {
            authService.thirdPartyLogin(provider, scope)
                .then(function(user) {
                    userService.createUserfromThirdParty(provider, user)
                        .then(function(fbUser){
                            userService.setCurrentUser(fbUser, provider.uid);
                            $modalInstance.close();
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
        }

        function registerPasswordUser(registeredUser){
            //register new user
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(user) {
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    userService.setCurrentUser(newUser, user.uid);
                                    $modalInstance.close();
                                }, function(err) {
                                    alert(err)
                                });
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })

        }


    }




})();

/**
 * Created by labrina.loving on 8/26/2015.
 **/

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateCtrl', ['$scope','$stateParams', 'UserService', CandidateCtrl ]);


    function CandidateCtrl($scope, $stateParams, UserService) {
        var userService = UserService;
        var vm = this;

        $scope.user = userService.getCurrentUser();



        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.user = args.message;


        });
    }
})()
;


/**
 * Created by labrina.loving on 8/16/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateDashboardCtrl', ['$scope','$stateParams', CandidateDashboardCtrl ]);


    function CandidateDashboardCtrl($scope, $stateParams) {

        var vm = this;
        $scope.uiGridOptions  = {
            data: 'recentApps',
            columnDefs: [{
                field: 'company'
            }, {
                field: 'position'
            }, {
                field: 'application date'
            },
                {
                    field: 'current status'
                }
            ]
        };

        $scope.recentApps = [];

        if($scope.user.Applications){
            $scope.recentApps = $scope.user.Applications;
        }

        // Chart.js Data
        $scope.data = [
            {
                value: 5,
                color:'#FFA540',
                highlight: '#BF7C30',
                label: 'Review'
            },
            {
                value: 2,
                color: '#38A2D0',
                highlight: '#5AD3D1',
                label: 'Interview Scheduled '
            },
            {
                value: 1,
                color: '#37DB79',
                highlight: '#FFC870',
                label: 'Passed'
            }
        ];

        // Chart.js Options
        $scope.options =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 50, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            showLegend: false

          };



    }
})()
;

/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$firebaseAuth', 'fbutil', '$q', AuthService]);

    function AuthService($firebaseAuth, fbutil, $q) {
        var self = this;
        var firebaseRef = $firebaseAuth(fbutil.ref());
        var authData = '';
        var service =  {
            thirdPartyLogin: thirdPartyLogin,
            AuthRef: AuthRef,
            registerNewUser: registerNewUser,
            passwordLogin: passwordLogin,
            logout: logout
        };
        return service;

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider, scope) {

            var deferred = $q.defer();
            firebaseRef.$authWithOAuthPopup(provider, scope)
                .then(function(user) {
                   deferred.resolve(user);
                }, function(err) {
                  deferred.reject(err);
                });


          return deferred.promise;
        };

        function passwordLogin(email, password) {

            var deferred = $q.defer();
            firebaseRef.$authWithPassword({
                email    : email,
                password : password
                })
                .then(function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        function AuthRef(){
            return firebaseRef;
        }

        function logout(){
            firebaseRef.$unauth();
        }

        function registerNewUser(email, password) {

            var deferred = $q.defer();
            firebaseRef.$createUser({
                    email: email,
                    password : password})
                .then(function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        function AuthRef(){
            return firebaseRef;
        }




    }
})();
/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('BroadcastService', ['$rootScope', BroadcastService]);

    function BroadcastService($rootScope) {
        var self = this;

        var service =  {
            send: send
        };
        return service;

        function send(msg, data){
            $rootScope.$broadcast(msg, data);
        }




    }
})();
/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('CandidateService', ['$q','FBURL', '$firebaseObject', 'fbutil', CandidateService]);

    function CandidateService($q, FBURL, $firebaseObject, fbutil, CandidateService) {
        var self = this;
        var profile;


        function candidateModel(){
            this.authorizedInUS = '';
            this.status = '';
            this.experience ={};
            this.education = {};
            this.personality = {};
            this.availability = {};
        }


        this.getProfile = function getProfile(userId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var profile = new Firebase.util.NormalizedCollection(
                ref.child('users'),
                ref.child('candidates'),
                ref.child('candidate-experience'),
                ref.child('candidate-availability')
            );

            // specify the fields for each path
            profile = profile.select({key: 'candidates.$value', alias: 'candidate'},{key: 'candidate-availability.$value', alias: 'availability'} );


            // apply a client-side filter to the data (only return users where key === 'user1'
            profile = profile.filter(
                function(data, key, priority) { return key === userId; }
            );

            var profileRef = profile.ref().child(userId);
            // run it and see what we get
            profileRef.once('value', function(snap) {
                    var profile = snap.val();
                    deferred.resolve(profile);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }

        this.saveCandidate = function saveCandidate(candidate, key) {
            var ref = fbutil.ref('candidates', key);
            ref.set(candidate)
        };

        this.saveAvailability = function saveAvailability(availability, key) {
            var ref = fbutil.ref('candidate-availability', key);
            ref.set(availability)
        };


    }
})();


/**
 * Created by labrina.loving on 9/7/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')

        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        })
})();
/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')
        // version of this seed app is compatible with angularFire 0.6
        // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
        .constant('version', '0.6')

        // where to redirect users if they need to authenticate (see module.routeSecurity)
        .constant('loginRedirectPath', 'appFS.home')

        // your Firebase URL goes here
        .constant('FBURL', 'https://shining-torch-5144.firebaseio.com')

        .constant('GOOGLEMAPSURL', 'https://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false')

        .constant('filePickerKey', 'AALU2i7ySUuUi8XUDHq8wz')

        .constant('candidateStatus', {1: 'Active', 2: 'Employed', 3: 'Inactive'})
})();
/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('FilePickerService', ['$window', FilePickerService]);

    function FilePickerService($window) {
        return $window.filepicker;
    }

})();
/**
 * Created by labrina.loving on 8/10/2015.
 */

// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('hirelyApp.core')
    .factory('fbutil', ['$window', 'FBURL', '$q', function($window, FBURL, $q) {


        var utils = {
            // convert a node or Firebase style callback to a future
            handler: function(fn, context) {
                return utils.defer(function(def) {
                    fn.call(context, function(err, result) {
                        if( err !== null ) { def.reject(err); }
                        else { def.resolve(result); }
                    });
                });
            },

            // abstract the process of creating a future/promise
            defer: function(fn, context) {
                var def = $q.defer();
                fn.call(context, def);
                return def.promise;
            },

            ref: firebaseRef
        };

        return utils;

        function pathRef(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = pathRef(args[i]);
                }
                else if( typeof args[i] !== 'string' ) {
                    throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
                }
            }
            return args.join('/');
        }

        /**
         * Example:
         * <code>
         *    function(firebaseRef) {
         *       var ref = firebaseRef('path/to/data');
         *    }
         * </code>
         *
         * @function
         * @name firebaseRef
         * @param {String|Array...} path relative path to the root folder in Firebase instance
         * @return a Firebase instance
         */
        function firebaseRef(path) {
            var ref = new $window.Firebase(FBURL);
            var args = Array.prototype.slice.call(arguments);
            if( args.length ) {
                ref = ref.child(pathRef(args));
            }
            return ref;
        }
    }]);


/**
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL) {
        var MAPS_ENDPOINT = GOOGLEMAPSURL;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlace: getPlace,
            setPlace: setPlace
        };
        return service;

        function getPlacebyLatLong(latitude, longitude){
            var url = MAPS_ENDPOINT.replace('{POSITION}', latitude + ',' + longitude);
            var deferred = $q.defer();


            $http.get(url).success(function(response) {
                // hacky
                var place;
                angular.forEach(response.results, function(result) {
                    if(result.types[0] === 'postal_code') {
                        place = result;
                    }
                });
                deferred.resolve(place);
            }).error(deferred.reject);

            return deferred.promise;
        }

        function setPlace(place)
        {
            if(place && place.geometry.location.G)
            {
                place.geometry.location.lat = place.geometry.location.G;
                place.geometry.location.lng = place.geometry.location.K;
            }

            currentPlace = place;
        }

        function getPlace()
        {
            return currentPlace;
        }

    }


})();

/**
 * Created by mike.baker on 8/19/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('JobdetailsService', ['$q', '$http', JobdetailsService]);

    function JobdetailsService($q, $http) {
  
        var currentJob = '';
        var selected = '';
        var service =  {
            getJob: getJob,
            setJob: setJob
        };
        return service;

        function setJob(selected)
        {
            currentJob = selected;
        }

        function getJob()
        {
            return currentJob;
        }

    }


})();

/**
 * Created by labrina.loving on 8/9/2015.
 */
angular.module('hirelyApp.core')
    .config(['$provide', function($provide) {
        // adapt ng-cloak to wait for auth before it does its magic
        $provide.decorator('ngCloakDirective', ['$delegate', 'Auth',
            function($delegate, Auth) {
                var directive = $delegate[0];
                // make a copy of the old directive
                var _compile = directive.compile;
                directive.compile = function(element, attr) {
                    Auth.$waitForAuth().then(function() {
                        // after auth, run the original ng-cloak directive
                        _compile.call(directive, element, attr);
                    });
                };
                // return the modified directive
                return $delegate;
            }]);
    }]);

/**
 * Created by labrina.loving on 9/10/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('PositionService', ['$q','FBURL', '$firebaseObject', 'fbutil', PositionService]);

    function PositionService($q, FBURL, $firebaseObject, fbutil, CandidateService) {
        var self = this;
        var profile;
        function positionModel(){
            this.companyName = '';
            this.title = '';
            this.wage  ={};
            this.employmentTypes = {};
            this.photo = '';
            this.positionId = '';
        }

        this.getOpenPositions = function getOpenPositions(){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('businessSite'),
                ref.child('position'),
                [ref.child('business'), 'business', 'businessSite.parentBusiness']


            );

            // specify the fields for each path
            positions = positions.select({key: 'position.$value', alias: 'position'}, 'businessSite.parentBusiness', 'business.name', 'business.photos');





            var positionsRef = positions.ref();
            // run it and see what we get
            positionsRef.once('value', function(snap) {
                    var positions = snap.val();
                    var availPositions = [];
                    angular.forEach(positions, function(site) {
                        if(site.position) {
                            angular.forEach(site.position, function (positionObj) {
                                var position = new positionModel();

                                position.companyName = site.name;
                                position.title = positionObj.title;
                                position.wage = positionObj.wage;
                                position.employmentTypes = positionObj.employmentTypes;
                                var defaultPhoto = _.matcher({main: "true"});
                                var photo =  _.filter(site.photos, defaultPhoto);
                                if(photo){
                                    position.photo = photo[0].source;
                                }


                                availPositions.push(position);
                            });
                        }

                    });
                    deferred.resolve(availPositions);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }
    }
})();



/**
 * Created by labrina.loving on 8/9/2015.
 */
(function (angular) {
    "use strict";

      var securedRoutes = [];

    angular.module('hirelyApp.core')

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
         .run(['$rootScope', '$state', 'AuthService', 'UserService', 'loginRedirectPath',
            function ($rootScope, $state, AuthService, UserService, loginRedirectPath) {
                // watch for login status changes and redirect if appropriate
                AuthService.AuthRef().$onAuth(check);

                // some of our routes may reject resolve promises with the special {authRequired: true} error
                // this redirects to the login page whenever that is encountered
                $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    if (error === "AUTH_REQUIRED") {
                        $state.go(loginRedirectPath);
                    }
                });

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    if (toState.authRequired && !UserService.getIsLoggedIn()){
                        // User isn�t authenticated
                        $state.transitionTo(loginRedirectPath);
                        event.preventDefault();
                    }
                });



                function check(user) {
                    if (!user && $state.current.authRequired) {
                         $state.go(loginRedirectPath);
                    }
                }

            }
        ]);

})(angular);


/**
 * Created by labrina.loving on 9/7/2015.
 */

angular.module("hirelyApp").run(["$templateCache", function($templateCache) {$templateCache.put("app/account/login.html","<div class=modal-login><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true ng-click=vm.CloseModal()>&times;</button><h4 id=loginModalLabel class=\"modal-title text-center\">Log in to your account</h4></div><div class=modal-body><div><i class=\"fa fa-alert-icon\"></i></div><div class=\"social-login text-center\"><ul class=\"list-unstyled social-login\"><li><button class=\"facebook-btn btn\" type=button ng-click=vm.FbLogin()><i class=\"fa fa-facebook\"></i>Log in with Facebook</button></li><li><button class=\"twitter-btn btn\" type=button><i class=\"fa fa-twitter\"></i>Log in with Twitter</button></li><li><button class=\"google-btn btn\" type=button><i class=\"fa fa-google-plus\"></i>Log in with Google</button></li></ul></div><div class=divider><span>Or</span></div><div class=login-form-container><form class=login-form name=loginForm ng-submit=vm.PasswordLogin()><div class=\"form-group email\"><label class=sr-only for=loginEmail>Your email</label> <input id=loginEmail name=loginEmail type=email class=\"form-control login-email\" placeholder=\"Your email\" required ng-model=user.email><div role=alert><span class=error ng-show=\"loginForm.loginEmail.$error.required && !loginForm.loginEmail.$pristine\">Email is required</span> <span class=error ng-show=loginForm.loginEmail.$error.email>Invalid email format</span></div></div><div class=\"form-group password\"><label class=sr-only for=loginPassword>Password</label> <input id=loginPassword name=loginPassword type=password class=\"form-control login-password\" placeholder=Password required ng-minlength=6 ng-maxlength=12 ng-model=user.password><div role=alert><span class=error ng-show=\"loginForm.loginPassword.$error.required && !loginForm.loginPassword.$pristine\">Password is required</span> <span class=error ng-show=\"loginForm.loginPassword.$error.minlength || loginForm.loginPassword.$error.maxlength\">Password should be between 6 and 12 characters</span></div><p class=forgot-password><a href=# id=resetpass-link data-toggle=modal data-target=#resetpass-modal>Forgot password?</a></p></div><button type=submit class=\"btn btn-block btn-cta-primary\" ng-disabled=!loginForm.$valid>Log in</button><div class=\"checkbox remember\"><label><input type=checkbox> Remember me</label></div></form></div></div><div class=modal-footer><p>New to hirely? <a class=signup-link id=signup-link href=#>Sign up now</a></p></div></div>");
$templateCache.put("app/account/register.html","<div class=modal-signup><div class=modal-header><button type=button class=close data-dismiss=modal aria-hidden=true ng-click=vm.CloseModal()>&times;</button><h4 id=signupModalLabel class=\"modal-title text-center\">Want to Join hirely? Sign up now.</h4><p class=\"intro text-center\">It only takes 3 minutes!</p><p></p></div><div class=modal-body><div class=\"social-login text-center\"><ul class=\"list-unstyled social-login\"><li><button class=\"facebook-btn btn\" type=button ng-click=vm.FbRegister()><i class=\"fa fa-facebook\"></i>Sign up with Facebook</button></li><li><button class=\"twitter-btn btn\" type=button><i class=\"fa fa-twitter\"></i>Sign up with Twitter</button></li><li><button class=\"google-btn btn\" type=button ng-click=vm.GoogleRegister()><i class=\"fa fa-google-plus\"></i>Sign up with Google</button></li></ul></div><div class=divider><span>Or</span></div><div class=login-form-container><form name=loginForm class=login-form ng-submit=vm.registerNewUser()><div class=\"form-group firstName\"><label class=sr-only for=signupfirstName>First Name</label> <input id=signupfirstName name=signupfirstName type=text class=\"form-control login-email\" required placeholder=\"First Name\" ng-model=user.firstName><div role=alert><span class=error ng-show=\"loginForm.signupfirstName.$error.required && !loginForm.signupfirstName.$pristine\">First Name is required</span></div></div><div class=\"form-group lastName\"><label class=sr-only for=signuplastName>last Name</label> <input id=signuplastName name=signuplastName type=text class=\"form-control login-email\" required placeholder=\"Last Name\" ng-model=user.lastName><div role=alert><span class=error ng-show=\"loginForm.signuplastName.$error.required && !loginForm.signuplastName.$pristine\">Last Name is required</span></div></div><div class=\"form-group email\"><label class=sr-only for=signupEmail>Your email</label> <input id=signupEmail name=signupEmail type=email class=\"form-control login-email\" required placeholder=\"Your email\" ng-model=user.email><div role=alert><span class=error ng-show=\"loginForm.signupEmail.$error.required && !loginForm.signupEmail.$pristine\">Email is required</span> <span class=error ng-show=loginForm.signupEmail.$error.email>Invalid email format</span></div></div><div class=\"form-group password\"><label class=sr-only for=signupPassword>Your password</label> <input id=signupPassword name=signupPassword type=password class=\"form-control login-password\" ng-minlength=6 ng-maxlength=12 required placeholder=Password ng-model=user.password><div role=alert><span class=error ng-show=\"loginForm.signupPassword.$error.required && !loginForm.signupPassword.$pristine\">Password is required</span> <span class=error ng-show=\"loginForm.signupPassword.$error.minlength || loginForm.signupPassword.$error.maxlength\">Password should be between 6 and 12 characters</span></div></div><button type=submit class=\"btn btn-block btn-cta-primary\" ng-disabled=!loginForm.$valid>Sign up</button><p class=note>By signing up, you agree to our terms of services and privacy policy.</p></form></div></div><div class=modal-footer><p>Already have an account? <a class=login-link id=login-link href=#>Log in</a></p></div></div>");
$templateCache.put("app/candidate/candidate-dashboard.html","<div ng-controller=CandidateDashboardCtrl><div class=layered-content><div class=row><div class=col-sm-6><div class=\"service-block-v3 service-block-u\"><i class=\"fa fa-user fa-3x\"></i><div class=profile-card-info><h3>{{user.firstName}}</h3><small>Bethesda, MD USA</small></div><div><canvas tc-chartjs-doughnut chart-options=options chart-data=data></canvas></div><div class=\"clearfix profile-stat-info\"><h4><span class=counter>17</span><span>Jobs Applied</span></h4></div></div></div><div class=col-sm-6><div class=\"service-block-v3 service-block-blue\"><i class=\"fa fa-gears\"></i><h5>You are a</h5><h3>Visionary/Analyzer</h3><div class=\"clearfix margin-bottom-10\"></div><div class=\"row margin-bottom-10\"><div class=\"col-xs-6 service-in\"><div class=panel-body><span>Top Skills</span> <small>HTML/CSS</small> <small>92%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 92%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=92 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>.Net</small> <small>85%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 85%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=77 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Javascript</small> <small>77%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 77%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=85 role=progressbar class=\"progress-bar progress-bar-u\"></div></div></div></div><div class=\"col-xs-6 service-in\"><div class=panel-body><span>Top Traits</span> <small>Visionary</small> <small>78%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 78%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=92 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Analyzer</small> <small>72%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 72%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=77 role=progressbar class=\"progress-bar progress-bar-u\"></div></div><small>Mentor</small> <small>72%</small><div class=\"progress progress-u progress-xxs\"><div style=\"width: 72%\" aria-valuemax=100 aria-valuemin=0 aria-valuenow=85 role=progressbar class=\"progress-bar progress-bar-u\"></div></div></div></div></div><div class=\"clearfix profile-stat-trait\"><h4><span class=counter>150</span><span>Companies are looking for you</span></h4></div></div></div></div></div><hr><div class=\"panel space-4\"><div class=panel-header><i class=\"fa fa-files-o\"></i> Recent Applications</div><div class=panel-body><div id=gridRecentApps ui-grid=uiGridOptions class=grid></div></div></div></div>");
$templateCache.put("app/candidate/candidate.html","<div class=\"row profile\"><div class=\"col-md-3 md-margin-bottom-40\"><div class=profile-pic><img class=img-circle src=\"{{currentUser.profileImageUrl && currentUser.profileImageUrl || \'img/avatar.jpg\' }}\" alt={{user.displayName}}></div><ul class=\"list-group sidebar-nav-v1 margin-bottom-40\" id=sidebar-nav-1><li class=list-group-item><a ui-sref-active=active ui-sref=app.candidate.dashboard><i class=\"fa fa-bar-chart-o\"></i> Dashboard</a></li><li class=list-group-item><a ui-sref-active=active ui-sref=app.candidate.profile.basics><i class=\"fa fa-user\"></i> Profile</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_users.html><i class=\"fa fa-files-o\"></i> Applications</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_projects.html><i class=\"fa fa-heart-o\"></i> Favorites</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_comments.html><i class=\"fa fa-gears\"></i> My Personality</a></li><li class=list-group-item><a ui-sref-active=active href=page_profile_history.html><i class=\"fa fa-cog\"></i> Settings</a></li></ul></div><div class=col-md-9><div class=\"candidate-content row\" ui-view></div></div></div>");
$templateCache.put("app/home/home.html","<section id=promo class=\"promo section\"><div class=fixed-container><div class=search ng-controller=HomeCtrl><div class=\"container text-center\"><h1 class=title>Opportunity Awaits</h1><form class=search-form ng-submit=getResults()><div class=form-group><input type=text id=Autocomplete class=form-control ng-autocomplete details=details ng-model=results options=options required placeholder=\"Where\'s your next gig?\"></div><button type=submit class=\"btn btn-cta btn-cta-primary btn-search\"><span class=btn-search-inner></span></button></form></div></div></div><div class=bg-slider-wrapper><div id=bg-slider class=\"flexslider bg-slider\" flexslider><ul class=slides><li class=\"slide slide-1\"></li><li class=\"slide slide-2\"></li><li class=\"slide slide-3\"></li><li class=\"slide slide-4\"></li></ul></div></div></section><section id=why class=\"why section\"><div class=container><h2 class=\"title text-center\">We totally get it</h2><p class=\"intro text-center\">We are disrupting the way local hourly talent and small businesses connect.</p><img class=img-responsive src=img/hirely_protos.png><div class=\"row services\"><div class=\"col-lg-4 col-sm-4 focus-box red wow fadeInLeft animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-list fa-4x\"></i></div><h5 class=red-border-bottom>Informative Listings</h5><p>Detailed job cards show you the information that\'s most important. Hirely ensures jobs are active and informative.</p></div><div class=\"col-lg-4 col-sm-4 focus-box green wow fadeInLeft animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-user fa-4x\"></i></div><h5 class=green-border-bottom>Applicant Cards</h5><p>You\'re more than a resume. Applicant cards let you showcase who you are and easily apply to jobs.</p></div><div class=\"col-lg-4 col-sm-4 focus-box blue wow fadeInRight animated\" data-wow-offset=30 data-wow-duration=1.5s data-wow-delay=0.15s><div class=service-icon><i class=\"fa fa-search fa-4x\"></i></div><h5 class=blue-border-bottom>Intelligent Search</h5><p>Time is of the essence when you are looking for a job. Our technology works hard to find you to the right opportunities.</p></div></div></div></section>");
$templateCache.put("app/job/job-search.html","<style>\r\n    .content{\r\n        background: #fff;\r\n    }\r\n\r\n    .angular-google-map-container {\r\n       height: 1560px;\r\n        overflow: hidden;\r\n    }\r\n    body{\r\n        overflow: hidden;\r\n    }\r\n\r\n\r\n</style><div class=\"job-search row grid-space-10\" ng-controller=JobSearchCtrl><div class=\"col-md-7 col-sm-12 search-results\"><div class=row><div class=\"col-sm-6 col-md-4 job-item\" ng-repeat=\"position in positions\"><div class=\"image-box style-2 margin-bottom-20 shadow bordered light-gray-bg text-center\"><div class=job-image><img src={{position.photo}} class=img-responsive alt> <a class=panel-overlay-job-image><div><sup>$</sup> <span class=wage>{{position.wage.amount}}/{{position.wage.frequency}}</span></div></a></div><div class=body><div class=job-info><div class=company-info><h4>{{position.title}}</h4><h6>FT/PT</h6></div><div class=company-info><h5>{{position.companyName}}</h5><h6>0.3 miles</h6></div></div><div class=separator></div><div class=\"row job-action\"><div class=\"col-xs-4 col-md-4\"><a><i class=\"fa fa-heart-o fa-lg\"></i></a></div><div class=\"col-xs-4 col-md-4\"><a><i class=\"fa fa-share-square-o fa-lg\"></i></a></div><div class=\"col-xs-4 col-md-4\"><a><i class=\"fa fa-close fa-lg\"></i></a></div></div><div></div></div></div></div></div></div><div class=\"col-md-5 col-sm-12 search-results-map\"><div class=angular-google-map-container><ui-gmap-google-map center=map.center zoom=map.zoom draggable=true options=map.options events=map.events control=googlemap><ui-gmap-window coords=MapOptions.markers.selected.coords show=windowOptions.show options=windowOptions closeclick=closeClick()></ui-gmap-window><ui-gmap-markers models=markers idkey=markers.id coords=\"\'coords\'\" click=\"\'onClick\'\" events=markers.events options=marker.options></ui-gmap-markers></ui-gmap-google-map></div></div></div>");
$templateCache.put("app/job/jobs.html","<html ng-app=hirelyMap><head><meta charset=utf-8><title></title><meta name=viewport content=\"initial-scale=1.0, user-scalable=no\"><link rel=stylesheet href=css/styles.css><link href=\"//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,800,600,300,700\" rel=stylesheet type=text/css><link rel=stylesheet href=css/style.css type=text/css><link rel=stylesheet href=http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css><link rel=stylesheet href=css/jobresults.css><link rel=stylesheet href=css/page_job_inner1.css></head><style>\n\n</style><body><div class=container-fluid><div class=row><div class=col-sm-5 id=comments_block><h2>Let Hirely help you find the Job you Need ...</h2>{{details.formatted_address}} {{details.geometry.location.lat}} {{details.geometry.location.lng}}<hr><form class=form-horizontal><div class=form-group><div class=\"col-sm-4 md-margin-bottom-10\"><div class=input-group ng-controller=JobSearchCtrl><span class=input-group-addon><i class=\"fa fa-tag\"></i></span> <input type=text id=search ng-model=selected typeahead=\"job as job.Title for job in jobs | filter:{Lay_Title:$viewValue} | limitTo:15\" class=form-control ng-init placeholder=\"Find your next gig\"></div></div><div class=\"col-sm-4 md-margin-bottom-10\"><div class=input-group><span class=input-group-addon><i class=\"fa fa-map-marker\"></i></span> <input type=text id=Autocomplete class=form-control ng-autocomplete=results details=details ng-model=results options=options on-place-changed=getResults() required placeholder=\"Search Jobs in other Cities!!\"></div></div><div class=\"col-sm-4 md-margin-bottom-10\"><div class=input-group><span class=input-group-addon><i class=\"fa fa-search\"></i></span> <input class=form-control id=searchText ng-model=searchText googleplace placeholder=\"What Type of Job are you seeking??...\"></div></div></div><hr><div class=col-xs-6><div class=\"container text-left\" ng-app=hirelyApp ng-controller=JobCtrl><div ng-repeat=\"job in split_jobs\" class=row><div class=\"col-sm-5 md-margin-bottom-10\" ng-repeat=\"job in jobOpenings | orderBy:\'orderBy\'| filter:selected | filter:results | filter:searchText\"><div class=\"nf-item branding coffee spacing\"><div class=item-box><a ng-click=setJobResults(job.UID) href=#><img class=item-container src={{job.Image}} alt width=450 height=350></a><div class=absolute1><blockquote style=\"border: opx solid #666; padding: 0px; background-color: #303030;\"><h3><a ng-click=setJobResults(job.UID) href=#><font color=white>{{job.Job_Title}}</font></a></h3><h4><a ng-click=setJobResults(job.UID) href=#><font color=white>@ {{job.Company}}</font></a></h4></blockquote></div><div class=absolute2><p class=white><i class=\"fa fa-dollar-sign\"><font color=white>{{job.Wage}}</font></i></p><font color=red><i class=\"fa fa-clock-o\"></i></font><font color=white>{{job.Shifts}}</font></div></div></div><div class=item-mask><div class=item-caption><hr><span style=padding-left:0px></span></div></div></div></div></div></div></form></div><div class=\"col-sm-6 map\"><div class=google-map-canvas id=map-canvas ng-controller=MainCtrl><ui-gmap-google-map center=map.center zoom=map.zoom draggable=true options=map.options events=map.events control=googlemap><ui-gmap-window coords=MapOptions.markers.selected.coords show=windowOptions.show options=windowOptions closeclick=closeClick()></ui-gmap-window><ui-gmap-markers models=markers idkey=markers.id coords=\"\'coords\'\" click=\"\'onClick\'\" events=markers.events options=marker.options></ui-gmap-markers></ui-gmap-google-map></div></div></div></div></body><script async defer src=\"https://maps.googleapis.com/maps/api/js?signed_in=true&callback=initMap\"></script><script src=js/jquery-migrate.min.js></script><script src=js/back-to-top.js></script><script src=js/smoothScroll.js></script><script src=js/jquery.masonry.min.js></script><script src=js/custom.js></script><script src=js/ng-map.min.js></script><script src=js/blog-masonry.js></script><script type=text/javascript src=\"https://maps.googleapis.com/maps/api/js?libraries=weather,geometry,visualization,places\">\n</script><script src=js/bapp.js></script><script type=text/javascript>\n    jQuery(document).ready(function() {\n        App.init();\n    });\n</script><script src=https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js></script><script src=https://cdn.firebase.com/js/client/2.2.4/firebase.js></script><script src=https://cdn.firebase.com/libs/angularfire/1.1.1/angularfire.min.js></script><script src=https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-animate.js></script><script src=https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.js></script><script src=https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.js></script><script src=https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js.bootstrap.js></script><script src=https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.2.1/js/material.js></script><script src=https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.2.1/js/ripples.js></script></html>");
$templateCache.put("app/jobdetails/jobDetails.html","<head><meta charset=UTF-8><title></title><title>Jobs Description 1 | Unify - Responsive Website Template</title><meta charset=utf-8><meta name=viewport content=\"width=device-width, initial-scale=1.0\"><meta name=description content><meta name=author content><link rel=\"shortcut icon\" href=favicon.ico><link rel=stylesheet type=text/css href=\"//fonts.googleapis.com/css?family=Open+Sans:400,300,600&amp;subset=cyrillic,latin\"><link rel=stylesheet href=css/animate.css><link rel=stylesheet href=css/line-icons.css><link href=\"//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,800,600,300,700\" rel=stylesheet type=text/css><link rel=stylesheet href=//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css><link rel=stylesheet href=css/page_job_inner1.css><link href=css/blog_masonry_3col.css rel=stylesheet><link href=css/styles.css rel=stylesheet><link href=css/style.css rel=stylesheet type=text/css><link rel=stylesheet href=http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css><link rel=stylesheet href=css/jobdetails.css></head><style>\n#content {\n    background-color: #F8F8F8;\n    width: 655px;\n    height: 155px;\n    padding: 25px 30px 25px 30px;\n    position: absolute;\n    bottom: 60px;\n    top: 150px;\n    left: 0px;\n}\n\n}\n</style><div ng-app=hirelyApp ng-controller=JobDetailCtrl><div ng-repeat=\"job in jobDetails | orderBy:\'orderBy\'| filter:jobUID | limitTo:1\"><body><div class=wrapper><div class=\"container content\"><div class=job-description><div class=item-box><img class=displayed src={{job.Image}} alt width=1140 height=500><div class=absolute2><box><blockquote style=\"border: opx solid #666; padding: 0px; background-color: #303030;\"><p class=white></p><h3><i class=\"fa fa-dollar-sign\"><font color=white>{{job.Wage}}</font></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color=red><i class=\"fa fa-clock-o\"></i></font><font color=white>{{job.Shifts}}</font></h3></blockquote></box></div></div><div class=\"container content\"><div class=row><div class=col-md-7><div class=left-inner><div class=title-box-v2><ul class=list-inline><li><h2>{{job.Job_Title}}</h2></li><li><font color=red><h4><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Now Hiring&nbsp;!!</label></h4></font></li></ul></div><div class=overflow-h><ul class=list-inline><li><h4>{{job.Company}}</h4></li><li><div class=stars><form action><input class=\"star star-5\" id=star-5 type=radio name=star> <label class=\"star star-5\" for=star-5></label> <input class=\"star star-4\" id=star-4 type=radio name=star> <label class=\"star star-4\" for=star-4></label> <input class=\"star star-3\" id=star-3 type=radio name=star> <label class=\"star star-3\" for=star-3></label> <input class=\"star star-2\" id=star-2 type=radio name=star> <label class=\"star star-2\" for=star-2></label> <input class=\"star star-1\" id=star-1 type=radio name=star> <label class=\"star star-1\" for=star-1></label></form></div></li></ul></div><div class=overflow-h><p class=hex>{{job.Location}}</p><div></div><div></div></div><hr><div id=content><h4>About the Position</h4><p>This job was a great job for the pay and benefits when compared to waiting table and working fast food. I also preferred working for the vs other stores like . The biggest problem was unreasonable expectations from management. Even as one of there top employees you feel taken advantage of and over worked. Dealing with the customers was the other issue.</p><hr><div class=overflow-h><h5>Total Compensation</h5><div><ul class=list-inline><li><p class=blocktext>Wage:&nbsp;&nbsp;Hourly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Commission:&nbsp;&nbsp;No</p></li><li><p class=blocktext>Tips:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Yes</p></li></ul></div></div><hr><div class=overflow-h><h5>Perks and Benefits</h5><div><ul class=list-unstyled><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li></ul></div></div><hr><div class=overflow-h><h5>Typical Task</h5><div><p>A Wal-Mart cashier is responsible for effectively executing and adhering to the “Basic Beliefs” of the founder, Sam Walton.</p><ul class=list-unstyled><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Nullam laoreet est sit amet felis tristique laoreet</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> The biggest problem was unreasonable expectations</p></li><li><p class=blocktext><i class=\"fa fa-check color-green\"></i> Dealing with the customers was the other issue</p></li></ul></div></div><hr><div class=overflow-h><h5>Availablity</h5><div></div></div></div></div></div><div class=col-md-4><div class=right-inner><div class=container><div class=\"people-say margin-bottom-20\"><div class=overflow-h><ul class=\"list-unstyled save-job\"><li><h1><i class=\"fa fa-clock-o\"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class=\"fa fa-heartbeat\"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class=\"fa fa-map-marker\"></i></h1></li><li><h5>Hrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Benefits&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;miles</h5></li></ul><ul class=\"list-unstyled save-job\"><li><button type=button style=width:290px;height:40px;background-color:red><a href=#><font color=white>Apply Now</font></a></button></li></ul></div></div></div><hr><div class=\"people-say margin-bottom-20\"><ul class=\"list-unstyled save-job\"><li><h1><i class=\"fa fa-clock-o\"></i></h1><a>Responds Rate: 90%</a></li><li><a>Response Time: 24 Hours</a></li></ul></div><hr><div class=\"people-say margin-bottom-20\"><h5>About the Hiring Manager</h5><img class=displayed src={{job.HM_Photo}} alt width=300 height=200><div class=overflow-h></div></div><hr><div class=\"people-say margin-bottom-20\"><h5>Latest Employee Recommendations</h5><img src=assets/img/testimonials/img2.jpg alt><div class=overflow-h><span>{{job.Employee1}}</span> <small class=\"hex pull-right\">5 - hours ago</small><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius hendrerit nisl id condimentum.</p></div></div><div class=\"people-say margin-bottom-20\"><img src=assets/img/testimonials/user.jpg alt><div class=overflow-h><span>{{job.Employee2}}</span> <small class=\"hex pull-right\">2 - days ago</small><p>Vestibulum justo est, pharetra fermentum justo in, tincidunt mollis turpis. Duis imperdiet non justo euismod semper.</p></div></div><div class=people-say><img src=assets/img/testimonials/img3.jpg alt><div class=overflow-h><span>{{job.Employee3}}</span> <small class=\"hex pull-right\">3 - days ago</small><p>A Wal-Mart cashier is responsible for effectively executing and adhering to the “Basic Beliefs” of the founder.</p></div></div><hr></div></div></div></div></div></div></div></body></div></div><script src=js/jquery.min.js></script><script src=js/jquery-migrate.min.js></script><script src=js/bootstrap.min.js></script><script src=js/back-to-top.js></script><script src=js/smoothScroll.js></script><script src=js/circles.js></script><script src=js/custom.js></script><script src=js/ng-map.min.js></script><script src=js/bapp.js></script><script src=js/circles-master.js></script><script src=js/style-switcher-rtl.js></script><script type=text/javascript>\n    jQuery(document).ready(function() {\n        App.init();\n        CirclesMaster.initCirclesMaster1();\n    });\n</script>");
$templateCache.put("app/layout/footer.html","<footer class=footer><div class=bottom-bar><div class=container><div class=row><small class=\"copyright col-md-6 col-sm-6 col-xs-12\">Copyright @ 2015 All Rights Reserved | Privacy Policy</small><ul class=\"social col-md-6 col-sm-6 col-xs-12 list-inline\"><li><a href=https://twitter.com/hellohirely><i class=\"fa fa-twitter\"></i></a></li><li><a href=https://www.facebook.com/pages/Hirely><i class=\"fa fa-facebook\"></i></a></li><li><a href><i class=\"fa fa-envelope\"></i></a></li></ul></div></div></div></footer>");
$templateCache.put("app/layout/header.html","<header id=header class=header><div class=container ng-controller=\"HeaderCtrl as vm\"><h1 class=\"logo pull-left\"><a ui-sref=appFS.home><span class=logo-title>hirely</span></a></h1><nav id=main-nav class=\"main-nav navbar-right\" role=navigation><div class=navbar-header><button class=navbar-toggle type=button data-toggle=collapse data-target=#navbar-collapse><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span></button></div><div class=\"navbar-collapse collapse\" id=navbar-collapse><ul class=\"nav navbar-nav\"><li class=nav-item><a href=#>Start Hiring</a></li><li class=\"dropdown dropdown-user\" ng-show=currentUser><a href=javascript:; class=dropdown-toggle data-toggle=dropdown data-hover=dropdown data-close-others=true><div class=sign-in-divider></div><img alt class=img-circle src=\"{{currentUser.profileImageUrl && currentUser.profileImageUrl || \'img/avatar.jpg\' }}\"> <span class=\"username username-hide-on-mobile\">Hi <span ng-bind=currentUser.firstName></span></span>! <i class=\"fa fa-angle-down\"></i></a><ul class=\"dropdown-menu dropdown-menu-default\"><li><a ui-sref=app.candidate.dashboard><i class=\"fa fa-user\"></i> My Profile</a></li><li><a href=#><i class=\"fa fa-files-o\"></i> Applications</a></li><li><a href=#><i class=\"fa fa-heart\"></i> Favorites</a></li><li><a href ng-click=vm.logout()><i class=\"fa fa-lock\"></i> Log Out</a></li></ul></li><li class=nav-item ng-show=!currentUser><a ng-click=vm.login()><div class=sign-in-divider></div>Log in</a></li><li class=\"nav-item nav-item-cta last\" ng-show=!currentUser><button type=button class=\"btn btn-blue btn-cta-blue\" ng-click=vm.register()>Get Started</button></li></ul></div></nav></div></header>");
$templateCache.put("app/layout/master-fullscreen.html","<div class=wrapper ng-controller=\"MasterCtrl as vm\"><div header></div><div ui-view></div></div><div footer></div>");
$templateCache.put("app/layout/master.html","<div class=wrapper ng-controller=\"MasterCtrl as vm\"><div header></div><div class=content><div class=\"container content\"><div class=row><div class=col-md-12 ui-view></div></div></div></div></div><div footer></div>");
$templateCache.put("app/layout/menu-layout.html","<ion-side-menus><ion-side-menu-content><ion-nav-bar class=\"bar-stable nav-title-slide-ios7\"><ion-nav-title class=energized><img src=img/hirely_logo.png style=\"vertical-align: middle;height:35px;margin-top:5px;margin-bottom:10px;border-radius:5px;display:inline-block;\"> <span>hirely</span></ion-nav-title><ion-nav-back-button class=button-clear><i class=\"icon ion-ios7-arrow-back\"></i> Back</ion-nav-back-button><ion-nav-buttons side=left><button menu-toggle=left class=\"button button-icon icon ion-navicon\"></button></ion-nav-buttons></ion-nav-bar><ion-nav-view name=mainContent animation=slide-left-right></ion-nav-view></ion-side-menu-content><ion-side-menu side=left expose-aside-when=large><header class=\"bar bar-header bar-stable\" ui-sref=app.login><h1 class=title>Log In</h1></header><ion-content class=has-header><ion-list><ion-item nav-clear menu-close ui-sref=app.register>Join Hirely</ion-item><ion-item nav-clear menu-close>Find a Job</ion-item><ion-item nav-clear menu-close>Start Hiring</ion-item><ion-item nav-clear menu-close>How It Works</ion-item></ion-list></ion-content></ion-side-menu></ion-side-menus>");
$templateCache.put("app/candidate/profile/candidate-profile-availability.html","<div class=\"layered-content schedule col-md-12 col-xs-12\"><div class=row><div class=\"col-md-3 col-md-offset-3 col-xs-offset-3 col-xs-3\">Morning</div><div class=\"col-md-3 col-xs-3\">Afternoon</div><div class=\"col-md-3 col-xs-3\">Evening</div></div><div class=row><div class=\"col-md-3 col-xs-3\">Monday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=monAM type=checkbox ng-model=schedule.monday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=monAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=monAF type=checkbox ng-model=schedule.monday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=monAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=monPM type=checkbox ng-model=schedule.monday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=monPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Tuesday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=tuesAM type=checkbox ng-model=schedule.tuesday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=tuesAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=tuesAF type=checkbox ng-model=schedule.tuesday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=tuesAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=tuesPM type=checkbox ng-model=schedule.tuesday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=tuesPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Wednesday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=wedAM type=checkbox ng-model=schedule.wednesday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=wedAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=wedAF type=checkbox ng-model=schedule.wednesday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=wedAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=wedPM type=checkbox ng-model=schedule.wednesday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=wedPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Thursday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=thurAM type=checkbox ng-model=schedule.thursday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=thurAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=thurAF type=checkbox ng-model=schedule.thursday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=thurAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=thurPM type=checkbox ng-model=schedule.thursday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=thurPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Friday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=friAM type=checkbox ng-model=schedule.friday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=friAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=friAF type=checkbox ng-model=schedule.friday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=friAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=friPM type=checkbox ng-model=schedule.friday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=friPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Saturday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=satAM type=checkbox ng-model=schedule.saturday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=satAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=satAF type=checkbox ng-model=schedule.saturday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=satAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=satPM type=checkbox ng-model=schedule.saturday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=satPM></label></div></div><div class=row><div class=\"col-md-3 col-xs-3\">Sunday</div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=sunAM type=checkbox ng-model=schedule.sunday.morning> <label class=\"tgl-btn tgl-btn-morning\" for=sunAM></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=sunAF type=checkbox ng-model=schedule.sunday.afternoon> <label class=\"tgl-btn tgl-btn-afternoon\" for=sunAF></label></div><div class=\"col-md-3 col-xs-3\"><input class=\"tgl tgl-flip\" id=sunPM type=checkbox ng-model=schedule.sunday.evening> <label class=\"tgl-btn tgl-btn-evening\" for=sunPM></label></div></div><div class=\"col-xs-6 col-xs-offset-3 margin-top-40\"><button type=submit class=\"btn btn-block btn-blue btn-cta-blue\" ng-click=saveSchedule()><i class=\"fa fa-circle-arrow-right\"></i>Complete</button></div></div>");
$templateCache.put("app/candidate/profile/candidate-profile-basics.html","<div class=layered-content><form class=form-layout name=candidateForm id=user-profile-form ng-submit=submitProfile()><div class=form-group><figure class=profile-pic><img class=img-circle src=\"{{currentUser.profileImageUrl && currentUser.profileImageUrl || \'img/avatar.jpg\' }}\"> <button type=button class=\"btn btn-blue btn-cta-blue\" ng-click=pickFile()>Change Picture</button></figure></div><div class=form-group><label for=firstName>First Name</label> <input type=text class=form-control name=firstName ng-model=user.firstName required></div><div class=form-group><label for=name>Last Name</label> <input type=text class=form-control name=lasttName ng-model=user.lastName required></div><div class=form-group><label for=email>Email</label> <input type=email class=form-control name=email ng-model=user.email required></div><div class=form-group><label for=phone>Phone</label> <input type=text id=phone class=form-control name=phone mask=\"(999) 999-9999\" clean=true ng-model=user.phone></div><div class=form-group><label for=location>Location</label> <input type=text id=location class=form-control ng-autocomplete details=details ng-model=user.location options=options required></div><div class=form-group><label for=phone>Bio (max 150 characters)</label> <textarea class=form-control name=personalStatement ng-model=user.personalStatement ng-minlength=0 ng-maxlength=150></textarea></div><div class=\"form-group checkbox\"><label><input type=checkbox ng-model=candidate.authorizedInUS> Authorized to work In US?</label></div><div class=\"form-group row\"><div class=\"col-xs-6 col-xs-offset-3\"><button type=submit class=\"btn btn-block btn-blue btn-cta-blue\" ng-disabled=!candidateForm.$valid><i class=\"fa fa-circle-arrow-right\"></i>Next</button></div></div></form></div>");
$templateCache.put("app/candidate/profile/candidate-profile-education.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/profile/candidate-profile-experience.html","<div class=user-experience><div class=\"panel layered-content\"><div class=panel-heading><i class=\"fa fa-briefcase\"></i> Experience</div><div class=panel-body><ul class=\"timeline-v2 timeline-me\"><li><time datetime class=cbp_tmtime><span>Mobile Design</span> <span>2012 - Current</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>BFC NYC Partners</h2><h3>Washington, DC</h3></div></li><li><time datetime class=cbp_tmtime><span>Web Designer</span> <span>2007 - 2012</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>Freelance</h2><h3>Bethesda, MD</h3></div></li><li><time datetime class=cbp_tmtime><span>Photodesigner</span> <span>2003 - 2007</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>Toren Condo</h2><h3>Rockville, MD</h3></div></li></ul></div></div><div class=\"panel layered-content\"><div class=\"panel-heading overflow-h\"><h2 class=\"panel-title heading-sm pull-left\"><i class=\"fa fa-graduation-cap\"></i> Education</h2></div><div class=panel-body><ul class=\"timeline-v2 timeline-me\"><li><time datetime class=cbp_tmtime><span>Mobile Design</span> <span>2012 - Current</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>BFC NYC Partners</h2><h3>Washington, DC</h3><i class=\"icon-custom icon-sm icon-bg-blue fa fa-bullhorn\"></i></div></li><li><time datetime class=cbp_tmtime><span>Web Designer</span> <span>2007 - 2012</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>Freelance</h2><h3>Bethesda, MD</h3></div></li><li><time datetime class=cbp_tmtime><span>Photodesigner</span> <span>2003 - 2007</span></time><i class=\"cbp_tmicon rounded-x hidden-xs\"></i><div class=cbp_tmlabel><h2>Toren Condo</h2><h3>Rockville, MD</h3></div></li></ul></div></div></div>");
$templateCache.put("app/candidate/profile/candidate-profile-personality.html","<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><title></title></head><body></body></html>");
$templateCache.put("app/candidate/profile/candidate-profile.html","<div class=\"layered-content profile-nav container-fluid\"><div class=\"status-buttons text-center row\"><div class=\"col-xs-3 col-sm-3 col-md-3\"><a ui-sref-active=active ui-sref=.basics><span class=nav-number>1</span>Basics</a></div><div class=\"col-xs-3 col-sm-3 col-md-3\"><a ui-sref-active=active ui-sref=.experience><span class=nav-number>2</span> Experience</a></div><div class=\"col-xs-3 col-sm-3 col-md-3\"><a ui-sref-active=active ui-sref=.personality><span class=nav-number>3</span>Personality</a></div><div class=\"col-xs-3 col-sm-3 col-md-3\"><a ui-sref-active=active ui-sref=.availability><span class=nav-number>4</span> Availability</a></div></div></div><div ui-view></div>");}]);
/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','FBURL', '$firebaseObject', 'fbutil', UserService]);

    function UserService($rootScope, $q, FBURL, $firebaseObject, fbutil, UserService) {
        var self = this;
        var ref = new Firebase(FBURL + "/users");
        var currentUser;
        var currentUserId;
        var isLoggedIn = false;

        function userModel(){
            this.firstName = '';
            this.lastName = '';
            this.fullName = '';
            this.email = '';
            this.profileImageUrl = '';
            this.personalStatement = '';
            this.location = '';
            this.provider =  '';
            this.providerId = '';
            this.createdOn = '';
            this.lastModifiedOn = '';
           }


        this.getCurrentUser = function getCurrentUser() {
           return currentUser;
        };

        this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        };

        this.setCurrentUser = function setCurrentUser(user, userId){
            currentUser = user;
            currentUserId = userId;
        };

        this.setIsLoggedIn = function setIsLoggedIn(aisLoggedIn){
            isLoggedIn = aisLoggedIn;

        };

        this.getUserByKey = function getUserByKey(key){
            var userRef =  new Firebase(FBURL + "/users" + '/' + key);
            var deferred = $q.defer();
            userRef.once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        }


        this.getUserByEmail = function getUserByEmail(email) {

            var deferred = $q.defer();
            ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        };

        this.createUserinFirebase = function createUserInFireBase(user, key) {

            var ref = fbutil.ref('users', key);
            ref.set(user)
        }

        this.saveUser = function saveUser(user){
            var ref = new Firebase(FBURL + "/users/" + currentUserId);
            ref.update(user);
            currentUser = user;
        }

        this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
            var deferred = $q.defer();
            var user;

            //get proper user for provider
            switch(provider) {
                case 'facebook':
                    user = createFacebookUser(authData);
                    break;
                case 'twitter':

                    break;
                case 'google':
            }

            //check if user previously exists
            var userExists = false;
            this.getUserByKey(authData.uid)
                .then(function(snapshot) {
                    var exists = (snapshot.val() != null);
                    if(!exists)
                    {
                        self.createUserinFirebase(user, authData.uid)

                    }
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };



        this.createRegisteredNewUser = function createRegisteredNewUser(userData, providerId) {

            var deferred = $q.defer();
            var user;

            var timestamp = Firebase.ServerValue.TIMESTAMP;
            user = new userModel();
            user.fullName = userData.firstName + ' ' + userData.lastName;
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.email = userData.email;
            user.provider = 'password';
            user.providerId = providerId;
            user.createdOn = timestamp;
            user.lastModifiedOn = timestamp;

            self.createUserinFirebase(user, providerId)


            deferred.resolve(user);
            return deferred.promise;

        };



        function createFacebookUser(fbAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var fbUser = new userModel();
            fbUser.fullName = fbAuthData.facebook.displayName;
            fbUser.profileImageUrl =  "http://graph.facebook.com/" + fbAuthData.facebook.id  + "/picture?width=300&height=300";
            fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        }
    }
})();

(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
        var geocodeService = GeocodeService;

        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';

        var place = geocodeService.getPlace();
        if(place){

            $scope.results = place.formatted_address;
            $scope.details = place;
        }

        $scope.getResults = function() {
            geocodeService.setPlace($scope.details);
            $state.go('appFS.job')

        }

    }
})();

/**
 * Created by mike.baker on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$http', 'GeocodeService', 'JobdetailsService', JobCtrl ]);

      function JobCtrl($scope, $state, $stateParams, $firebaseArray, $http, GeocodeService, JobdetailsService) {
           
        var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);

        var geocodeService = GeocodeService;
        var jobdetailsService = JobdetailsService;
   

        $scope.jobOpenings = $firebaseArray(fireRef);
		$scope.split_jobs = [['job1', 'job2']];

        $scope.details = geocodeService.getPlace();
        $scope.jobdetails = $scope.jobOpenings;
      

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

      
 }


})();

myApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

myApp.controller('MainCtrl', function($scope, $firebaseArray, $http, GeocodeService, uiGmapGoogleMapApi, uiGmapIsReady) {
    var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
    var fireRef = new Firebase(url);

    $scope.mapmarkers = $firebaseArray(fireRef);
    $scope.details = GeocodeService.getPlace();
    uiGmapGoogleMapApi
        .then(function(maps){
            $scope.googlemap = {};
            $scope.map = {
                center: {
                    latitude: $scope.details.geometry.location.lat,
                    longitude: $scope.details.geometry.location.long
                },
                zoom: 14,
                pan: 1,
                options: $scope.mapOptions,
                control: {},
                events: {
                    tilesloaded: function (maps, eventName, args) {
                    },
                    dragend: function (maps, eventName, args) {
                    },
                    zoom_changed: function (maps, eventName, args) {
                    }
                }
            };
        });

    $scope.windowOptions = {
        show: false
    };

    $scope.onClick = function(data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
        console.log('This is a ' + data);
        alert('This is a ' + data);
    };

    $scope.closeClick = function() {
        $scope.windowOptions.show = false;
    };

    $scope.title = "Window Title!";

    uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
        .then(function(instances) {
            console.log(instances[0].map);                        // get the current map
        })
        .then(function(){
            $scope.addMarkerClickFunction($scope.markers);
        });

    $scope.markers = [
        {
            id: 0,
            coords: {
                latitude: 38.9071923,
                longitude: -77.03687070000001,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'restaurant'
        },
        {
            id: 1,
            coords: {
                latitude: 38.8799697,
                longitude: -77.1067698,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'house'
        },
        {
            id: 2,
            coords: {
                latitude: 38.704282,
                longitude: -77.2277603,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'hotel'
        }


    ];

    $scope.addMarkerClickFunction = function(markersArray){
        angular.forEach(markersArray, function(value, key) {
            value.onClick = function(){
                $scope.onClick(value.data);
            };
        });
    };


    $scope.MapOptions = {
        minZoom : 3,
        zoomControl : false,
        draggable : true,
        navigationControl : false,
        mapTypeControl : false,
        scaleControl : false,
        streetViewControl : false,
        disableDoubleClickZoom : false,
        keyboardShortcuts : true,
        styles : [{
            featureType : "poi",
            elementType : "labels",
            stylers : [{
                visibility : "off"
            }]
        }, {
            featureType : "transit",
            elementType : "all",
            stylers : [{
                visibility : "off"
            }]
        }],
    };
});

/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'PositionService', 'GeocodeService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);


  function JobSearchCtrl($scope, $http, $state, $stateParams, PositionService, GeocodeService, uiGmapGoogleMapApi, uiGmapIsReady) {
      var positionService = PositionService
      $scope.positions = "";
      $scope.mapmarkers = "";
      $scope.details = GeocodeService.getPlace();

      positionService.getOpenPositions().then(function(positions) {
          $scope.positions = positions;

      }, function(err) {

      });

      uiGmapGoogleMapApi
          .then(function(maps){
              $scope.googlemap = {};
              $scope.map = {
                  center: {
                      latitude: $scope.details.geometry.location.lat,
                      longitude: $scope.details.geometry.location.lng
                  },
                  zoom: 14,
                  pan: 1,
                  options: $scope.mapOptions,
                  control: {},
                  events: {
                      tilesloaded: function (maps, eventName, args) {
                      },
                      dragend: function (maps, eventName, args) {
                      },
                      zoom_changed: function (maps, eventName, args) {
                      }
                  }
              };
          });

      $scope.windowOptions = {
          show: false
      };

      $scope.onClick = function(data) {
          $scope.windowOptions.show = !$scope.windowOptions.show;
          console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
          console.log('This is a ' + data);
          alert('This is a ' + data);
      };

      $scope.closeClick = function() {
          $scope.windowOptions.show = false;
      };

      $scope.title = "Window Title!";

      uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
          .then(function(instances) {
              console.log(instances[0].map);                        // get the current map
          })
          .then(function(){
              $scope.addMarkerClickFunction($scope.markers);
          });

      $scope.markers = [
          {
              id: 0,
              coords: {
                  latitude: 38.9071923,
                  longitude: -77.03687070000001,
                  draggable: false,
                  animation: 1 // 1: BOUNCE, 2: DROP
              },
              data: 'restaurant'
          },
          {
              id: 1,
              coords: {
                  latitude: 38.8799697,
                  longitude: -77.1067698,
                  draggable: false,
                  animation: 1 // 1: BOUNCE, 2: DROP
              },
              data: 'house'
          },
          {
              id: 2,
              coords: {
                  latitude: 38.704282,
                  longitude: -77.2277603,
                  draggable: false,
                  animation: 1 // 1: BOUNCE, 2: DROP
              },
              data: 'hotel'
          }


      ];

      $scope.addMarkerClickFunction = function(markersArray){
          angular.forEach(markersArray, function(value, key) {
              value.onClick = function(){
                  $scope.onClick(value.data);
              };
          });
      };


      $scope.MapOptions = {
          minZoom : 3,
          zoomControl : false,
          draggable : true,
          navigationControl : false,
          mapTypeControl : false,
          scaleControl : false,
          streetViewControl : false,
          disableDoubleClickZoom : false,
          keyboardShortcuts : true,
          styles : [{
              featureType : "poi",
              elementType : "labels",
              stylers : [{
                  visibility : "off"
              }]
          }, {
              featureType : "transit",
              elementType : "all",
              stylers : [{
                  visibility : "off"
              }]
          }],
      };
}

 })();

/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', 'JobdetailsService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, $firebaseArray, JobdetailsService) {

    	var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);
        var jobdetailsService = JobdetailsService;

        $scope.jobDetails = $firebaseArray(fireRef);
        $scope.jobUID = jobdetailsService.getJob();

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

        }


})();

 
/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('FooterCtrl', ['$stateParams', FooterCtrl ]);

    function FooterCtrl($stateParams) {


    };
})();
/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/footer.html',
        scope: true,
        transclude : false
    };
});
/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$modal', '$log', 'AuthService', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $modal, $log, AuthService) {

        //region Scope variables
        $scope.currentUser = $scope.$parent.currentUser;
        //endregion

        var vm = this;
        var authService = AuthService;

        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.currentUser = args.message;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm',
                resolve: {
                    items: function () {

                    }
                }
            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.logout = function(){
            authService.logout();
        };

        //endregion

    };
})();
/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("header", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/header.html',
        controller: 'HeaderCtrl',
        scope: true,
        transclude : false
    };
});
/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, $window, AuthService, UserService, GeocodeService) {

        var vm = this;
        var geocodeService = GeocodeService;

        $scope.authRef = AuthService.AuthRef();
        $scope.userService = UserService;
        $scope.currentUser = null;
        $scope.location = {};
        $scope.currentPlace = null;


        //
        $window.navigator.geolocation.getCurrentPosition(function(position){

            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            $scope.$apply(function() {
                    $scope.location.latitude = lat;
                    $scope.location.longitude = long;
                    if(lat && long)
                    {
                        geocodeService.getPlacebyLatLong(lat, long)
                            .then(function(place) {
                                if(place){
                                    $scope.currentPlace = place;
                                    $scope.$broadcast('currentPlaceChanged', { message: place });
                                }
                            }, function(err) {
                                deferred.reject(err);
                            });
                    }

                }
            )
        });

        // any time auth status updates, add the user data to scope
        $scope.authRef.$onAuth(function(authData) {
            if(authData)
            {
                if(!$scope.currentUser) {
                    //try to retrieve user
                    $scope.userService.getUserByKey(authData.uid)
                        .then(function (snapshot) {
                            var exists = (snapshot.val() != null);
                            if (exists) {
                                $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
                                $scope.userService.setIsLoggedIn(true);
                            }

                        }, function (err) {

                        });
                }
            }
            else
            {
                $scope.userService.setIsLoggedIn(false);
                $scope.userService.setCurrentUser(null)
            }
        });

        //watch for user auth changes, if changed broadcast to pages
        $scope.$watch('userService.getCurrentUser()', function (newVal) {
            $scope.$broadcast('currentUserChanged', { message: newVal });
            $scope.currentUser = newVal;

        },true);

    };
})();
    /**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.shared").directive('flexslider', function () {

    return {
        link: function (scope, element, attrs) {

            $('#bg-slider').flexslider({
                animation: "fade",
                directionNav: false, //remove the default direction-nav - https://github.com/woothemes/FlexSlider/wiki/FlexSlider-Properties
                controlNav: false, //remove the default control-nav
                slideshowSpeed: 10000
            });
        }
    }
});

'use strict';


angular.module('hirelyApp.core').directive('ngAutocomplete', ['GeocodeService', 'UserService', '$parse', function(GeocodeService, UserService, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            options: '=?',
            details: '=?',
            onPlaceChanged: '&'
        },

        link: function(scope, element, attrs, controller) {

            //options for autocomplete
            var opts
            var watchEnter = false
            //convert options provided to opts
            var initOpts = function() {

                opts = {}
                if (scope.options) {

                    if (scope.options.watchEnter !== true) {
                        watchEnter = false
                    } else {
                        watchEnter = true
                    }

                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                        scope.gPlace.setTypes(opts.types)
                    } else {
                        scope.gPlace.setTypes([])
                    }

                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                        scope.gPlace.setBounds(opts.bounds)
                    } else {
                        scope.gPlace.setBounds(null)
                    }

                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                        scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
                    } else {
                        scope.gPlace.setComponentRestrictions(null)
                    }
                }
            }

            if (scope.gPlace == undefined) {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
            }
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var result = scope.gPlace.getPlace();
                if (result !== undefined) {
                    if (result.address_components !== undefined) {

                        scope.$apply(function() {

                            scope.details = result;

                            controller.$setViewValue(element.val());
                        });
                    }
                    else {
                        if (watchEnter) {
                            getPlace(result)
                        }
                    }
                }
            })

            //function to get retrieve the autocompletes first result using the AutocompleteService
            var getPlace = function(result) {
                var autocompleteService = new google.maps.places.AutocompleteService();
                if (result.name.length > 0){
                    autocompleteService.getPlacePredictions(
                        {
                            input: result.name,
                            offset: result.name.length
                        },
                        function listentoresult(list, status) {
                            if(list == null || list.length == 0) {

                                scope.$apply(function() {
                                    scope.details = null;
                                });

                            } else {
                                var placesService = new google.maps.places.PlacesService(element[0]);
                                placesService.getDetails(
                                    {'reference': list[0].reference},
                                    function detailsresult(detailsResult, placesServiceStatus) {

                                        if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                                            scope.$apply(function() {

                                                controller.$setViewValue(detailsResult.formatted_address);
                                                element.val(detailsResult.formatted_address);

                                                scope.details = detailsResult;

                                                //on focusout the value reverts, need to set it again.
                                                var watchFocusOut = element.on('focusout', function(event) {
                                                    element.val(detailsResult.formatted_address);
                                                    element.unbind('focusout')
                                                })

                                            });
                                        }
                                    }
                                );
                            }
                        });
                }
            }

            controller.$render = function () {
                var location = controller.$viewValue;
                element.val(location);
            };


            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
            }, true);

            scope.$on('currentPlaceChanged', function (event, args) {
                scope.details = args.message;
                scope.ngModel = args.message.formatted_address;
            });
        }
    };
}]);
/**
 * Created by labrina.loving on 9/6/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileAvailabilityCtrl', ['$scope','$state','$stateParams', 'CandidateService', CandidateProfileAvailabilityCtrl ]);


    function CandidateProfileAvailabilityCtrl($scope, $state,$stateParams, CandidateService) {
        var candidateService = CandidateService;
        var schedule ={
            "sunday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "monday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "tuesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "wednesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "thursday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "friday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "saturday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            }
        }

        $scope.schedule = schedule;

        if($scope.profile && $scope.profile.availability){
            $scope.schedule = $scope.profile.availability;
        }
        $scope.saveSchedule = function() {
            candidateService.saveAvailability($scope.schedule, $scope.user.providerId);
            $state.go('app.candidate.dashboard');
        }


    }
})()
;




/**
 * Created by labrina.loving on 8/28/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileBasicsCtrl', ['$scope','$state','$stateParams', 'FilePickerService', 'filePickerKey','UserService', 'CandidateService', CandidateProfileBasicsCtrl ]);


    function CandidateProfileBasicsCtrl($scope, $state,$stateParams, FilePickerService, filePickerKey, UserService, CandidateService) {
        var userService = UserService;
        var filePickerService = FilePickerService;
        var candidateService = CandidateService;

        var vm = this;
        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';
        $scope.candidate = {};

        if($scope.profile){
            $scope.candidate = $scope.profile.candidate;
        }

        filePickerService.setKey(filePickerKey);
        $scope.pickFile = function pickFile(){
            filePickerService.pick(
                {
                    mimetype: 'image/*',
                    services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'DROPBOX', 'GOOGLE_DRIVE', 'INSTAGRAM', 'WEBCAM'],
                    conversions: ['crop', 'rotate', 'filter']
                },

                onSuccess
            );
        };

        function onSuccess(Blob){
            $scope.user.profileImageUrl = Blob.url;
            $scope.$apply();
        };

        $scope.submitProfile = function() {

            userService.saveUser($scope.user);
            candidateService.saveCandidate($scope.candidate, $scope.user.providerId);
            $state.go('app.candidate.profile.experience');
        }
    }
})()
;



/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'profile', CandidateProfileCtrl ]);


    function CandidateProfileCtrl($scope, $state,$stateParams,CandidateService, profile) {

        var candidateService = CandidateService;

        $scope.profile = profile;


    }
})()
;



