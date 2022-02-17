import { Asn1 } from '../asn1.js';

Vue.component('asn1-card', {
  props: ['payload', 'id'],
  template: `
  <collapse-panel v-bind:id="id" v-bind:title="tagClassName + ' : ' + tagNumberName">
    <span slot="content">
        <div class="card-body">
            <button class="btn btn-secondary btn-sm float-end" data-bs-toggle="collapse" v-bind:href="'#' + id">閉じる</button>

            <div class="row">
              <div class="col-6">
                <label class="title">tagClass</label> {{payload.tagClass}}<br>
                <label class="title">tagNumber</label> {{payload.tagNumber}}<br>
                <label class="title">length</label> {{payload.length}}<br>
                </div>
              <div class="col-6">
                <label class="title">structured</label> {{payload.structured}}<br>
                <label class="title">offset</label> {{payload.offset}}<br>
                <label class="title">totalLength</label> {{payload.totalLength}}<br>
              </div>
            </div>
            <div v-if="payload.tagClass==0 && payload.tagNumber==1">
              <br>
              <label class="title">boolean</label> {{payload.contents.boolean}}
            </div>
            <div v-else-if="payload.tagClass==0 && payload.tagNumber==3">
              <br>
              <label class="title">unusedBits</label> {{payload.contents.unusedBits}}<br>
              <label class="title">bytes</label> <textarea class="form-control" rows="2">{{payload.contents.bytes}}</textarea>
            </div>
            <div v-else-if="payload.tagClass==0 && payload.tagNumber==6">
              <br>
              <label class="title">oid</label> {{payload.contents.oid}}<br>
              <label v-if="payload.contents.name" class="title">name</label> {{payload.contents.name}}
            </div>
            <div v-else-if="payload.tagClass==0 && (payload.tagNumber==12 || payload.tagNumber==19)">
              <br>
              <label class="title">text</label> {{payload.contents.text}}
            </div>
            <div v-else-if="payload.tagClass==0 && (payload.tagNumber==23 || payload.tagNumber==24)">
              <br>
              <label class="title">datetime</label> {{payload.contents.datetime}}
            </div>
            <div v-else>
              <div v-if="!payload.structured">
                <br>
                <textarea class="form-control" rows="2">{{payload.payload}}</textarea>
              </div>
            </div>

            <div v-if="payload.structureList">
              <asn1-card v-for="(item, index) in payload.structureList" v-bind:payload="item" v-bind:id="id + '_' + index" v-bind:key="id + '_' + index"></asn1-card>
            </div>
          </div>
        </div>
      </span>
  </collapse-panel>
  `,
  computed:{
    tagClassName: function(){
      switch(this.payload.tagClass ){
        case 0: return "Universal";
        case 1: return "Application";
        case 2: return "Context-specific";
        case 3: return "Private";
        default: return "Unknown";
      }
    },
    tagNumberName: function(){
      if( this.payload.tagClass != 0x00 )
          return "Unknown";
      switch(this.payload.tagNumber){
        case 0: return "EOC";
        case 1: return "BOOLEAN";
        case 2: return "INTEGER";
        case 3: return "BIT STRING";
        case 4: return "OCTET STRING";
        case 5: return "NULL";
        case 6: return "OBJECT IDENTIFIER";
        case 7: return "Object Descriptor";
        case 8: return "EXTERNAL";
        case 9: return "REAL(float)";
        case 10: return "ENUMERATED";
        case 11: return "EMBEDDED PDV";
        case 12: return "UTF8String";
        case 13: return "RELATIVE-OID";
        case 14: return "TIME";
        case 16: return "SEQUENCE and SEQUENCE OF";
        case 17: return "SET and SET OF";
        case 18: return "NumericString";
        case 19: return "PrintableString";
        case 20: return "T61String";
        case 21: return "VideotexString";
        case 22: return "IA5String";
        case 23: return "UTCTime";
        case 24: return "GeneralizedTime";
        case 25: return "GrapicString";
        case 26: return "VisibleString";
        case 27: return "GeneralString";
        case 28: return "UniversalString";
        case 29: return "CHARACTER STRING";
        case 30: return "BMPString";
        case 31: return "DATE";
        case 32: return "TIME-OF-DAY";
        case 33: return "DATE-TIME";
        case 34: return "DURATION";
        case 35: return "OID-IRI";
        case 36: return "RELATIVE-OID-IRI";
        default: return "Unknown";
      }
    }
  }
});

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">ASN.1</h2>
  <div class="row">
    <label class="col-auto title">入力方法</label>
    <span class="col-auto">
      <select class="form-select" v-model="asn1_input_method">
        <option value="file">File指定</option>
        <option value="input">Input指定</option>
      </select>
    </span>
  </div>
  <div v-if="asn1_input_method=='file'">
    <comp_file id="asn1_file" accept="application/x-x509-ca-cert,.pem,.der" v-bind:callback="asn1_read_cer"></comp_file>
    <label class="title">mime-type</label> {{asn1_type}}<br>
  </div>
  <div v-if="asn1_input_method=='input'">
    <div class="input-group">
      <span class="col-auto">
        <select class="form-select" v-model="asn1_input_type">
          <option value="string">文字列</option>
          <option value="hexstring">16進数</option>
        </select>
      </span>&nbsp;
      <textarea class="form-control" rows="3" v-model="asn1_input"></textarea>
    </div>
    <button class="btn btn-primary" v-on:click="asn1_parse()">解析</button>
  </div>
  <br>
  <button v-if="asn1" class="btn btn-secondary pull-right" v-on:click="asn1_save()">ファイルに保存</button>
  <asn1-card v-if="asn1" v-bind:payload="asn1" id="start"></asn1-card>
