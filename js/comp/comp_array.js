export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">バイト配列</h2>
  <label class="title">長さ</label> {{array_base.length}}<br>
  <br>
  <button class="btn btn-secondary" v-on:click="array_set(0)">変換</button>
  (例) 0011aabb
  <input type="text" class="form-control" v-model="array_pattern[0]">
  <br>
  <button class="btn btn-secondary" v-on:click="array_set(1)">変換</button>
  (例) 00 11 aa bb
  <input type="text" class="form-control" v-model="array_pattern[1]">
  <br>
  <button class="btn btn-secondary" v-on:click="array_set(2)">変換</button>
  (例) 0x00, 0x11, 0xaa, 0xbb
  <input type="text" class="form-control" v-model="array_pattern[2]">
  <br>
  <button class="btn btn-secondary" v-on:click="array_set(3)">変換</button>
  (例) (byte)0x00, (byte)0x11, (byte)0xaa, (byte)0xbb
  <input type="text" class="form-control" v-model="array_pattern[3]">
  <br>
  <button class="btn btn-secondary" v-on:click="array_set(4)">変換</button>
  (例) 0, 1, 2, 3, 4
  <input type="text" class="form-control" v-model="array_pattern[4]">
  <br>
  <br>
  <div class="card">
      <div class="card-header">乱数生成</div>
      <div class="card-body">
          <div class="row">
              <span class="col-auto">
                  <label class="title">長さ</label>
              </span>
              <span class="col-auto">
                  <input type="number" class="form-control" v-model.number="array_random_length">
              </span>
              <span class="col-auto">
                  <button class="btn btn-secondary btn-sm" v-on:click="array_random_generate">乱数生成</button>
              </span>
          </div>
      </div>
  </div>
</div>`,
  data: function () {
    return {
      array_pattern: [],
      array_base: [],
      array_random_length: 1,
    }
  },
  methods: {
    /* バイト配列 */
    array_set: function (ptn) {
      if (ptn == 0) {
        this.array_base = hexStr2byteAry(this.array_pattern[0]);
      } else if (ptn == 1) {
        this.array_base = hexStr2byteAry(this.array_pattern[1], ' ');
      } else if (ptn == 2) {
        this.array_base = hexStr2byteAry(this.array_pattern[2], ',');
      } else if (ptn == 3) {
        this.array_base = hexStr2byteAry_2(this.array_pattern[3], ',');
      } else if (ptn == 4) {
        this.array_base = hexStr2byteAry_3(this.array_pattern[4], ',');
      }

      this.array_pattern[0] = byteAry2hexStr(this.array_base, '');
      this.array_pattern[1] = byteAry2hexStr(this.array_base, ' ');
      this.array_pattern[2] = byteAry2hexStr(this.array_base, ', ', '0x');
      this.array_pattern[3] = byteAry2hexStr(this.array_base, ', ', '(byte)0x');
      this.array_pattern[4] = this.array_base.join(', ');
    },
    array_random_generate: function () {
      var array = [];
      for (var i = 0; i < this.array_random_length; i++)
        array.push(make_random(255));
      this.array_base = array;
      this.array_set(-1);
    },
  }
};

function hexStr2byteAry(hexs, sep = '') {
  hexs = hexs.trim(hexs);
  if (sep == '') {
    var array = [];
    for (var i = 0; i < hexs.length / 2; i++)
      array[i] = parseInt(hexs.substr(i * 2, 2), 16);
    return array;
  } else {
    return hexs.split(sep).map((h) => {
      return parseInt(h, 16);
    });
  }
}

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

function make_random(max) {
  return Math.floor(Math.random() * (max + 1));
}