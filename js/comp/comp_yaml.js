export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">YAML</h2>
  <div class="row align-items-center">
    <div class="col-auto">
      <select class="form-select" v-model="yaml_dir_type" v-on:change="yaml_dir_change">
        <option value="yaml2json">YAML⇒JSON</option>
        <option value="json2yaml">JSON⇒YAML</option>
      </select>
    </div>
    <button class="btn btn-primary btn-lg col-auto" v-on:click="yaml_transform()">変換</button>
    <label class="title col-auto">yaml_depth</label>
    <div class="col-auto">
      <input type="number" class="form-control" v-model.number="yaml_depth">
    </div>
  </div>
  <br>
  <div class="row">
    <div class="col-sm-6">
      <label class="title">{{yaml_left_type}}</label>
      <textarea id="left_text" class="form-control" rows="15" v-model="yaml_left_text"></textarea>
    </div>
    <div class="col-sm-6">
      <label class="title">{{yaml_right_type}}</label>
      <textarea id="right_text" class="form-control" rows="15" v-model="yaml_right_text" readonly></textarea>
    </div>
  </div>
  <br>
  <div class="row">
    <div class="col-sm-5">
      <label class="title">{{yaml_left_type}}</label>
      <textarea id="left_parts" class="form-control" rows="6" v-model="yaml_left_parts"></textarea>
    </div>
    <span class="btn-group-vertical col-sm-1">
      <table>
        <tr><td>
          <button class="btn btn-secondary btn-lg" v-on:click="yaml_transform_parts(false)">→</button>
        </td></tr>
        <tr><td>
          <button class="btn btn-secondary btn-lg" v-on:click="yaml_transform_parts(true)">←</button>
        </td></tr>
      </table>
    </span>
    <div class="col-sm-6">
      <label class="title">{{yaml_right_type}}</label>
      <textarea id="right_parts" class="form-control" rows="6" v-model="yaml_right_parts"></textarea>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      yaml_left_text: '',
      yaml_right_text: '',
      yaml_left_parts: '',
      yaml_right_parts: '',
      yaml_dir_type: "yaml2json",
      yaml_left_type: "YAML",
      yaml_right_type: "JSON",
      yaml_depth: 10,
    }
  },
  methods: {
    /* YAML */
    yaml_dir_change: function(){
      if( this.yaml_dir_type == "yaml2json" ){
        this.yaml_left_type = "YAML";
        this.yaml_right_type = "JSON";
      }else{
        this.yaml_left_type = "JSON";
        this.yaml_right_type = "YAML";
      }
    },
    yaml_transform: function(){
      try{
        if( this.yaml_dir_type == "yaml2json"){
          var object = YAML.parse(this.yaml_left_text);
          this.yaml_right_text = JSON.stringify(object, null , "\t");
        }else{
          var object = JSON.parse(this.yaml_left_text);
          this.yaml_right_text = YAML.stringify(object, this.yaml_depth);
        }
        var left_text = document.querySelector("#left_text");
        var right_text = document.querySelector("#right_text");
        right_text.style.height = left_text.style.height;
      }catch(error){
        console.log(error);
        alert(error);
      }
    },
    yaml_transform_parts: function(to_left_dir){
      try{
        if( !to_left_dir ){
          if( this.yaml_dir_type == "yaml2json" ){
            var object = YAML.parse(this.yaml_left_parts);
            this.yaml_right_parts = JSON.stringify(object, null , "\t");
          }else{
            var object = JSON.parse(this.yaml_left_parts);
            this.yaml_right_parts = YAML.stringify(object, this.yaml_depth);
          }
          var left_parts = document.querySelector("#left_parts");
          var right_parts = document.querySelector("#right_parts");
          right_parts.style.height = left_parts.style.height;
        }else{
          if( this.yaml_dir_type == "yaml2json" ){
            var object = JSON.parse(this.yaml_right_parts);
            this.yaml_left_parts = YAML.stringify(object, this.yaml_depth);
          }else{
            var object = YAML.parse(this.yaml_right_parts);
            this.yaml_left_parts = JSON.stringify(object, null , "\t");
          }
          var left_parts = document.querySelector("#left_parts");
          var right_parts = document.querySelector("#right_parts");
          left_parts.style.height = right_parts.style.height;
        }
      }catch(error){
        console.log(error);
        alert(error);
      }
    },
  }
};