</div>`,
  data: function () {
    return {
      asn1_input_method: 'file',
      asn1_input_type: 'string',
      asn1_input: '',
      asn1_type: '',
      asn1: null,
    }
  },
  methods: {
    /* ASN1 */
    asn1_save: function () {
      var json = JSON.stringify(asn1, null, '\t');
      var blob = new Blob([json], { type: "text/plain" });
      var url = window.URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.href = url;
      a.target = '_blank';
      a.download = "asn1.json";
      a.click();
      window.URL.revokeObjectURL(url);
    },    
    asn1_parse: function(){
      var der;
      if (this.asn1_input_type == 'string' )
        der = decodePEM(this.asn1_input);
      else
        der = this.hex2ba(this.asn1_input);
      try{
        this.asn1 = null;
        this.asn1 = new Asn1(new Uint8Array(der));
      }catch(error){
        console.error(error);
        alert(error);
      }
    },
    asn1_read_cer: function(files){
      if (files.length <= 0) {
        this.asn1_type = '';
        this.asn1 = null;
        return;
      }
      var file = files[0];
      this.asn1_type = file.type;
      var reader = new FileReader();
      if( file.name.toLowerCase().endsWith('.der') || file.name.toLowerCase().endsWith('.bin')){
        reader.onload = () => {
          try{
            this.asn1 = new Asn1(new Uint8Array(reader.result));
          }catch(error){
            console.error(error);
            alert(error);
          }
        };
        reader.readAsArrayBuffer(file);
      }else{
        reader.onload = () => {
          try{
            var der = decodePEM(reader.result);
            this.asn1 = new Asn1(new Uint8Array(der));
          }catch(error){
            console.error(error);
            alert(error);
          }
        };
        reader.readAsText(file);
      }
    },
  }
};

function base64ToBuffer(b64) {
  var binstr = atob(b64);
  var buf = new Uint8Array(binstr.length);
  Array.from(binstr).forEach((ch, i) => buf[i] = ch.charCodeAt(0));
  return buf;
}

function decodePEM(pem){
  var list = pem.split('\n');
  while( !list[0] )
    list.shift();
  if( list[0].startsWith("-----"))
    list.shift();
  while( !list[list.length - 1] )
    list.pop();
  if( list[list.length - 1].startsWith("-----") )
    list.pop();
  return base64ToBuffer(list.join("").replace(/\r?\n/g, ''));
}
