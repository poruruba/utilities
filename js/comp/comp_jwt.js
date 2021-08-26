export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">JWT</h2>
  <div class="row">
    <div class="col">
      <button class="btn btn-primary" v-on:click="jwt_parse()">解析</button><br>
      <textarea class="form-control" rows="10" v-model="jwt_input"></textarea>
    </div>
    <div class="col">
      <br>
      <label class="title">ヘッダ</label>
      <textarea class="form-control" rows="5" v-model="jwt_output_header" readonly></textarea>
      <label class="title">ペイロード</label>
      <textarea class="form-control" rows="10" v-model="jwt_output_payload" readonly></textarea>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      jwt_input: '',
      jwt_output_header: '',
      jwt_output_payload: '',
    }
  },
  methods: {
    /* JWT */
    jwt_parse: function(){
      var jwt = this.jwt_input.split('.');
      this.jwt_output_header = JSON.stringify(JSON.parse(atob(jwt[0])), null, '\t');
      this.jwt_output_payload = JSON.stringify(JSON.parse(atob(jwt[1])), null, '\t');
    }
  }
};
