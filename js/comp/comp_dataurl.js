var decoder = new TextDecoder('utf-8');

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">DataURL</h2>
  <comp_file id="dataurl_file" ref="dataurl_file" v-bind:callback="dataurl_open_files"></comp_file>
  <br>
  <div class="row">
    <label class="title col-auto">mime-type</label> <span class="col-auto"><input type="text" class="form-control col-auto" v-model="dataurl_type"></span>
  </div>
  <label class="title">HexString</label>
  <textarea class="form-control" rows="10" v-on:drop="dataurl_drop" v-on:dragover.prevent v-model="dataurl_hexstring"></textarea>
  <br>
  <button class="btn btn-secondary" v-on:click="dataurl_to_dataurl">to DataURL</button> <button class="btn btn-secondary" v-on:click="dataurl_to_hexstring">to HexString</button>
  <br>
  <br>
  <label class="title">DataURL</label>
  <textarea class="form-control" rows="10" v-on:drop="dataurl_drop" v-on:dragover.prevent v-model="dataurl_dataurl"></textarea>
  <br>
  <button v-if="dataurl_type.startsWith('image/') || dataurl_type.startsWith('text/')" class="btn btn-secondary" v-on:click="dialog_open('#dataurl_image_dialog')">内容表示</button><br><br>

  <div class="modal" id="dataurl_image_dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">内容表示
                    <span class="float-end">
                        <button class="btn btn-secondary" v-on:click="dialog_close('#dataurl_image_dialog')">閉じる</button>
                    </span>
                </h4>
            </div>
            <div class="modal-body">
                <img v-if="dataurl_type.startsWith('image/')" v-bind:src="dataurl_dataurl" class="img-fluid" />
                <pre v-if="dataurl_type.startsWith('text/')">{{dataurl_text}}</pre>
            </div>
        </div>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      dataurl_type: '',
      dataurl_data: null,
      dataurl_dataurl: '',
      dataurl_hexstring: '',
      dataurl_text: '',
    }
  },
  methods: {
    /* バイナリファイル */
    dataurl_drop: function (e) {
      this.$refs.dataurl_file.file_drop(e);
    },
    dataurl_open_files: function (files) {
      if( files.length <= 0 ){
        return;
      }

      var file = files[0];
      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.dataurl_parse(file.type, reader.result);
      };
      reader.readAsArrayBuffer(file);
    },
    dataurl_parse: function(type, result){
      this.dataurl_data = new Uint8Array(result);
      this.dataurl_type = type || 'application/octet-stream';
      this.dataurl_hexstring = this.ba2hex(this.dataurl_data);
      if (this.dataurl_type.startsWith('text/'))
        this.dataurl_text = decoder.decode(this.dataurl_data);
      this.dataurl_dataurl = "data:" + this.dataurl_type + ";base64," + bufferToBase64(this.dataurl_data);
    },
    dataurl_to_dataurl: function(){
      var blob = new Blob([new Uint8Array(this.hex2ba(this.dataurl_hexstring)).buffer], { type: this.dataurl_type });
      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.dataurl_parse(blob.type, reader.result);
      };
      reader.readAsArrayBuffer(blob);
    },
    dataurl_to_hexstring: function(){
      var start = this.dataurl_dataurl.indexOf(':');
      var end = this.dataurl_dataurl.indexOf(';');
      if( start != 4 || end <= start )
        return;

      this.dataurl_type = this.dataurl_dataurl.slice(start + 1, end);
      var index = this.dataurl_dataurl.indexOf(',');
      var blob = new Blob([base64ToBuffer(this.dataurl_dataurl.slice(index + 1)).buffer], { type: this.dataurl_type });
      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.dataurl_parse(blob.type, reader.result);
      };
      reader.readAsArrayBuffer(blob);
    }
  }
};

function bufferToBase64(buf) {
  if (buf instanceof ArrayBuffer)
    buf = new Uint8Array(buf);
  if (buf instanceof Uint8Array)
    buf = Array.from(buf);

  const binstr = buf.map(b => String.fromCharCode(b)).join("");
  return btoa(binstr);
}

function base64ToBuffer(b64) {
  var binstr = atob(b64);
  var buf = new Uint8Array(binstr.length);
  Array.from(binstr).forEach((ch, i) => buf[i] = ch.charCodeAt(0));
  return buf;
}
