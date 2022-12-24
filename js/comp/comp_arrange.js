export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">整形</h2>
  <collapse-panel id="json_arrange_panel" title="JSON" collapse="true">
      <span slot="content">
          <div class="card-body">
              <button class="btn btn-secondary" v-on:click="arrange_process('json')">整形</button><br>
              <label class="title">入出力</label>
              <textarea class="form-control" rows="20" v-model="json_inout"></textarea>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#json_arrange_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>
  <collapse-panel id="js_arrange_panel" title="Javascript" collapse="true">
      <span slot="content">
          <div class="card-body">
              <div class="row float-end">
                <span class="col-auto">
                  <input type="checkbox" v-model="js_space" id="js_space_check"><label for="js_space_check">space_in_empty_paren</label>
                </span>
                <span class="col-auto">
                  <select class="form-select" v-model:number="js_indent">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </span>
              </div>
              <button class="btn btn-secondary" v-on:click="arrange_process('javascript')">整形</button><br>
              <label class="title">入出力</label>
              <textarea class="form-control" rows="20" v-model="js_inout"></textarea>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#js_arrange_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>
  <collapse-panel id="marked_arrange_panel" title="Markdown" collapse="true">
      <span slot="content">
          <div class="card-body">
              <button class="btn btn-secondary" v-on:click="arrange_convert('marked_view')">表示</button>
              <button class="btn btn-secondary" v-on:click="arrange_convert('marked_html')">HTML</button><br>
              <label class="title">入力</label>
              <textarea class="form-control" rows="20" v-model="marked_inout"></textarea>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#marked_arrange_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>
  <collapse-panel id="html_arrange_panel" title="HTML" collapse="true">
      <span slot="content">
          <div class="card-body">
              <div class="row float-end">
                <span class="col-auto">
                  <input type="checkbox" v-model="html_space" id="html_space_check"><label for="html_space_check">space_in_empty_paren</label>
                </span>
                <span class="col-auto">
                  <select class="form-select" v-model:number="html_indent">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </span>
              </div>
              <button class="btn btn-secondary" v-on:click="arrange_process('html')">整形</button><br>
              <label class="title">入出力</label>
              <textarea class="form-control" rows="20" v-model="html_inout"></textarea>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#html_arrange_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>
  <collapse-panel id="css_arrange_panel" title="CSS" collapse="true">
      <span slot="content">
          <div class="card-body">
              <div class="row float-end">
                <span class="col-auto">
                  <input type="checkbox" v-model="css_space" id="css_space_check"><label for="css_space_check">space_in_empty_paren</label>
                </span>
                <span class="col-auto">
                  <select class="form-select" v-model:number="css_indent">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </span>
              </div>
              <button class="btn btn-secondary" v-on:click="arrange_process('css')">整形</button><br>
              <label class="title">入出力</label>
              <textarea class="form-control" rows="20" v-model="css_inout"></textarea>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#css_arrange_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>

  <modal-dialog size="lg" id="marked_dialog">
    <div slot="content">
        <div class="modal-header">
            <button class="btn btn-secondary float-end" v-on:click="dialog_close('#marked_dialog')">閉じる</button>
        </div>
        <div class="modal-body">
            <div v-show="marked_show_type=='marked_view'" v-html="marked_content"></div>
            <textarea v-if="marked_show_type=='marked_html'" rows="20" v-bind:value="marked_html" class="form-control"></textarea>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" v-on:click="dialog_close('#marked_dialog')">閉じる</button>
        </div>
    </div>
  </modal-dialog>

</div>`,
  data: function () {
    return {
      json_inout: '',
      js_inout: '',
      css_inout: '',
      html_inout: '',
      marked_inout: '',
      marked_html: null,
      marked_show_type: '',
      marked_content: '',
      js_space: true,
      css_space: true,
      html_space: true,
      js_indent: 4,
      css_indent: 4,
      html_indent: 4,
    }
  },
  methods: {
    /* 整形 */
    arrange_process: function (type) {
      try {
        if (type == 'json')
          this.json_inout = JSON.stringify(JSON.parse(this.json_inout), null, '\t');
        else if (type == 'javascript')
          this.js_inout = js_beautify(this.js_inout, { indent_size: this.js_indent, space_in_empty_paren: this.js_space });
        else if (type == 'css')
          this.css_inout = css_beautify(this.css_inout, { indent_size: this.css_indent, space_in_empty_paren: this.css_space });
        else if (type == 'html')
          this.html_inout = html_beautify(this.html_inout, { indent_size: this.html_indent, space_in_empty_paren: this.html_space });
      } catch (error) {
        alert(error);
      }
    },
    arrange_convert: function (type) {
      try {
        if (type == 'marked_view') {
          this.marked_show_type = type;
          this.marked_content = marked.parse(this.marked_inout);
          this.dialog_open('#marked_dialog');
        } else
          if (type == 'marked_html') {
            this.marked_show_type = type;
            this.marked_html = marked.parse(this.marked_inout);;
            this.dialog_open('#marked_dialog');
          }
      } catch (error) {
        alert(error);
      }
    },
  }
};
