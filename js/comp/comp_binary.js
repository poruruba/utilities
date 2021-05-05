export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">バイナリファイル</h2>
  <input class="form-control" type="file" id="binary_file" v-on:change="binary_open" v-on:click="binary_click">
  <label class="title">mime-type</label> {{binary_type}}
  <button v-if="binary_type.startsWith('image/') || binary_type.startsWith('text/')" class="btn btn-secondary btn-sm" v-on:click="dialog_open('#binary_image_dialog')">内容表示</button><br><br>
  <div class="row" v-on:change="binary_change()">
      <label class="col-auto col-form-label title">変換</label>
      <span class="col-auto">
          <select class="form-select" v-model="binary_format">
              <option value="none" selected>無し</option>
              <option value="cr">改行</option>
              <option value="dataurl">Data URL</option>
          </select>
      </span>
  </div>
  <div v-if="binary_format=='cr'" class="row">
      <span class="col-auto">
          <select class="form-select" v-model.number="binary_cr_num">
              <option value="0">無し</option>
              <option value="2">2バイト</option>
              <option value="4">4バイト</option>
              <option value="8">8バイト</option>
              <option value="16">16バイト</option>
          </select>
      </span>
      <span class="col-auto">
          <input type="checkbox" v-model="binary_space">空白　
      </span>
      <button class="col-auto btn btn-secondary" v-on:click="binary_cr()">整形</button><br>
  </div>
  <textarea class="form-control" rows="10" v-on:drop="binary_drop" v-on:dragover="file_drag" readonly>{{binary_output}}</textarea>
  <br>
  <button class="btn btn-secondary btn-sm" v-on:click="binary_copy()">Copy</button><br>
  <textarea class="form-control" rows="10" v-model="binary_input"></textarea>
  <button class="btn btn-secondary" v-on:click="binary_save()">ファイルに保存</button><br>

  <div class="modal" id="binary_image_dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">内容表示
                    <span class="pull-right">
                        <button class="btn btn-secondary" v-on:click="dialog_close('#binary_image_dialog')">閉じる</button>
                    </span>
                </h4>
            </div>
            <div class="modal-body">
                <img v-if="binary_type.startsWith('image/')" v-bind:src="binary_dataurl" class="img-fluid" />
                <pre v-if="binary_type.startsWith('text/')">{{binary_text}}</pre>
            </div>
        </div>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      binary_output: '',
      binary_cr_num: 0,
      binary_space: false,
      binary_format: 'none',
      binary_type: '',
      binary_data: null,
      binary_input: '',
      binary_dataurl: '',
      binary_text: '',
    }
  },
  methods: {
    file_drag: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    /* バイナリファイル */
    binary_save: function () {
      var target = this.binary_input.replace(/\r?\n|\s/g, '');
      var array = hexStr2byteAry(target);
      var buffer = new ArrayBuffer(array.length);
      var dv = new DataView(buffer);
      for (var i = 0; i < array.length; i++)
        dv.setUint8(i, array[i]);

      var blob = new Blob([buffer], { type: "octet/stream" });
      var url = window.URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.href = url;
      a.target = '_blank';
      a.download = "array.bin";
      a.click();
      window.URL.revokeObjectURL(url);
    },
    binary_open: function (e) {
      var file = e.target.files[0];
      this.binary_open_file(file);
    },
    binary_click: function (e) {
      this.binary_type = '';
      this.binary_output = '';
      this.binary_data = null;
      this.binary_input = '';
      this.binary_dataurl = '';
      this.binary_text = '';

      e.target.value = '';
    },
    binary_copy: function () {
      if (this.binary_data != null)
        this.binary_input = byteAry2hexStr(this.binary_data);
    },
    binary_change: function () {
      if (this.binary_data != null) {
        if (this.binary_format == 'none') {
          this.binary_output = byteAry2hexStr(this.binary_data);
        } else if (this.binary_format == 'cr') {
          this.binary_cr();
        } else if (this.binary_format == 'dataurl') {
          this.binary_output = this.binary_dataurl;
        }
      }
    },
    binary_cr: function () {
      var num_of_interval = this.binary_cr_num;
      if (num_of_interval == 0) {
        if (this.binary_space)
          this.binary_output = byteAry2hexStr(this.binary_data, ' ');
        else
          this.binary_output = byteAry2hexStr(this.binary_data);
      } else {
        var str = '';
        for (var i = 0; i < this.binary_data.length; i += num_of_interval) {
          if (this.binary_space)
            str += byteAry2hexStr(this.binary_data.slice(i, i + num_of_interval), ' ') + '\n';
          else
            str += byteAry2hexStr(this.binary_data.slice(i, i + num_of_interval)) + '\n';
        }
        this.binary_output = str;
      }
    },
    binary_drop: function (e) {
      e.stopPropagation();
      e.preventDefault();

      document.querySelector('#binary_file').files = e.dataTransfer.files;
      this.binary_open_file(e.dataTransfer.files[0]);
    },
    binary_open_file: function (file) {
      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.binary_data = new Uint8Array(reader.result);
        this.binary_type = file.type || 'application/octet-stream';
        if (this.binary_type.startsWith('text/'))
          this.binary_text = decoder.decode(this.binary_data);
        this.binary_dataurl = "data:" + this.binary_type + ";base64," + bufferToBase64(this.binary_data);

        this.binary_change();
      };
      reader.readAsArrayBuffer(file);
    },
  }
};

function byteAry2hexStr(bytes, sep = '', pref = '') {
  if (bytes instanceof ArrayBuffer)
    bytes = new Uint8Array(bytes);
  if (bytes instanceof Uint8Array)
    bytes = Array.from(bytes);

  return bytes.map((b) => {
    const s = b.toString(16);
    return pref + (b < 0x10 ? ('0' + s) : s);
  }).join(sep);
}

function bufferToBase64(buf) {
  if (buf instanceof ArrayBuffer)
    buf = new Uint8Array(buf);
  if (buf instanceof Uint8Array)
    buf = Array.from(buf);

  const binstr = buf.map(b => String.fromCharCode(b)).join("");
  return btoa(binstr);
}
