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
    }
  },
  methods: {
    /* 整形 */
    arrange_process: function (type) {
      try {
        if (type == 'json')
          this.json_inout = JSON.stringify(JSON.parse(this.json_inout), null, '\t');
        else if (type == 'javascript')
          this.js_inout = js_beautify(this.js_inout, { indent_size: 2, space_in_empty_paren: true });
        else if (type == 'css')
          this.css_inout = css_beautify(this.css_inout, { indent_size: 2, space_in_empty_paren: true });
        else if (type == 'html')
          this.html_inout = html_beautify(this.html_inout, { indent_size: 2, space_in_empty_paren: true });
      } catch (error) {
        alert(error);
      }
    },
    arrange_convert: function (type) {
      try {
        if (type == 'marked_view') {
          this.marked_show_type = type;
          this.marked_content = marked(this.marked_inout);
          this.dialog_open('#marked_dialog');
        } else
          if (type == 'marked_html') {
            this.marked_show_type = type;
            this.marked_html = marked(this.marked_inout);;
            this.dialog_open('#marked_dialog');
          }
      } catch (error) {
        alert(error);
      }
    },
  }
};
