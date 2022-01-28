export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">Regex</h2>
  <label class="title">Pattern</label> <input type="text" class="form-control" v-model="regex_pattern" placeholder="正規表現を入力してください。">
  <hr>
  <div class="row">
    <div class="col-auto">
      <select class="form-select" v-model="regex_type" v-on:change="regex_change">
        <option value="exec">exec</option>
        <option value="test">test</option>
      </select>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" v-on:click="regex_change">実行</button>
    </div>
    例：
    <div class="col-auto">
      <select class="form-select">
        <option>^ 行の最初</option>
        <option>$ 行の最後</option>
        <option>. 任意の1文字</option>
        <option>[...] カッコ内の1文字</option>
        <option>* 0回以上の繰り返し</option>
        <option>+ 1回以上の繰り返し</option>
        <option>? 0回か1回</option>
        <option>{n} n回の繰り返し</option>
        <option>{m,n} m回以上n回以下の繰り返し</option>
        <option>a-z 小文字の半角英字</option>
        <option>A-Z 大文字の半角英字</option>
        <option>0-9 数字</option>
        <option>- 範囲</option>
        <option>^ 否定</option>
      </select>
    </div>
  </div>
  <table class="table">
    <thead><tr><th>Input</th><th>Result</th></tr></thead>
    <tbody>
      <tr v-for="(item, index) in regex_test">
        <td><input type="text" class="form-control" v-model="item.input"><td><input type="text" class="form-control" v-model="item.result" readonly></td>
      </tr>
    </tbody>
  </table>
  </div>
</div>`,
  data: function () {
    return {
      regex_pattern: '',
      regex_type: "exec",
      regex_test: [
        {}, {}, {}, {}, {}, {}
      ],
    }
  },
  methods: {
    /* Regex */
    regex_change: function(){
      var regex = new RegExp(this.regex_pattern);
      switch(this.regex_type){
        case "exec":{
          for( var i = 0 ; i < this.regex_test.length ; i++ ){
            this.$set(this.regex_test[i], "result", regex.exec(this.regex_test[i].input));
          }
          break;
        }
        case "test":{
          for( var i = 0 ; i < this.regex_test.length ; i++ ){
            this.$set(this.regex_test[i], "result", regex.test(this.regex_test[i].input));
          }
          break;
        }
      }
    },
  }
};
