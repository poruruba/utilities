export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">日時</h2>
  <div class="card">
      <div class="card-header">
          基準日時
          <button class="btn btn-secondary" v-on:click="date_get_now('base')">現在時間</button>
          <button class="btn btn-secondary" v-on:click="date_input_dialog('base')">手動設定</button>
      </div>
      <div class="card-body">
          <label class="title">UNIX時間(msec)</label>
          <input type="text" class="form-control" v-model="date_unix" readonly>
          <label class="title">ISO-8601(UTC)</label>
          <input type="text" class="form-control" v-model="date_iso" readonly>
          <label class="title">ISO-8601(JST)</label>
          <input type="text" class="form-control" v-model="date_iso2" readonly>
          <label class="title">Locale</label>
          <input type="text" class="form-control" v-model="date_locale" readonly>
      </div>
  </div>
  <div class="card">
      <div class="card-header">
          経過期間
      </div>
      <div class="card-body">
          <div class="row">
              <span class="col-auto">
                  <select class="form-select" v-model="date_duration_unit">
                      <option value="year">年</option>
                      <option value="month">月</option>
                      <option value="day">日</option>
                      <option value="hour">時</option>
                      <option value="minute">分</option>
                      <option value="second">秒</option>
                  </select>
              </span>
              <span class="col-auto">
                  <input type="number" class="form-control" v-model.number="date_duration">
              </span>
              &nbsp;&nbsp;
              <button class="col-auto btn btn-primary btn-sm" v-on:click="date_process()">経過後日時算出</button>
              &nbsp;&nbsp;
              <button class="col-auto btn btn-primary btn-sm" v-on:click="date_duration_calc">経過期間算出</button>
          </div>
          <div class="row">
              <p>{{date_duration_str}}</p>
          </div>
      </div>
  </div>
  <div class="card">
      <div class="card-header">
          経過後日時
          <button class="btn btn-secondary" v-on:click="date_get_now('elapsed')">現在時間</button>
          <button class="btn btn-secondary" v-on:click="date_input_dialog('elapsed')">手動設定</button>
      </div>
      <div class="card-body">
          <label class="title">UNIX時間(msec)</label>
          <input type="text" class="form-control" v-model="date_unix_after" readonly>
          <label class="title">ISO-8601(UTC)</label>
          <input type="text" class="form-control" v-model="date_iso_after" readonly>
          <label class="title">ISO-8601(JST)</label>
          <input type="text" class="form-control" v-model="date_iso2_after" readonly>
          <label class="title">Locale</label>
          <input type="text" class="form-control" v-model="date_locale_after" readonly>
      </div>
  </div>
  <collapse-panel id="date_tostring_panel" title="toLocaleString" collapse="true">
      <span slot="content">
          <div class="card-body">
              <h3><label class="title">{{date_tostring}}</label> {{date_localestring}}</h3>
              {{date_tolocalestring_string}}<br><br>
              <div v-on:change="date_option_change">
                  <div class="row">
                      <label class="col-auto col-form-label title">toString</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_tostring">
                              <option value="toLocaleString">toLocaleString</option>
                              <option value="toLocaleDateString">toLocaleDateString</option>
                              <option value="toLocaleTimeString">toLocaleTimeString</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">locales</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_locales">
                              <option value="ja-JP">ja-JP</option>
                              <option value="ja-JP-u-ca-japanese">ja-JP-u-ca-japanese</option>
                          </select>
                      </span>
                  </div>
                  <div class="row">
                      <label class="col-auto col-form-label title">era</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.era">
                              <option value=""></option>
                              <option value="narrow">narrow</option>
                              <option value="short">short</option>
                              <option value="long">long</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">year</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.year">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">month</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.month">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                              <option value="narrow">narrow</option>
                              <option value="short">short</option>
                              <option value="long">long</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">day</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.day">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">weekday</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.weekday">
                              <option value=""></option>
                              <option value="narrow">narrow</option>
                              <option value="short">short</option>
                              <option value="long">long</option>
                          </select>
                      </span>
                  </div>
                  <div class="row">
                      <label class="col-auto col-form-label title">hour12</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.hour12">
                              <option value=""></option>
                              <option value="true">true</option>
                              <option value="false">false</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">hour</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.hour">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">minute</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.minute">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">second</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.second">
                              <option value=""></option>
                              <option value="numeric">numeric</option>
                              <option value="2-digit">2-digit</option>
                          </select>
                      </span>
                      <label class="col-auto col-form-label title">timeZoneName</label>
                      <span class="col-auto">
                          <select class="form-select" v-model="date_option.timeZoneName">
                              <option value=""></option>
                              <option value="short">short</option>
                              <option value="long">long</option>
                          </select>
                      </span>
                  </div>
              </div>
              <hr>
              <h3><label class="title">toISOString</label> {{new Date().toISOString()}}</h3>
              <h3><label class="title">toUTCString</label> {{new Date().toUTCString()}}</h3>
          </div>
      </span>
  </collapse-panel>

  <div class="modal" id="date_input_dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">日時の入力</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <label class="col-auto col-form-label title">フリー入力(msec)</label>
                    <span class="col-auto">
                        <input type="text" class="form-control" v-model="date_input_free">
                        <input type="checkbox" class="form-check-input" id="date_check_sec" v-model="date_check_sec"><label for="date_check_sec">sec</label>
                    </span>
                    <button class="col-auto btn btn-primary" v-on:click="date_input_process('free')">入力</button>
                </div>
                <br>
                <div class="row">
                    <span class="col-auto">
                        <input type="date" class="form-control" v-model="date_input_date">
                    </span>
                    <span class="col-auto">
                        <input type="time" class="form-control" v-model="date_input_time">
                    </span>
                    <button class="col-auto btn btn-primary" v-on:click="date_input_process('control')">入力</button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" v-on:click="dialog_close('#date_input_dialog')">キャンセル</button>
            </div>
        </div>
    </div>
  </div>

