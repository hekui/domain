import '../css/dateinput.css';
import $ from 'jquery'

function DateInput(el, opts) {
    if (typeof (opts) != "object")
        opts = {};
    $.extend(this, {}, DateInput.DEFAULT_OPTS, opts);

    this.input = $(el);
    this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate", "setDateRange");

    this.build();
    this.selectDate();
    this.setDateRange($.extend({}, this.dateRange, { "start": this.input.data("start") || "", "end": this.input.data("end") || "" }));
    this.hide();
    return this;
}

DateInput.DEFAULT_OPTS = {
    month_names: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    short_month_names: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    short_day_names: ["日", "一", "二", "三", "四", "五", "六"],
    start_of_week: 0,
    format: "yyyy-MM-dd",
    dateRange: { "start": "", "end": "" },
    showTime: false,
    _dateRange: { "start": 0, "end": 0 }
};
DateInput.prototype = {
    build: function () {
        var _this = this;
        var monthNav = $('<p class="month_nav">' + '<span class="button prev" title="按 [PageUp] 上月">&#171;</span>' + ' <span class="month_name"></span> ' + '<span class="button next" title="按 [PageDown] 下月">&#187;</span>' + '</p>');
        this.monthNameSpan = $(".month_name", monthNav);
        $(".prev", monthNav).click(this.bindToObj(function () {
            this.moveMonthBy(-1);
        }));
        $(".next", monthNav).click(this.bindToObj(function () {
            this.moveMonthBy(1);
        }));

        var yearNav = $('<p class="year_nav">' + '<span class="button prev" title="按 [Ctrl+PageUp] 上一年">&#171;</span>' + ' <span class="year_name"></span> ' + '<span class="button next" title="按 [Ctrl+PageDown] 下一年">&#187;</span>' + '</p>');
        this.yearNameSpan = $(".year_name", yearNav);
        $(".prev", yearNav).click(this.bindToObj(function () {
            this.moveMonthBy(-12);
        }));
        $(".next", yearNav).click(this.bindToObj(function () {
            this.moveMonthBy(12);
        }));

        var nav = $('<div class="nav"></div>').append(monthNav, yearNav);

        var tableShell = "<table><thead><tr>";
        $(this.adjustDays(this.short_day_names)).each(function () {
            tableShell += "<th>" + this + "</th>";
        });
        tableShell += "</tr></thead><tbody></tbody></table>";

        //选择时间
        var timeShell = $('<div class="time_selector">选择时间：<input type="text" title="鼠标中键滚动调整大小" maxlength="2" />:<input type="text" title="鼠标中键滚动调整大小" maxlength="2"/>:<input type="text" title="鼠标中键滚动调整大小" maxlength="2"/><button>确定</button></div>');
        this.timeSelector = $("input", timeShell);
        this.mouseWheel(this.timeSelector.eq(0), 24);
        this.mouseWheel(this.timeSelector.eq(1), 60);
        this.mouseWheel(this.timeSelector.eq(2), 60);
        if (!this.showTime) {
            timeShell.hide();
        }

        $("button", timeShell).on("click", this.bindToObj(function () {
            var _time = this.parseTime();
            var _date = this.selectedDate;
            _date.setTime(_date.setHours(_time.hour, _time.minutes, _time.secound));
            this.changeInput(_date);
        }));

        //
        //this.dateSelector = this.rootLayers = $('<div class="date_selector"></div>').append(nav, tableShell, timeShell).appendTo('body'); 
        this.dateSelector = this.rootLayers = $('<div class="date_selector"></div>').append(nav, tableShell, timeShell).insertAfter(this.input);

        if ((typeof document.body.style.maxHeight === "undefined")) {

            this.ieframe = $('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
            this.rootLayers = this.rootLayers.add(this.ieframe);

            $(".button", nav).mouseover(function () {
                $(this).addClass("hover");
            });
            $(".button", nav).mouseout(function () {
                $(this).removeClass("hover");
            });
        }

        this.tbody = $("tbody", this.dateSelector);

        this.input.change(this.bindToObj(function () {
            this.selectDate();
        }));
        this.selectDate();
        this.selectTime(this.selectedDate);
    },

    selectMonth: function (date, isset) {
        var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);

        if (isset || !this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {

            this.currentMonth = newMonth;

            var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
            var numDays = this.daysBetween(rangeStart, rangeEnd);
            var dayCells = "";
            var dataRangeStart = 0, dataRangeEnd = 0;

            if (this.dateRange.start) {
                dataRangeStart = this.stringToDate(this.dateRange.start, 'yy-MM-dd 00:00:00').getTime();
            }
            if (this.dateRange.end) {
                dataRangeEnd = this.stringToDate(this.dateRange.end, 'yy-MM-dd 00:00:00').getTime();
            }

            for (var i = 0; i <= numDays; i++) {
                var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 0, 0);

                if (this.isFirstDayOfWeek(currentDay))
                    dayCells += "<tr>";
                if (currentDay.getMonth() == date.getMonth() && (!dataRangeStart || currentDay.getTime() >= dataRangeStart) && (!dataRangeEnd || currentDay.getTime() <= dataRangeEnd)) {
                    dayCells += '<td class="selectable_day " date="' + this.dateToString(currentDay) + '" >' + currentDay.getDate() + '</td>';
                } else {
                    dayCells += '<td class="unselected_month " date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>';
                }

                if (this.isLastDayOfWeek(currentDay))
                    dayCells += "</tr>";
            }
            this.tbody.empty().append(dayCells);

            this.monthNameSpan.empty().append(this.monthName(date));
            this.yearNameSpan.empty().append(this.currentMonth.getFullYear());

            $(".selectable_day", this.tbody).click(this.bindToObj(function (event) {
                var _time = this.parseTime();
                var _date = new Date($(event.target).attr("date").replace(/-/g, "/") + " " + _time.hour + ":" + _time.minutes + ":" + _time.secound);
                this.changeInput(_date);
            }));

            $("td[date=" + this.dateToString(new Date()) + "]", this.tbody).addClass("today");

            $("td.selectable_day", this.tbody).mouseover(function () {
                $(this).addClass("hover");
            });
            $("td.selectable_day", this.tbody).mouseout(function () {
                $(this).removeClass("hover");
            });
        }
        $('.selected', this.tbody).removeClass("selected");
        $('td[date=' + this.selectedDateString + ']', this.tbody).addClass("selected");
    },

    selectDate: function (date) {
        if (typeof (date) == "undefined") {
            date = this.stringToDate(this.input.val() || this.dateFormat(new Date()), this.input.attr('date-mask'));
        }
        if (!date)
            date = new Date();
        this.selectedDate = date;
        this.selectedDateString = this.dateToString(this.selectedDate);
        this.selectMonth(this.selectedDate);
    },

    selectTime: function (date) {
        this.timeSelector.eq(0).val(this.pad(date.getHours()));
        this.timeSelector.eq(1).val(this.pad(date.getMinutes()));
        this.timeSelector.eq(2).val(this.pad(date.getSeconds()));
    },

    changeInput: function (dateString) {
        let val = this.dateFormat(dateString)
        this.input.val(val).change().blur();
        this.hide();
        // 回调
        this.fn(val)
    },

    show: function () {
        this.rootLayers.css("display", "block");
        $([window, document.body]).on('click', this.hideIfClickOutside);
        this.input.off("focus", this.show);
        $(document.body).keydown(this.keydownHandler);
        this.setPosition();
    },

    hide: function () {
        this.rootLayers.css("display", "none");
        $([window, document.body]).off("click", this.hideIfClickOutside);
        this.input.focus(this.show);
        $(document.body).off("keydown", this.keydownHandler);
    },

    hideIfClickOutside: function (event) {
        if (event.target != this.input[0] && !this.insideSelector(event)) {
            this.hide();
        }
    },

    insideSelector: function (event) {
        //            
        //            var parentOffset={
        //                left:0,
        //                right:0,
        //                top:0,
        //                bottom:0
        //            };
        //            var offset = this.input.offset();
        //            this.input.parents().each(function(){
        //                var position=$(this).css("position");
        //                if(position=="fixed"||position=="relative"||position==""){
        //                    parentOffset=$(this).offset();
        //                    return;
        //                }
        //            })

        var offset = this.dateSelector.position();
        offset.right = offset.left + this.dateSelector.outerWidth();
        offset.bottom = offset.top + this.dateSelector.outerHeight();
        //            var _x=event.pageX-parentOffset.left;
        //            var _y=event.pageY-parentOffset.top;
        var _x = event.pageX;
        var _y = event.pageY;

        return _y < offset.bottom && _y > offset.top && _x < offset.right && _x > offset.left;
    },

    keydownHandler: function (event) {
        switch (event.keyCode) {
            case 9:
            case 27:
                this.hide();
                return;
            case 13:
                var _time = this.parseTime();
                this.changeInput(new Date(this.selectedDateString.replace(/-/g, "/") + " " + _time.hour + ":" + _time.minutes + ":" + _time.secound));
                break;
            case 33:
                this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
                break;
            case 34:
                this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
                break;
            case 38:
                this.moveDateBy(-7);
                break;
            case 40:
                this.moveDateBy(7);
                break;
            case 37:
                this.moveDateBy(-1);
                break;
            case 39:
                this.moveDateBy(1);
                break;
            default:
                return;
        }
        event.preventDefault();
    },

    mouseWheel: function ($obj, max) {
        var _this = this;
        var scrollFunc = function (e) {
            var _status = -1;//1向下，-1向上
            e = e || window.event;
            if (e.wheelDelta) {//IE/Opera/Chrome
                _status = e.wheelDelta == 120 ? 1 : -1;
            } else if (e.detail) {//Firefox
                _status = e.detail == 3 ? -1 : 1;
            }

            var num = _status + parseInt($obj.val() || 0, 0);
            if (num < 0) {
                num = max - 1;
            }
            $obj.val(_this.pad(num % max));
            return false;
        };
        //
        var ele = $obj.get(0);
        if (ele.addEventListener) {
            ele.addEventListener('DOMMouseScroll', scrollFunc, false);
        }//W3C Firefox
        ele.onmousewheel = scrollFunc;//IE/Opera/Chrome
    },

    stringToDate: function (string, mask) {
        var me = this,
            dateValue = string,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/, /H{1,2}/, /m{1,2}/, /s{1,2}/],
            len = patrn.length,
            date = [],
            regExp,
            index,
            _return;

        if (!dateValue) {
            return;
        }

        for (var i = 0; i < len; i++) {
            regExp = patrn[i].exec(me.format);
            if (regExp) {
                index = regExp.index;
                date[i] = dateValue.substring(index, index + regExp[0].length);
                if (mask) mask = mask.replace(patrn[i], date[i]);
            }
        }

        if (mask) {
            _return = new Date((date[0].length == 2 ? "20" : "") + mask.replace(/-/g, "/"));
        } else {
            _return = new Date(date[0].length == 2 ? "20" + date[0] : date[0], date[1] - 1, date[2], date[3] || null, date[4] || null, date[5] || null);
        }

        if (_return)
            return _return;
        else
            return null;
    },

    pad: function (num, n) {
        var len = num.toString().length;
        n = n || 2;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    },
    parseTime: function () {
        var _this = this;
        var _select = _this.timeSelector;
        var _hour = _parse(_select.eq(0).val(), 24);
        var _minutes = _parse(_select.eq(1).val(), 60);
        var _secound = _parse(_select.eq(2).val(), 60);
        _select.eq(0).val(_hour);
        _select.eq(1).val(_minutes);
        _select.eq(2).val(_secound);

        function _parse(val, max) {
            var n = parseInt(val, 10) || 0;
            return _this.pad(n < 0 ? 0 : n < max ? n : (max - 1));
        }

        return { hour: _hour, minutes: _minutes, secound: _secound };
    },

    dateFormat: function (source, pattern) {
        if ('string' != typeof pattern) {
            //                return source.toString();
            pattern = this.format;
        }

        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }

        var pad = this.pad,
            year = source.getFullYear(),
            month = source.getMonth() + 1,
            date2 = source.getDate(),
            hours = source.getHours(),
            minutes = source.getMinutes(),
            seconds = source.getSeconds();

        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);
        return pattern;
    },
    dateToString: function (date) {
        //            return date.getFullYear() + '-' + this.short_month_names[date.getMonth()] + '-' + date.getDate();
        return this.dateFormat(date, 'yyyy-MM-dd');
    },

    setPosition: function () {
        var _top = 0, _left = 0;
        var scrollH = document.body.scrollTop || document.documentElement.scrollTop;
        var clientH = document.documentElement.clientHeight;
        var clientW = document.documentElement.clientWidth;
        var offset = this.input.offset();
        var inputH = this.input.outerHeight();

        //判断是否超出底部
        // console.log('offset', offset)
        // console.log('clientH', clientH)
        // console.log('inputH', inputH)
        // console.log('this.rootLayers.outerHeight()', this.rootLayers.outerHeight())

        if ( offset.top + inputH +  this.rootLayers.outerHeight() > clientH) {
            _top = - this.rootLayers.outerHeight()
        } else {
            _top = inputH;
        }

        // if (scrollH + clientH < this.rootLayers.outerHeight() + offset.top) {
        //     _top = offset.top - this.rootLayers.outerHeight();
        // } else {
        //     _top = offset.top + this.input.outerHeight();
        // }
        //判断是否超出右侧
        // if (clientW < this.rootLayers.outerWidth() + offset.left) {
        //     _left = offset.left + this.input.outerWidth() - this.rootLayers.outerWidth();
        // } else {
        //     _left = offset.left;
        // }

        this.rootLayers.css({
            top: _top,
            // left: _left
        });

        if (this.ieframe) {
            this.ieframe.css({
                width: this.dateSelector.outerWidth(),
                height: this.dateSelector.outerHeight()
            });
        }
    },

    moveDateBy: function (amount) {
        var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
        var dataRangeStart = 0, dataRangeEnd = 0;

        if (this.dateRange.start) {
            dataRangeStart = this.stringToDate(this.dateRange.start, 'yy-MM-dd 00:00:00').getTime();
        }
        if (this.dateRange.end) {
            dataRangeEnd = this.stringToDate(this.dateRange.end, 'yy-MM-dd 00:00:00').getTime();
        }

        if ((!dataRangeStart || newDate.getTime() >= dataRangeStart) && (!dataRangeEnd || newDate.getTime() <= dataRangeEnd)) {
            this.selectDate(newDate);
        }
    },

    moveDateMonthBy: function (amount) {
        var newDate = new Date(this.selectedDate.getFullYear(),
            this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
        if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {

            newDate.setDate(0);
        }
        this.selectDate(newDate);
    },

    moveMonthBy: function (amount) {
        var newMonth = new Date(this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
        this.selectMonth(newMonth);
    },

    monthName: function (date) {
        return this.month_names[date.getMonth()];
    },

    bindToObj: function (fn) {
        var self = this;
        return function () {
            return fn.apply(self, arguments);
        };
    },

    bindMethodsToObj: function () {
        for (var i = 0; i < arguments.length; i++) {
            this[arguments[i]] = this.bindToObj(this[arguments[i]]);
        }
    },

    indexFor: function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (value == array[i])
                return i;
        }
    },

    monthNum: function (month_name) {
        return this.indexFor(this.month_names, month_name);
    },

    shortMonthNum: function (month_name) {
        return this.indexFor(this.short_month_names, month_name);
    },

    shortDayNum: function (day_name) {
        return this.indexFor(this.short_day_names, day_name);
    },

    daysBetween: function (start, end) {
        start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        return (end - start) / 86400000;
    },

    changeDayTo: function (dayOfWeek, date, direction) {
        var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
    },

    rangeStart: function (date) {
        return this.changeDayTo(this.start_of_week, new Date(date
            .getFullYear(), date.getMonth()), -1);
    },

    rangeEnd: function (date) {
        return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
    },

    isFirstDayOfWeek: function (date) {
        return date.getDay() == this.start_of_week;
    },

    isLastDayOfWeek: function (date) {
        return date.getDay() == (this.start_of_week - 1) % 7;
    },

    adjustDays: function (days) {
        var newDays = [];
        for (var i = 0; i < days.length; i++) {
            newDays[i] = days[(i + this.start_of_week) % 7];
        }
        return newDays;
    },

    setDateRange: function (range) {
        this.dateRange = $.extend({}, this.dateRange, range);
        this.selectMonth(this.selectedDate, true);
    }
};
$.fn.dateinput = function (opts) {
    return this.each(function () {
        var $this = $(this);
        if (!$this.data("dateinput-type")) {
            $this.data("dateinput", new DateInput($this, opts));
            $this.data("dateinput-type", true);
        }
    });
};
//	$.date_input = {
//		initialize : function(opts) {
//			$("input.date-input").date_input(opts);
//			// var style = document.createElement('link');
//			// style.href = '/skin/plugin/date/date_input.css';
//			// style.rel = 'stylesheet';
//			// style.type = 'text/css';
//			// document.getElementsByTagName('HEAD').item(0).appendChild(style);
//		}
//	};

// $(document).on("mouseenter", "input.date-input", function () {
//     $(this).dateinput();
// });


