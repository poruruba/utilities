export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">パスワード</h2>
  <div class="row">
      <label class="col-auto col-form-label title">パスワード文字数</label>
      <span class="col-auto">
          <input type="number" class="form-control" size="2" v-model.number="passwd_num">
      </span>
      文字
  </div>
  <br>
  <div class="row">
      <span class="col-auto">
          <input type="checkbox" v-model="passwd_check_lower_letter">小文字
      </span>
      <span class="col-auto">
          <input type="checkbox" v-model="passwd_check_upper_letter">大文字　
      </span>
      <span class="col-auto">
          <input type="checkbox" v-model="passwd_check_ecept_lO">IとlとOを除く(大文字のアイと小文字のエルと大文字のオー)
      </span>
  </div>
  <div class="row">
      <span class="col-auto">
          <input type="checkbox" v-model="passwd_check_number">数字
      </span>
      <span class="col-auto">
          <input type="number" class="form-control" size="2" v-model.number="passwd_number_num">
      </span>
      個
  </div>
  <div class="row">
      <span class="col-auto">
          <input type="checkbox" v-model="passwd_check_symbol">記号
      </span>
      <span class="col-auto">
          <select class="form-select" v-model="passwd_symbol_pattern">
              <option value="-+*/_">-+*/_</option>
              <option value="=-+*/;,._">=-+*/;,._</option>
              <option value="@#$%&?!">@#$%&?!</option>
              <option value="!@#$%^&*()_+-=[]{}|">!@#$%^&*()_+-=[]{}|</option>
              <option value="!#$%&()=-\@+*/?'^~|\`;,._[]{}">!#$%&()=-\@+*/?'^~|\`;,._[]{}</option>
          </select>
      </span>
      <span class="col-auto">
          <input type="number" class="form-control" size="2" v-model.number="passwd_symbol_num">
      </span>
      個　
  </div>
  <button class="btn btn-primary" v-on:click="passwd_create()">生成</button><br>
  <br>
  <div class="input-group">
      <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(passwd_password)"></button>
      <input type="text" class="form-control" v-model="passwd_password" readonly>
  </div>
</div>`,
  data: function () {
    return {
      passwd_num: 12,
      passwd_check_lower_letter: true,
      passwd_check_upper_letter: true,
      passwd_check_number: true,
      passwd_check_ecept_lO: false,
      passwd_number_num: 1,
      passwd_check_symbol: false,
      passwd_symbol_pattern: "-+*/_",
      passwd_symbol_num: 1,
      passwd_password: '',
    }
  },
  methods: {
    /* パスワード */
    passwd_create: function () {
      var passwd_num = this.passwd_num;
      var passwd_number_num = this.passwd_check_number ? this.passwd_number_num : 0;
      var passwd_symbol_num = this.passwd_check_symbol ? this.passwd_symbol_num : 0;
      if (passwd_num < 1 || passwd_num < (passwd_number_num + passwd_symbol_num)) {
        alert('入力が不正です。');
        return;
      }
      if ((!this.passwd_check_lower_letter && !this.passwd_check_upper_letter) && passwd_num != (passwd_number_num + passwd_symbol_num)) {
        alert('入力が不正です。');
        return;
      }

      var kind = Array(passwd_num);
      kind.fill(0);
      for (var i = 0; i < passwd_number_num; i++)
        kind[i] = 'n';
      for (var i = 0; i < passwd_symbol_num; i++)
        kind[passwd_number_num + i] = 's';

      for (var i = 0; i < passwd_num; i++) {
        var index = this.make_random(passwd_num - 1);
        if (index == i || kind[i] == kind[index])
          continue;
        var temp = kind[i];
        kind[i] = kind[index];
        kind[index] = temp;
      }

      const number_pattern = '0123456789';
      var alpha_pattern = '';
      if (this.passwd_check_lower_letter) {
        if (this.passwd_check_ecept_lO)
          alpha_pattern += "abcdefghijkmnopqrstuvwxyz";
        else
          alpha_pattern += "abcdefghijklmnopqrstuvwxyz";
      }
      if (this.passwd_check_upper_letter) {
        if (this.passwd_check_ecept_lO)
          alpha_pattern += "ABCDEFGHJKLMNPQRSTUVWXYZ";
        else
          alpha_pattern += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }

      var passwd = '';
      for (var i = 0; i < kind.length; i++) {
        if (kind[i] == 'n') {
          var index = this.make_random(number_pattern.length - 1);
          passwd += number_pattern.charAt(index);
        } else if (kind[i] == 's') {
          var pattern = this.passwd_symbol_pattern;
          var index = this.make_random(pattern.length - 1);
          passwd += pattern.charAt(index);
        } else {
          var index = this.make_random(alpha_pattern.length - 1);
          passwd += alpha_pattern.charAt(index);
        }
      }

      this.passwd_password = passwd;
    },
  }
};
