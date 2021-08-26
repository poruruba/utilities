export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">暗号化</h2>
  <h3>HMAC(SHA256)</h3>
  <label class="title">入力</label>
  <textarea class="form-control" rows="2" v-model="hmac_input"></textarea>
  <label class="title">シークレット</label>
  <textarea class="form-control" rows="1" v-model="hmac_secret"></textarea>
  <button class="btn btn-primary" v-on:click="crypto_hmac()">生成</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(hmac_output)"></button>
  <textarea class="form-control" rows="2" readonly>{{hmac_output}}</textarea>

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
      hmac_input: '',
      hmac_secret: '',
      hmac_output: '',
      aes_input: '',
      aes_iv: '',
      aes_secret: '',
      aes_output: '',
    }
  },
  methods: {
    /* 暗号化 */
    crypto_hmac: function () {
      try {
        this.hmac_output = this.ba2hex(makeHmacSha256(this.hmac_input, this.hmac_secret));
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

function makeHmacSha256(input, secret) {
  var hash = CryptoJS.HmacSHA256(input, secret);
  return wordarray_to_uint8array(hash);
}

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
