var encoder = new TextEncoder('utf-8');
var decoder = new TextDecoder('utf-8');

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">文字列</h2>
  <h3>UTF-8 ⇔ バイト配列</h3>
  <label class="title">入力</label>
  <textarea class="form-control" rows="3" v-model="string_input"></textarea>
  <button class="btn btn-primary" v-on:click="string_encode(true)">toバイト配列</button>
  <button class="btn btn-primary" v-on:click="string_encode(false)">fromバイト配列</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(string_output)"></button>
  <textarea class="form-control" rows="3" readonly>{{string_output}}</textarea>
</div>`,
  data: function () {
    return {
      string_input: '',
      string_output: '',
    }
  },
  methods: {
    /* 文字列 */
    string_encode: function (encode) {
      try {
        if (encode)
          this.string_output = byteAry2hexStr(encoder.encode(this.string_input));
        else
          this.string_output = decoder.decode(new Uint8Array(hexStr2byteAry(this.string_input)));
      } catch (error) {
        alert(error);
      }
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

function hexStr2byteAry(hexs, sep = '') {
    hexs = hexs.trim(hexs);
    if( sep == '' ){
        var array = [];
        for( var i = 0 ; i < hexs.length / 2 ; i++)
            array[i] = parseInt(hexs.substr(i * 2, 2), 16);
        return array;
    }else{
        return hexs.split(sep).map((h) => {
            return parseInt(h, 16);
        });
    }
}
