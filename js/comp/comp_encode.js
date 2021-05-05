export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">エンコーディング</h2>
  <h3>Base64エンコード</h3>
  <label class="title">入力</label>
  <textarea class="form-control" rows="5" v-model="base64_input"></textarea>
  <button class="btn btn-primary" v-on:click="base64_encode(true)">エンコード</button>
  <button class="btn btn-primary" v-on:click="base64_encode(false)">デコード</button>&nbsp;&nbsp;
  <button class="btn btn-primary" v-on:click="base64_encode(true, true)">バイナリエンコード</button>
  <button class="btn btn-primary" v-on:click="base64_encode(false, true)">バイナリデコード</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(base64_output)"></button>
  <textarea class="form-control" rows="5" readonly>{{base64_output}}</textarea>

  <h3>Base64URLエンコード</h3>
  <label class="title">入力</label>
  <textarea class="form-control" rows="5" v-model="base64url_input"></textarea>
  <button class="btn btn-primary" v-on:click="base64url_encode(true)">バイナリエンコード</button>
  <button class="btn btn-primary" v-on:click="base64url_encode(false)">バイナリデコード</button><br>
  <label class="title">出力</label><br>
  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(base64url_output)"></button>
  <textarea class="form-control" rows="5" readonly>{{base64url_output}}</textarea>

  <h3>URLエンコード</h3>
  <label class="title">入力</label>
  <input type="text" class="form-control" v-model="url_input">
  <button class="btn btn-primary" v-on:click="url_encode(true)">エンコード</button>
  <button class="btn btn-primary" v-on:click="url_encode(false)">デコード</button><br>
  <label class="title">出力</label>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(url_output)"></button>
      <input type="text" class="form-control" v-model="url_output" readonly>
  </div>

  <h3>HTMLエンティティエンコード</h3>
  <label class="title">入力</label>
  <input type="text" class="form-control" v-model="html_input">
  <button class="btn btn-primary" v-on:click="html_encode(encode_html_space)">エンコード</button>
  <input type="checkbox" v-model="encode_html_space">半角スペース<br>
  <label class="title">出力</label>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(html_output)"></button>
      <input type="text" class="form-control" v-model="html_output" readonly>
  </div>
</div>`,
  data: function () {
    return {
      base64_input: '',
      base64_output: '',
      base64url_input: '',
      base64url_output: '',
      url_input: '',
      url_output: '',
      html_input: '',
      html_output: '',
      encode_html_space: true,
    }
  },
  methods: {
    /* エンコード */
    base64_encode: function (encode, bin) {
      try {
        if (!bin) {
          if (encode)
            this.base64_output = btoa(this.base64_input);
          else
            this.base64_output = atob(this.base64_input);
        } else {
          if (encode)
            this.base64_output = bufferToBase64(hexStr2byteAry(this.base64_input));
          else
            this.base64_output = byteAry2hexStr(base64ToBuffer(this.base64_input));
        }
      } catch (error) {
        alert(error);
      }
    },
    base64url_encode: function (encode) {
      try {
        if (encode)
          this.base64url_output = base64url.encode(hexStr2byteAry(this.base64url_input));
        else
          this.base64url_output = byteAry2hexStr(base64url.decode(this.base64url_input));
      } catch (error) {
        alert(error);
      }
    },
    url_encode: function (encode) {
      try {
        if (encode)
          this.url_output = encodeURIComponent(this.url_input);
        else
          this.url_output = decodeURIComponent(this.url_input);
      } catch (error) {
        alert(error);
      }
    },
    html_encode: function (space) {
      const html_entities = {
        '\"': '&quot;',
        '&': '&amp;',
        '\'': '&apos;',
        '<': '&lt;',
        '>': '&gt;',
        ' ': space ? '&nbsp;' : undefined,
      };

      this.html_output = this.html_input.split('').map((entity) => {
        return html_entities[entity] || entity;
      }).join('');
    },
  }
};