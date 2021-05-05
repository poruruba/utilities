export default {
  mixins: [mixins_bootstrap],
  template: `
  <div>
    <h2 class="modal-header">基数</h2>
    <label class="title">10進数</label>
    <div class="row">
        <span class="col-auto">
            <div class="input-group">
                <button class="col-auto btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(cardinal_decimal)"></button>
                <input type="text" size="40" class="form-control text-end" v-model="cardinal_decimal">
            </div>
        </span>
        <button class="col-auto btn btn-secondary" v-on:click="cardinal_convart(10)">セット</button>&nbsp;&nbsp;
        <div class="col-auto btn-group">
            <button class="btn btn-secondary" v-on:click="cardinal_shift(10, 'left')">&lt;&lt;</button>
            <button class="btn btn-secondary" v-on:click="cardinal_shift(10, 'right')">&gt;&gt;</button>&nbsp;&nbsp;
        </div>
    </div>
    <br>
    <label class="title">2進数</label>
    <div class="row">
        <span class="col-auto">
            <div class="input-group">
                <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(cardinal_binary)"></button>
                <input type="text" size="40" class="form-control text-end" v-model="cardinal_binary">
            </div>
        </span>
        <button class="col-auto btn btn-secondary" v-on:click="cardinal_convart(2)">セット</button>&nbsp;&nbsp;
        <div class="col-auto btn-group">
            <button class="btn btn-secondary" v-on:click="cardinal_shift(2, 'left')">&lt;&lt;</button>
            <button class="btn btn-secondary" v-on:click="cardinal_shift(2, 'right')">&gt;&gt;</button>&nbsp;&nbsp;
        </div>
        <div class="col-auto">
            <input type="checkbox" v-model="cardinal_check_binary">0埋め
        </div>
        <span class="col-auto">
            <input type="text" class="form-control" size="2" v-model="cardinal_binary_num">
        </span>
        桁
    </div>
    <br>
    <label class="title">16進数</label>
    <div class="row">
        <span class="col-auto">
            <div class="input-group">
                <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(cardinal_hexadecimal)"></button>
                <input type="text" size="40" class="form-control text-end" v-model="cardinal_hexadecimal">
            </div>
        </span>
        <button class="col-auto btn btn-secondary" v-on:click="cardinal_convart(16)">セット</button>&nbsp;&nbsp;
        <div class="col-auto btn-group">
            <button class="btn btn-secondary" v-on:click="cardinal_shift(16, 'left')">&lt;&lt;</button>
            <button class="btn btn-secondary" v-on:click="cardinal_shift(16, 'right')">&gt;&gt;</button>&nbsp;&nbsp;
        </div>
        <span class="col-auto">
            <input type="checkbox" v-model="cardinal_check_hexadecimal">0埋め
        </span>
        <span class="col-auto">
            <input type="text" class="form-control" size="2" v-model="cardinal_hexadecimal_num">
        </span>
        桁
    </div>
  </div>`,
  data: function () {
    return {
      base_decimal: 0,
      cardinal_decimal: 0,
      cardinal_binary: 0,
      cardinal_hexadecimal: 0,
      cardinal_hexadecimal_num: 2,
      cardinal_check_hexadecimal: false,
      cardinal_binary_num: 2,
      cardinal_check_binary: false,
    }
  },
  methods: {
    /* 基数 */
    cardinal_convart: function (radix) {
      var base = 0;
      if (radix == 10) {
        base = parseInt(this.cardinal_decimal, 10);
      } else if (radix == 2) {
        base = parseInt(this.cardinal_binary, 2);
      } else if (radix == 16) {
        base = parseInt(this.cardinal_hexadecimal, 16);
      }
      this.base_decimal = Math.floor(base);

      this.cardinal_update();
    },
    cardinal_shift(radix, shift) {
      if (shift == 'right')
        this.base_decimal = Math.floor(this.base_decimal / radix);
      else
        this.base_decimal = Math.floor(this.base_decimal * radix);

      this.cardinal_update();
    },
    cardinal_update: function () {
      this.cardinal_decimal = this.base_decimal;

      var temp = this.base_decimal.toString(2);
      this.cardinal_binary = temp.padStart(this.cardinal_binary_num, '0');
      var temp = this.base_decimal.toString(16);
      this.cardinal_hexadecimal = temp.padStart(this.cardinal_hexadecimal_num, '0');
    },
  }
};