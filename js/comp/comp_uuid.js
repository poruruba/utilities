export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">UUID</h2>
  <button class="btn btn-secondary" v-on:click="uuid_generate">生成</button>&nbsp;<button class="btn btn-secondary" v-on:click="uuid_parse">解析</button>
  <input class="form-control" v-model="uuid_input">
  <br>
  <label class="title">UUID</label>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(uuid_uuid)"></button>
      <input type="text" class="form-control" v-model="uuid_uuid" readonly>
  </div>
  <label class="title">バイト配列</label>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(uuid_array)"></button>
      <input type="text" class="form-control" v-model="uuid_array" readonly>
  </div>
</div>`,
  data: function () {
    return {
      uuid_input: null,
      uuid_uuid: null,
      uuid_array: null,
      uuid_urn: null,
    }
  },
  methods: {
    /* UUID */
    uuid_parse: function () {
      var uuid = UUID.parse(this.uuid_input);
      if (!uuid) {
        if (this.uuid_input.indexOf('-') < 0) {
          var t = this.uuid_input.slice(0, 8) + '-' + this.uuid_input.slice(8, 12) + '-' + this.uuid_input.slice(12, 16) + '-' + this.uuid_input.slice(16, 20) + '-' + this.uuid_input.slice(20, 32);
          uuid = UUID.parse(t);
        }
        if (!uuid) {
          alert('入力が不正です。');
          return;
        }
      }
      this.uuid_uuid = uuid;
      this.uuid_array = uuid.hexNoDelim;
    },
    uuid_generate: function () {
      var uuid = UUID.genV4();
      this.uuid_input = uuid;
      this.uuid_uuid = uuid;
      this.uuid_array = uuid.hexNoDelim;
    },
  }
};