</div>`,
  data: function () {
    return {
      date_duration: 0,
      date_duration_unit: 'year',
      date_moment: moment(),
      date_moment_after: null,
      date_input_mode: '',
      date_input_free: null,
      date_input_date: null,
      date_input_time: null,
      date_duration_str: "",
      date_localestring: new Date().toLocaleString("ja-JP"),
      date_option: {},
      date_locales: "ja-JP",
      date_tostring: "toLocaleString",
      date_check_sec: false,
    }
  },
  computed: {
    date_unix: function () {
      return this.date_moment.valueOf();
    },
    date_iso: function () {
      return moment(this.date_moment).utc().format();
    },
    date_iso2: function () {
      return this.date_moment.format();
    },
    date_locale: function () {
      var date = this.date_moment.toDate();
      return date.toLocaleString();
    },
    date_unix_after: function () {
      if (!this.date_moment_after)
        return null;
      return this.date_moment_after.valueOf();
    },
    date_iso_after: function () {
      if (!this.date_moment_after)
        return null;
      return moment(this.date_moment_after).utc().format();
    },
    date_iso2_after: function () {
      if (!this.date_moment_after)
        return null;
      return this.date_moment_after.format();
    },
    date_locale_after: function () {
      if (!this.date_moment_after)
        return null;
      var date = this.date_moment_after.toDate();
      return date.toLocaleString();
    },
    date_tolocalestring_string: function () {
      var options = {};
      if (this.date_option.hour12 == "true") options.hour12 = true;
      else if (this.date_option.hour12 == "false") options.hour12 = false;
      if (this.date_option.era) options.era = this.date_option.era;
      if (this.date_option.year) options.year = this.date_option.year;
      if (this.date_option.month) options.month = this.date_option.month;
      if (this.date_option.day) options.day = this.date_option.day;
      if (this.date_option.weekday) options.weekday = this.date_option.weekday;
      if (this.date_option.hour) options.hour = this.date_option.hour;
      if (this.date_option.minute) options.minute = this.date_option.minute;
      if (this.date_option.second) options.second = this.date_option.second;
      if (this.date_option.timeZoneName) options.timeZoneName = this.date_option.timeZoneName;

      return "new Date()." + this.date_tostring + "( '" + this.date_locales + "', " + JSON.stringify(options) + " );";
    },
  },
  methods: {
    /* 日時 */
    date_option_change: function () {
      var options = {};
      if (this.date_option.hour12 == "true") options.hour12 = true;
      else if (this.date_option.hour12 == "false") options.hour12 = false;
      if (this.date_option.era) options.era = this.date_option.era;
      if (this.date_option.year) options.year = this.date_option.year;
      if (this.date_option.month) options.month = this.date_option.month;
      if (this.date_option.day) options.day = this.date_option.day;
      if (this.date_option.weekday) options.weekday = this.date_option.weekday;
      if (this.date_option.hour) options.hour = this.date_option.hour;
      if (this.date_option.minute) options.minute = this.date_option.minute;
      if (this.date_option.second) options.second = this.date_option.second;
      if (this.date_option.timeZoneName) options.timeZoneName = this.date_option.timeZoneName;
      switch (this.date_tostring) {
        case "toLocaleString":
          this.date_localestring = new Date().toLocaleString(this.date_locales, options);
          break;
        case "toLocaleDateString":
          this.date_localestring = new Date().toLocaleDateString(this.date_locales, options);
          break;
        case "toLocaleTimeString":
          this.date_localestring = new Date().toLocaleTimeString(this.date_locales, options);
          break;
      }
    },
    date_get_now: function (target) {
      if (target == 'base')
        this.date_moment = moment();
      else
        this.date_moment_after = moment();
    },
    date_input_dialog: function (target) {
      this.date_input_mode = target;
      var temp;
      if (target == 'base')
        temp = moment(this.date_moment);
      else
        temp = moment(this.date_moment_after);
      this.date_input_date = temp.format('YYYY-MM-DD');
      this.date_input_time = temp.format('HH:mm:ss');
      this.dialog_open('#date_input_dialog');
    },
    date_duration_calc: function () {
      var base = moment(this.date_moment);
      var after = moment(this.date_moment_after);
      var elapsed_year = after.diff(base, 'years');
      var elapsed_month = after.diff(base, 'months');
      var elapsed_day = after.diff(base, 'days');
      var elapsed_hour = after.diff(base, 'hours');
      var elapsed_minute = after.diff(base, 'minutes');
      var elapsed_second = after.diff(base, 'seconds');
      var temp = "";
      if( elapsed_year > 0 ) temp += elapsed_year + "年 ";
      if( elapsed_month > 0 ) temp += elapsed_month + "か月 ";
      if( elapsed_day > 0 ) temp += elapsed_day + "日 ";
      if( elapsed_hour > 0 ) temp += elapsed_hour + "時間 ";
      if( elapsed_minute > 0 ) temp += elapsed_minute + "分 ";
      if( elapsed_second > 0 ) temp += elapsed_second + "秒 ";
      this.date_duration_str = temp;
    },
    date_process: function () {
      var temp = moment(this.date_moment);
      if (this.date_duration_unit == 'year')
        temp.add(this.date_duration, 'years');
      else if (this.date_duration_unit == 'month')
        temp.add(this.date_duration, 'months');
      else if (this.date_duration_unit == 'day')
        temp.add(this.date_duration, 'days');
      else if (this.date_duration_unit == 'hour')
        temp.add(this.date_duration, 'hours');
      else if (this.date_duration_unit == 'minute')
        temp.add(this.date_duration, 'minutes');
      else if (this.date_duration_unit == 'second')
        temp.add(this.date_duration, 'seconds');
      this.date_moment_after = temp;
      this.date_duration_calc();
    },
    date_input_process: function (target) {
      var date;
      if (target == 'free') {
        if (!this.date_input_free) {
          alert('入力値が不正です。');
          return;
        }
        date = this.date_input_free;
        if( this.date_check_sec )
          date *= 1000;
      } else {
        if (!this.date_input_date || !this.date_input_time) {
          alert('入力値が不正です。');
          return;
        }
        date = this.date_input_date + ' ' + this.date_input_time;
      }

      if (this.date_input_mode == 'base') {
        if (!isNaN(date))
          this.date_moment = moment(Number(date));
        else
          this.date_moment = moment(date);
      } else {
        if (!isNaN(date))
          this.date_moment_after = moment(Number(date));
        else
          this.date_moment_after = moment(date);
      }
      this.dialog_close('#date_input_dialog');
    },
  },
  mouted: function () {
    this.date_process();
  }
};
