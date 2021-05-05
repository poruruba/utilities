export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">元号</h2>
  <div class="row">
      <label class="col-auto col-form-label title">和暦</label>
      <span class="col-auto">
          <select class="form-select" v-model="gengou_era_name">
              <option value="令和">令和</option>
              <option value="平成">平成</option>
              <option value="昭和">昭和</option>
              <option value="大正">大正</option>
              <option value="明治">明治</option>
              <option value="その他">その他</option>
          </select>
      </span>
      <span class="col-auto">
          <input type="text" class="form-control" size="5" v-model="gengou_era_other" v-if="gengou_era_name=='その他'">
      </span>
      <span class="col-auto">
          <input type="number" class="form-control" size="4" v-model.number="gengou_era_year">
      </span>
      <label class="col-auto col-form-label">年</label>
      <button class="col-auto btn btn-primary" v-on:click="gengou_to_anno()">変換</button>
  </div>
  <div class="row">
      <label class="col-auto col-form-label title">西暦</label>
      <span class="col-auto">
          <input type="number" class="form-control" size="5" v-model.number="gengou_anno_year">
      </span>
      <label class="col-auto col-form-label">年</label>
      <button class="col-auto btn btn-primary" v-on:click="gengou_to_era()">変換</button>
  </div>
  <hr>
  <table class="table table-striped">
      <thead>
          <tr><th>元号</th><th>読み</th><th>始期</th><th></th><th>終期</th><th>備考</th></tr>
      </thead>
      <tbody>
          <tr v-for="(item, index) in gengou_list">
              <td>{{item.name}}</td><td>{{item.yomi}}</td><td>{{item.start}}</td><td>～</td><td>{{item.end}}</td><td>{{item.extra}}</td>
          </tr>
      </tbody>
  </table>
</div>`,
  data: function () {
    return {
      gengou_era_name: '令和',
      gengou_era_other: '',
      gengou_era_year: 3,
      gengou_anno_year: 2021,
      gengou_list: gengou_list.reverse(),
    }
  },
  methods: {
    /* 元号 */
    gengou_search_era: function (era) {
      for (var i = 0; i < this.gengou_list.length; i++) {
        if (this.gengou_list[i].name == era)
          return this.gengou_list[i];
      }

      return null;
    },
    gengou_search_anno: function (anno) {
      for (var i = 0; i < this.gengou_list.length; i++) {
        if (this.gengou_list[i].start <= anno && (this.gengou_list[i].end ? anno <= this.gengou_list[i].end : true))
          return this.gengou_list[i];
      }

      return null;
    },
    gengou_to_anno: function () {
      var era_name = (this.gengou_era_name == 'その他') ? this.gengou_era_other : this.gengou_era_name;
      var gengou = this.gengou_search_era(era_name);
      if (!gengou) {
        alert('入力が不正です。');
        return;
      }

      var year = this.gengou_era_year;
      if (year <= 0) {
        alert('入力が不正です。');
        return;
      }

      var anno_year = gengou.start + year - 1;
      if (gengou.end && anno_year > gengou.end) {
        alert('入力が不正です。');
        return;
      }
      this.gengou_anno_year = anno_year;
    },
    gengou_to_era: function () {
      var year = this.gengou_anno_year;
      var gengou = this.gengou_search_anno(year);
      if (!gengou) {
        alert('入力が不正です。');
        return;
      }

      if (gengou.name == '令和' || gengou.name == '平成' || gengou.name == '昭和' || gengou.name == '大正' || gengou.name == '明治') {
        this.gengou_era_name = gengou.name;
      } else {
        this.gengou_era_name = 'その他';
        this.gengou_era_other = gengou.name;
      }

      this.gengou_era_year = year - gengou.start + 1;
    },
  }
};