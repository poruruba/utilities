export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">クリップ</h2>
  <span class="oi oi-trash">クッキーから消去</span>&nbsp;&nbsp;
  <span class="oi oi-clipboard">クッキーに保存</span>&nbsp;&nbsp;
  <span class="oi oi-paperclip">クリップボードにコピー</span>&nbsp;&nbsp;
  <br><br>
  <button class="btn btn-secondary" v-on:click="clip_clearall()">クッキーから全消去</button><br>
  <label class="title">入力0</label>
  <div class="input-group">
      <span class="input-group-btn">
          <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(0)"></button>
          <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(0)"></button>
          <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[0])"></button>
      </span>
      <input type="text" class="form-control" v-model="clip_data[0]">
  </div>
  <label class="title">入力1</label>
  <div class="input-group">
      <span class="input-group-btn">
          <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(1)"></button>
          <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(1)"></button>
          <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[1])"></button>
      </span>
      <input type="text" class="form-control" v-model="clip_data[1]">
  </div>
  <label class="title">入力2</label>
  <div class="input-group">
      <span class="input-group-btn">
          <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(2)"></button>
          <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(2)"></button>
          <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[2])"></button>
      </span>
      <input type="text" class="form-control" v-model="clip_data[2]">
  </div>
  <label class="title">入力3</label>
  <div class="input-group">
      <span class="input-group-btn">
          <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(3)"></button>
          <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(3)"></button>
          <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[3])"></button>
      </span>
      <input type="text" class="form-control" v-model="clip_data[3]">
  </div>
  <label class="title">入力4</label>
  <div class="input-group">
      <span class="input-group-btn">
          <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(4)"></button>
          <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(4)"></button>
          <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[4])"></button>
      </span>
      <input type="text" class="form-control" v-model="clip_data[4]">
  </div>
  <label class="title">入力5</label>
  <span class="input-group-btn">
      <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(5)"></button>
      <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(5)"></button>
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[5])"></button>
  </span>
  <textarea class="form-control" rows="2" v-model="clip_data[5]"></textarea>
  <label class="title">入力6</label>
  <span class="input-group-btn">
      <button class="btn btn-secondary oi oi-trash" v-on:click="clip_clear(6)"></button>
      <button class="btn btn-secondary oi oi-clipboard" v-on:click="clip_save(6)"></button>
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(clip_data[6])"></button>
  </span>
  <textarea class="form-control" rows="5" v-model="clip_data[6]"></textarea>
</div>`,
  data: function () {
    return {
      clip_data: [],
    }
  },
  methods: {
    /* クリップ */
    clip_save: function (index) {
      console.log("console saved");
      this.message = "saved";
      Cookies.set('clip_data' + index, this.clip_data[index], { expires: 365 });
    },
    clip_clearall: function () {
      for (var i = 0; i <= 6; i++)
        this.clip_clear(i);
      this.clip_data = JSON.parse(JSON.stringify(this.clip_data));
    },
    clip_clear: function (index) {
      this.clip_data[index] = '';
      Cookies.remove('clip_data' + index);
      this.clip_data = JSON.parse(JSON.stringify(this.clip_data));
    },
  },
  mounted: function () {
    for (var i = 0; i <= 6; i++) {
      this.$set(this.clip_data, i, Cookies.get('clip_data' + i));
    }
  }
};