export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">カラー</h2>
  <div class="row">
      <span class="col-auto">
          <input type="color" class="form-control-color" v-on:change="color_change" v-model="color_value">&nbsp;&nbsp;
      </span>
      <span class="col-auto">
          <label class="col-form-label title">RGB:</label>
      </span>
      <span class="col-auto">
          <input type="text" size="7" class="form-control" v-model="color_value">
      </span>
  </div>
  <br>
  <table class="table table-borderless lead">
      <td v-bind:style="{ 'background-color': color_value }">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td><label class="title">R:</label><input class="form-range" type="range" min="0" max="255" v-model.number="color_r" v-on:input="color_range"><input type="number" class="form-control" v-model.number="color_r" v-on:change="color_range"></td>
      <td><label class="title">G:</label><input class="form-range" type="range" min="0" max="255" v-model.number="color_g" v-on:input="color_range"><input type="number" class="form-control" v-model.number="color_g" v-on:change="color_range"></td>
      <td><label class="title">B:</label><input class="form-range" type="range" min="0" max="255" v-model.number="color_b" v-on:input="color_range"><input type="number" class="form-control" v-model.number="color_b" v-on:change="color_range"></td>
  </table>
  <br>
  <h4>一番近い色 <button class="btn btn-secondary btn-sm" v-on:click="color_do_near">検索</button></h4>
  <div v-if="color_near">
      <table class="table table-striped">
          <thead>
              <tr><th>選択</th><th>カラー</th><th>名称</th><th>RGB</th><th>R</th><th>G</th><th>B</th></tr>
          </thead>
          <tbody>
              <tr>
                  <td><button class="btn btn-secondary btn-xs" v-on:click="color_select(color_near.rgb)">選択</button></td>
                  <td v-bind:style="{ 'background-color': color_near.rgb }" v-on:click="color_select(color_near.rgb)"></td><td><label class="title">{{color_near.name}}</label></td>
                  <td>{{color_near.rgb.toLowerCase()}}</td><td>{{rgb2num(color_near.rgb, 'r')}}</td><td>{{rgb2num(color_near.rgb, 'g')}}</td><td>{{rgb2num(color_near.rgb, 'b')}}</td>
              </tr>
          </tbody>
      </table>
  </div>
  <h4>基本16色</h4>
  <table class="table table-striped">
      <thead>
          <tr><th>選択</th><th>カラー</th><th>名称</th><th>RGB</th><th>R</th><th>G</th><th>B</th></tr>
      </thead>
      <tbody>
          <tr v-for="(item, index) in color_basic_list">
              <td><button class="btn btn-secondary btn-xs" v-on:click="color_select(item.rgb)">選択</button></td>
              <td v-bind:style="{ 'background-color': item.rgb }" v-on:click="color_select(item.rgb)"></td><td><label class="title">{{item.name}}</label></td>
              <td>{{item.rgb.toLowerCase()}}</td><td>{{rgb2num(item.rgb, 'r')}}</td><td>{{rgb2num(item.rgb, 'g')}}</td><td>{{rgb2num(item.rgb, 'b')}}</td>
          </tr>
      </tbody>
  </table>
  <table class="table table-striped">
      <thead>
          <tr><th>選択</th><th>カラー</th><th>名称</th><th>RGB</th><th>R</th><th>G</th><th>B</th></tr>
      </thead>
      <tbody>
          <tr v-for="(item, index) in color_list">
              <td><button class="btn btn-secondary btn-xs" v-on:click="color_select(item.rgb)">選択</button></td>
              <td v-bind:style="{ 'background-color': item.rgb }" v-on:click="color_select(item.rgb)"></td><td><label class="title">{{item.name}}</label></td>
              <td>{{item.rgb.toLowerCase()}}</td><td>{{rgb2num(item.rgb, 'r')}}</td><td>{{rgb2num(item.rgb, 'g')}}</td><td>{{rgb2num(item.rgb, 'b')}}</td>
          </tr>
      </tbody>
  </table>
</div>`,
  data: function () {
    return {
      color_list: color_list,
      color_value: "#000000",
      color_r: 0,
      color_g: 0,
      color_b: 0,
      color_basic_list: color_basic_list,
      color_near: null,
    }
  },
  methods: {
    /* カラー */
    color_change: function () {
      this.color_r = this.rgb2num(this.color_value, "r");
      this.color_g = this.rgb2num(this.color_value, "g");
      this.color_b = this.rgb2num(this.color_value, "b");
    },
    color_select: function (rgb) {
      this.color_value = rgb.toLowerCase();
      this.color_change();
    },
    color_range: function () {
      var rgb = [this.color_r, this.color_g, this.color_b];
      this.color_select('#' + byteAry2hexStr(rgb));
    },
    color_do_near: function () {
      var min_delta = 200.0;
      var min_target = null;
      for (var i = 0; i < color_list.length; i++) {
        var delta = chroma.deltaE(this.color_value, color_list[i].rgb);
        if (delta < min_delta) {
          min_delta = delta;
          min_target = color_list[i];
        }
      }

      this.color_near = min_target;
    },
    rgb2num: function (rgb, sel) {
      if (sel == 'r')
        return parseInt(rgb.slice(1, 3), 16);
      else if (sel == 'g')
        return parseInt(rgb.slice(3, 5), 16);
      else if (sel == 'b')
        return parseInt(rgb.slice(5, 7), 16);
    },
  }
};

function byteAry2hexStr(bytes, sep = '', pref = '') {
  if (bytes instanceof ArrayBuffer)
    bytes = new Uint8Array(bytes);
  if (bytes instanceof Uint8Array)
    bytes = Array.from(bytes);

  return bytes.map((b) => {
    var s = b.toString(16);
    return pref + (b < 0x10 ? ('0' + s) : s);
  }).join(sep);
}
