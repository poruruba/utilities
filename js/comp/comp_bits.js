export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">ビット演算</h2>
  <label class="title">入力1</label> <input type="text" class="form-control" v-model="bits_input1"></br>
  <div class="row">
    <span class="col-auto">
      <select class="form-select" v-model="bits_operation">
        <option value="and">AND</option>
        <option value="or">OR</option>
        <option value="exor">ExclusiveOr</option>
        <option value="not">Not</option>
        <option value="leftshift">LeftShift</option>
        <option value="rightshift">RightShift</option>
      </select>
    </span>
  </div><br>
  <span v-if="bits_operation=='and' || bits_operation=='or' || bits_operation=='exor'">
    <label class="title">入力2</label> <input type="text" class="form-control" v-model="bits_input2"></br>
  </span>
  <button class="btn btn-primary" v-on:click="bits_execute">実行</button><br>
  <br>
  <label class="title">結果</label> <input type="text" class="form-control" v-model="bits_output"></br>
  <button class="btn btn-secondary btn-sm" v-on:click="bits_copy(1)">入力1にコピー</button>
  <span v-if="bits_operation=='and' || bits_operation=='or' || bits_operation=='exor'">
    <button class="btn btn-secondary btn-sm" v-on:click="bits_copy(2)">入力2にコピー</button><br>
  </span>

</div>`,
  data: function () {
    return {
      bits_input1: "",
      bits_input2: "",
      bits_operation: "and",
      bits_output: "",
    }
  },
  methods: {
    // ビット演算
    bits_execute: function(){
      var input1 = this.hex2ba(this.bits_input1);
      var input2 = this.hex2ba(this.bits_input2);
      var len = Math.max(input1.length, input2.length);
      var output = [];
      if( this.bits_operation != 'rightshift'){
        for( var i = 0 ; i < len ; i++ ){
          var value;
          if( this.bits_operation == "and")
            value = input1[i] & input2[i];
          else if( this.bits_operation == "or")
            value = input1[i] | input2[i];
          else if( this.bits_operation == "exor")
            value = input1[i] ^ input2[i];
          else if( this.bits_operation == "not")
            value = ~input1[i];
          else if( this.bits_operation == 'leftshift'){
            value = input1[i] << 1;
            if( i < len - 1 )
              value |= ((input1[i + 1] & 0x80) != 0x00) ? 0x01 : 0x00;
          }
          output[i] = value & 0xff;
        }
      }else if( this.bits_operation == 'rightshift'){
        for( var i = len - 1 ; i >= 0 ; i-- ){
          value = input1[i] >> 1;
          if( i > 0 )
            value |= ((input1[i - 1] & 0x01) != 0x00) ? 0x80 : 0x00;
          output[i] = value & 0xff;
        }
      }
      this.bits_output = this.ba2hex(output);
    },
    bits_copy: function(num){
      if( num == 1 )
        this.bits_input1 = this.bits_output;
      else if( num == 2 )
        this.bits_input2 = this.bits_output;
    },
  }

};
