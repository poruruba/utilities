export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">暗号化</h2>
  <br>
  <h3>ハッシュ生成</h3>
  <div class="row">
    <label class="col-auto title">アルゴリズム</label>
    <span class="col-auto">
      <select class="form-select" v-model="hash_type">
        <option value="md5">MD5</option>
        <option value="sha1">SHA1</option>
        <option value="sha256">SHA256</option>
        <option value="sha512">SHA512</option>
      </select>
    </span>
    <label class="col-auto title">入力</label>
    <span class="col-auto">
      <select class="form-select" v-model="hash_input_method">
        <option value="file">File指定</option>
        <option value="input">Input指定</option>
      </select>
    </span>
  </div>
  <comp_file v-show="hash_input_method=='file'" id="input_file" v-bind:callback="input_open_files"></comp_file>
  <div v-show="hash_input_method=='input'" class="input-group">
    <span class="col-auto">
      <select class="form-select" v-model="hash_input_type">
        <option value="string">文字列</option>
        <option value="hexstring">16進数</option>
      </select>
    </span>&nbsp;
    <textarea class="form-control" rows="2" v-model="hash_input"></textarea>
  </div>
  <button class="btn btn-primary" v-on:click="crypto_hash()">生成</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(hash_output)"></button>
  <textarea class="form-control" rows="2" readonly>{{hash_output}}</textarea>
  <br>
  <h3>HMAC</h3>
  <div class="row">
    <label class="col-auto title">アルゴリズム</label>
    <span class="col-auto">
      <select class="form-select" v-model="hmac_type">
        <option value="md5">MD5</option>
        <option value="sha256">SHA256</option>
      </select>
    </span>
  </div>
  <label class="title">入力</label>
  <div class="input-group">
    <span class="col-auto">
      <select class="form-select" v-model="hmac_input_type">
        <option value="string">文字列</option>
        <option value="hexstring">16進数</option>
      </select>
    </span>&nbsp;
    <textarea class="form-control" rows="2" v-model="hmac_input"></textarea>
  </div>
  <label class="title">シークレット</label>
  <div class="input-group">
    <span class="col-auto">
      <select class="form-select" v-model="hmac_secret_type">
        <option value="string">文字列</option>
        <option value="hexstring">16進数</option>
      </select>
    </span>&nbsp;
    <input type="text" class="form-control" v-model="hmac_secret">
  </div>
  <button class="btn btn-primary" v-on:click="crypto_hmac()">生成</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(hmac_output)"></button>
  <textarea class="form-control" rows="2" readonly>{{hmac_output}}</textarea>
  <br>
  <h3>AES</h3>
  <label class="title">入力</label>
  <textarea class="form-control" rows="3" v-model="aes_input"></textarea>
  <label class="title">初期ベクトル</label>
  <textarea class="form-control" rows="1" v-model="aes_iv"></textarea>
  <label class="title">暗号鍵</label>
  <textarea class="form-control" rows="1" v-model="aes_secret"></textarea>
  <button class="btn btn-primary" v-on:click="crypto_aes(true)">暗号化</button>
  <button class="btn btn-primary" v-on:click="crypto_aes(false)">復号化</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(aes_output)"></button>
  <textarea class="form-control" rows="3" readonly>{{aes_output}}</textarea>
</div>`,
  data: function () {
    return {
      hash_input_method: 'file',
      hash_type: 'md5',
      hash_input: '',
      hash_input_type: 'hexstring',
      hash_output: '',
      hmac_type: 'sha256',
      hmac_input: '',
      hmac_input_type: 'string',
      hmac_secret: '',
      hmac_secret_type: 'string',
      hmac_output: '',
      aes_input: '',
      aes_iv: '',
      aes_secret: '',
      aes_output: '',
    }
  },
  methods: {
    /* 暗号化 */
    input_open_files: function(files){
      if (files.length <= 0) {
        this.hash_input = '';
        return;
      }

      var file = files[0];
      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.hash_input = this.ba2hex(reader.result);
        this.hasn_input_type = 'hexstring';
      };
      reader.readAsArrayBuffer(file);
    },
    crypto_hash: function(){
      var input = (this.hash_input_type == 'string') ? this.hash_input : CryptoJS.enc.Hex.parse(this.hash_input);
      var hash;
      if (this.hash_type == 'md5')
        hash = CryptoJS.MD5(input);
      else if( this.hash_type == 'sha1' )
        hash = CryptoJS.SHA1(input);
      else if( this.hash_type == 'sha256' )
        hash = CryptoJS.SHA256(input);
      else if (this.hash_type == 'sha512')
        hash = CryptoJS.SHA512(input);
      
      this.hash_output = this.ba2hex(wordarray_to_uint8array(hash));
    },
    crypto_hmac: function () {
      try {
        var input = (this.hmac_input_type == 'string') ? this.hmac_input : CryptoJS.enc.Hex.parse(this.hmac_input);
        var secret = (this.hmac_secret_type == 'string') ? this.hmac_secret : CryptoJS.enc.Hex.parse(this.hmac_secret);
        var hash;
        if( this.hmac_type == 'sha256' )
          hash = CryptoJS.HmacSHA256(input, secret);
        else if( this.hmac_type == 'md5' )
          hash = CryptoJS.HmacMD5(input, secret);
        this.hmac_output = this.ba2hex(wordarray_to_uint8array(hash));
      } catch (error) {
        alert(error);
      }
    },
    crypto_aes: function (encrypt) {
      try {
        var input = CryptoJS.enc.Hex.parse(this.aes_input);
        var iv = CryptoJS.enc.Hex.parse(this.aes_iv);
        var key = CryptoJS.enc.Hex.parse(this.aes_secret);
        if (encrypt) {
          var encrypted = CryptoJS.AES.encrypt(input, key, { iv: iv, padding: CryptoJS.pad.NoPadding });
          this.aes_output = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        } else {
          var decrypted = CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({ ciphertext: input }), key, { iv: iv, padding: CryptoJS.pad.NoPadding });
          this.aes_output = decrypted.toString(CryptoJS.enc.Hex);
        }
      } catch (error) {
        alert(error);
      }
    },
  }
};

function wordarray_to_uint8array(wordArray, length) {
  if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  var result = [], i = 0;
  while (length > 0) {
    var bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result.push(bytes);
    i++;
  }

  return Uint8Array.from([].concat.apply([], result));
}

function wordToByteArray(word, length) {
  var ba = [];
  if (length > 0)
    ba.push(word >>> 24);
  if (length > 1)
    ba.push((word >>> 16) & 0xFF);
  if (length > 2)
    ba.push((word >>> 8) & 0xFF);
  if (length > 3)
    ba.push(word & 0xFF);

  return ba;
}
