export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">TOTP</h2>
  <label class="title">secret</label>
  <input type="text" class="form-control" v-model="totp_secret">
  <button class="btn btn-primary" v-on:click="totp_generate">生成</button><br>
  <label class="title">code</label>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(totp_code)"></button>
      <input type="text" class="form-control" v-model="totp_code" readonly>
  </div>
</div>`,
  data: function () {
    return {
      totp_secret: '',
      totp_code: '',
    }
  },
  methods: {
    /* TOTP */
    totp_generate: function(){
      let totp = new OTPAuth.TOTP({ secret: this.totp_secret, period: 30});
      let token = totp.generate();
      this.totp_code = token;
    }
  }
};
