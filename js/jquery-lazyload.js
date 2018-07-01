(function ($) {

    function LazyLoad(el, opts) {
       this.init(el, opts);
    }

    LazyLoad.DEFAULTS = {
        dataAttr: 'src'
    };

    LazyLoad.prototype.init = function (el, opts) {// 初始化
        this.$el = $(el);

        this.opts = $.extend({}, LazyLoad.DEFAULTS, opts); //将这俩属性整合成一个属性  当有重复时以后面一个为准
        this.$window = $(window);

        this.bindEvent();
        this.load();
    }

    LazyLoad.prototype.bindEvent = function () { // 绑定事件
        var self = this,
            timer = null;

        this.fn = function () {
            console.log('ff')
            if (timer) return;

            timer = setTimeout(function () {
                self.load();
                timer = null;
            }, 250);
        };

        this.$window.on('scroll resize', this.fn);
    };



    LazyLoad.prototype.load = function () { // 加载图片
        var self = this,
            $el = this.$el,
            $win = this.$window;

        $el.each(function () {
            if (!this.loaded) {//优化  已经加载了不用遍历
                if (inVisibleArea(this)) {
                    appear(this);
                }
            }
        });

        if (isAllLoaded()) {
            self.destructor();
        }

        // 图片全部加载完毕
        function isAllLoaded() {
            return $el.length === 0;
        }

        // 位置检测
        function inVisibleArea(elem) {
            return $win.scrollTop() + $win.height() >= $(elem).offset().top;
        }

        // 显示图片
        function appear(elem) {
            elem.src = $(elem).data(self.opts.dataAttr);
            elem.loaded = true;

            var tmp = $.grep($el, function (elem) { // $.grep() 函数使用指定的函数过滤数组中的元素，并返回过滤后的数组。
                return !elem.loaded;
            });
            $el = $(tmp);
        }
    };
    LazyLoad.prototype.destructor = function () { // 销毁绑定的事件
        this.$window.off('scroll resize', this.fn);
    };


$.fn.extend({
    lazyload: function (opts) {
        new LazyLoad(this, opts);
        return this;
    }
})
    //如果这样使用插件$.each --> 那么使用$.extend定义插件
    //$().each -->  使用 $.fn.extend  这里我们要使用$(img).lazyLoad
})(jQuery);