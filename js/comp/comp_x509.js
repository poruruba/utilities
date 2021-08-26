export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">X.509</h2>
  <div class="row">
    <label class="col-auto title">入力方法</label>
    <span class="col-auto">
      <select class="form-select" v-model="x509_input_method">
        <option value="file">File指定</option>
        <option value="input">Input指定</option>
      </select>
    </span>
  </div>
  <div v-if="x509_input_method=='file'">
    <comp_file id="pkcs_x509" accept="application/x-x509-ca-cert,.pem,.der" v-bind:callback="x509_read_cer"></comp_file>
    <label class="title">mime-type</label> {{pkcs_type}}<br>
  </div>
  <div v-if="x509_input_method=='input'">
    <div class="input-group">
      <span class="col-auto">
        <select class="form-select" v-model="x509_input_type">
          <option value="string">文字列</option>
          <option value="hexstring">16進数</option>
        </select>
      </span>&nbsp;
      <textarea class="form-control" rows="3" v-model="x509_input"></textarea>
    </div>
    <button class="btn btn-primary" v-on:click="x509_parse()">解析</button>
  </div>
  <br>
  <div v-if="item">
    <button class="btn btn-secondary btn-sm" v-on:click="x509_save(item.x509, 'der')">Save(DER)</button>
    <button class="btn btn-secondary btn-sm" v-on:click="x509_save(item.x509, 'pem')">Save(PEM)</button><br>
    <label class="title">version</label> {{item.params.version}}<br>
    <label class="title">serial</label> {{item.params.serial.hex}}<br>
    <label class="title">sigalg</label> {{item.params.sigalg}}<br>
    <label class="title">issuer</label> {{item.params.issuer.str}}<br>
    <label class="title">notbefore</label> {{item.params.notbefore}}<br>
    <label class="title">notafter</label> {{item.params.notafter}}<br>
    <label class="title">subject</label> {{item.params.subject.str}}<br>
    <label class="title">sbjpubkey</label>
    <button class="btn btn-secondary btn-sm" v-on:click="pubkey_save(item.x509, 'der')">Save(DER)</button>
    <button class="btn btn-secondary btn-sm" v-on:click="pubkey_save(item.x509, 'pem')">Save(PEM)</button>
    <textarea class="form-control" rows="3">{{item.params.sbjpubkey}}</textarea>
    <label class="title">sighex</label>
    <textarea class="form-control" rows="2">{{item.params.sighex}}</textarea>
    <label class="title">item.ext[]</label>
    <ul>
      <li v-for="(item2, index2) in item.params.ext">{{JSON.stringify(item2)}}</li>
    </ul>
  </div>
</div>`,
  data: function () {
    return {
      x509_input_method: 'file',
      x509_input_type: 'string',
      x509_input: '',
      pkcs_type: '',
      item: null,
    }
  },
  methods: {
    /* X509 */
    x509_parse: function(){
      var item = {};
      item.x509 = new X509();
      if (this.x509_input_type == 'string' )
        item.x509.readCertPEM(this.x509_input);
      else if (this.x509_input_type == 'hexstring')
        item.x509.readCertHex(this.x509_input);
      item.params = item.x509.getParam();
      console.log(item.params);
      this.item = item;
    },
    x509_read_cer: function(files){
      if (files.length <= 0) {
        this.pkcs_type = '';
        this.item = null;
        return;
      }
      var file = files[0];
      this.pkcs_type = file.type;
      var reader = new FileReader();
      if( file.name.toLowerCase().endsWith('.der')){
        reader.onload = () => {
          try{
            var item = {};
            item.x509 = new X509();
            item.x509.readCertHex(this.ba2hex(reader.result));
            item.params = item.x509.getParam();
            console.log(item.params);
            this.item = item;
          }catch(error){
            console.error(error);
            alert(error);
          }
        };
        reader.readAsArrayBuffer(file);
      }else{
        reader.onload = () => {
          try {
            var item = {};
            item.x509 = new X509();
            item.x509.readCertPEM(reader.result);
            item.params = item.x509.getParam();
            console.log(item.params);
            this.item = item;
          }catch (error) {
            console.error(error);
            alert(error);
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    x509_save: function (x509, format) {
      if (format == 'der') {
        var blob = new Blob([new Uint8Array(this.hex2ba(x509.hex))], { type: "octet/stream" });
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.target = '_blank';
        a.download = "x509.der";
        a.click();
        window.URL.revokeObjectURL(url);
      } else
        if (format == 'pem') {
          var cert = new KJUR.asn1.x509.Certificate(x509.getParam());
          var blob = new Blob([cert.getPEM()], { type: "text/plan" });
          var url = window.URL.createObjectURL(blob);

          var a = document.createElement("a");
          a.href = url;
          a.target = '_blank';
          a.download = "x509.cer";
          a.click();
          window.URL.revokeObjectURL(url);
        }
    },
    pubkey_save: function (x509, format) {
      if (format == 'pem') {
        console.log(x509.getPublicKey())
        var blob = new Blob([KEYUTIL.getPEM(x509.getPublicKey())], { type: "text/plan" });
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.target = '_blank';
        a.download = "pubkey.pem";
        a.click();
        window.URL.revokeObjectURL(url);
      } else
      if (format == 'der') {
        var blob = new Blob([new Uint8Array(this.hex2ba(x509.getPublicKeyHex()))], { type: "octet/stream" });
        var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.target = '_blank';
        a.download = "pubkey.der";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
  }
};
