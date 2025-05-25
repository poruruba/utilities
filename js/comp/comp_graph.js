let scatter_chartjs;
let graph_chartjs;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">グラフ</h2>

  <ul class="nav nav-tabs">
    <li class="nav-item"><a class="nav-link active" href="#graph_graph" data-bs-toggle="tab">Graph</a></li>
    <li class="nab-item"><a href="#graph_scatter" class="nav-link" data-bs-toggle="tab">Scatter</a></li>
  </ul>

  <div class="tab-content">
    <div class="tab-pane active" id="graph_graph">

      <collapse-panel id="panel_graph_options" title="options" collapse="true">
        <span slot="content">
          <div class="card-body">
            <button class="btn btn-primary btn-sm" v-on:click="update_options">update</button>
            <button class="btn btn-primary btn-sm" v-on:click="clear_options">clear</button>
            <br>
            <span class="row">
              <label class="title"><input type="checkbox" v-model="chartjs_base0"> base0</label><br>
              <label class="title"><input type="checkbox" v-model="chartjs_stacked"> stacked</label><br>
              <label class="title col-auto">max <input type="text" class="form-control" v-model="chartjs_max"></label>
              <label class="title col-auto">min <input type="text" class="form-control" v-model="chartjs_min"></label>
            </span>
          </div>
        </span>
      </collapse-panel>

      <collapse-panel id="panel_graph_data" title="data" collapse="true">
        <span slot="content">
          <div class="card-body">
            <button class="btn btn-primary btn-sm" v-on:click="clear_data">clear</button>
            <br>
            <label class="title"><input type="checkbox" v-model="chk_header"> header</label> <label class="title"><input type="checkbox" v-model="chk_label"> label</label> <label class="title"><input type="checkbox" v-model="chk_stepped"> stepped</label>
            <br>
            <label class="title">csv/tsv</label> <comp_file v-bind:callback="graph_callback" accept=".csv,.tsv"></comp_file>
            <br>
            <ol>
              <li v-for="(item, index) in graph_data.datasets"><button class="btn btn-secondary btn-xs" v-on:click="graph_delete_row(index)">del</button> {{item.label}}</li>
            </ol>
          </div>
        </span>
      </collapse-panel>

      <span class="row">
        <label class="title col-auto">type</label>
        <span class="col-auto">
            <select class="form-select" v-model="chartjs_type" v-on:change="change_type">
              <option value="line">line</option>
              <option value="bar">bar</option>
              <option value="pie">pie</option>
            </select>
        </span>
      </span>

      <div>
        <canvas id="graph_chart"></canvas>
      </div>
    </div>

    <div class="tab-pane" id="graph_scatter">

      <collapse-panel id="panel_scatter_options" title="options" collapse="true">
        <span slot="content">
          <div class="card-body">
            <button class="btn btn-primary btn-sm" v-on:click="update_scatter_options">update</button>
            <button class="btn btn-primary btn-sm" v-on:click="clear_scatter_options">clear</button>
            <br>
            <span class="row">
              <label class="title"><input type="checkbox" v-model="chartjs_scatter_base0"> base0</label><br>
              <label class="title col-auto">max <input type="text" class="form-control" v-model="chartjs_scatter_max"></label>
              <label class="title col-auto">min <input type="text" class="form-control" v-model="chartjs_scatter_min"></label>
            </span>
          </div>
        </span>
      </collapse-panel>

      <collapse-panel id="panel_scatter_data" title="data" collapse="true">
        <span slot="content">
          <div class="card-body">
            <button class="btn btn-primary btn-sm" v-on:click="clear_scatter_data">clear</button>
            <br>

            <label class="title"><input type="checkbox" v-model="chk_header"> header</label> <label class="title"><input type="checkbox" v-model="chk_stepped"> stepped</label>
            <br>
            <label class="title">tsv</label> <comp_file v-bind:callback="tsv_scatter_callback" accept=".tsv"></comp_file>
            <br>
            <ol>
              <li v-for="(item, index) in scatter_data.datasets"><button class="btn btn-secondary btn-xs" v-on:click="graph_delete_row(index)">del</button> {{item.label}}</li>
            </ol>

            </li>
          </div>
        </span>
      </collapse-panel>

      <div>
        <canvas id="scatter_chart"></canvas>
      </div>
    </div>
  </div>
  <br>
</div>`,
  data: function () {
    return {
      chartjs_type: "line",
      graph_data: {
          labels: [],
          datasets: []
      },
      graph_options: {
          scales : {
              x: {},
              y: {}
          },
          plugins: {
              colors: {
                forceOverride: true
              }
          }
      },
      scatter_data: {
          labels: [],
          datasets: []
      },
      scatter_options: {
          scales : {
              x: {},
              y: {}
          },
          plugins: {
              colors: {
                forceOverride: true
              }
          }
      },        
      chk_header: false,
      chk_stepped: false,
      chk_label: false,
      chartjs_stacked: false,
      chartjs_base0: false,
      chartjs_max: "",
      chartjs_min: "",
      chartjs_scatter_base0: false,
      chartjs_scatter_max: "",
      chartjs_scatter_min: "",
    }
  },
  methods: {
    /* グラフ */
    update_scatter_options: async function(){
      console.log("update_scatter_options called");
      this.scatter_options = {
          scales : {
              x: {},
              y: {}
          },
          plugins: {
              colors: {
                forceOverride: true
              }
          }
      };
      if( this.chartjs_scatter_base0 )
          this.scatter_options.scales.y.beginAtZero = true;
      if( this.chartjs_scatter_max !== undefined && this.chartjs_scatter_max != ""  )
          this.scatter_options.scales.y.suggestedMax = parseInt(this.chartjs_scatter_max, 10);
      if( this.chartjs_scatter_min !== undefined && this.chartjs_scatter_min != ""  )
          this.scatter_options.scales.y.suggestedMin = parseInt(this.chartjs_scatter_min, 10);
      if( scatter_chartjs ){
          scatter_chartjs.options = this.scatter_options;
          scatter_chartjs.update();
      }
    },
    graph_delete_row: async function(index){
        console.log("graph_delete_row called");
        this.graph_data.datasets.splice(index, 1);
        if( graph_chartjs ){
            graph_chartjs.data = this.graph_data;
            graph_chartjs.update();
        }
    },
    clear_scatter_data: async function(){
        console.log("clear_scatter_data called");
        this.scatter_data = {
            labels: [],
            datasets: [],
        };
        scatter_chartjs.data = this.scatter_data;
        scatter_chartjs.update();
    },
    clear_scatter_options: async function(){
        console.log("clear_scatter_options called");
        this.chartjs_scatter_base0 = false;
        this.chartjs_scatter_max = "";
        this.chartjs_scatter_min = "";
        this.scatter_options = {
            scales : {
                x: {},
                y: {}
            }
        };
        scatter_chartjs.options = this.scatter_options;
        scatter_chartjs.update();
    },        

    update_options: async function(){
        console.log("update_options called");
        this.graph_options = {
            scales : {
                x: {},
                y: {}
            },
            plugins: {
                colors: {
                  forceOverride: true
                }
            }
        };
        if( this.chartjs_base0 )
            this.graph_options.scales.y.beginAtZero = true;
        if( this.chartjs_stacked ){
            this.graph_options.scales.x.stacked = true;
            this.graph_options.scales.y.stacked = true;
        }
        if( this.chartjs_max !== undefined && this.chartjs_max != ""  )
            this.graph_options.scales.y.suggestedMax = parseInt(this.chartjs_max, 10);
        if( this.chartjs_min !== undefined && this.chartjs_min != ""  )
            this.graph_options.scales.y.suggestedMin = parseInt(this.chartjs_min, 10);
        if( graph_chartjs ){
            graph_chartjs.options = this.graph_options;
            graph_chartjs.update();
        }
    },
    clear_options: async function(){
        console.log("clear_options called");
        this.chartjs_base0 = false;
        this.chartjs_max = "";
        this.chartjs_min = "";
        this.graph_options = {
            scales : {
                x: {},
                y: {}
            }
        };
        if( graph_chartjs ){
            graph_chartjs.options = this.graph_options;
            graph_chartjs.update();
        }
    },
    clear_data: async function(){
        console.log("clear_data called");
        this.graph_data = {
            labels: [],
            datasets: [],
        };
        if( graph_chartjs ){
            graph_chartjs.data = this.graph_data;
            graph_chartjs.update();
        }
    },
    change_type: async function(){
        console.log("change_type called");
        if( graph_chartjs )
            graph_chartjs.destroy();

        graph_chartjs = new Chart(document.getElementById('graph_chart'), {
            type: this.chartjs_type,
            data: this.graph_data,
            options: this.graph_options
        });
    },
    graph_callback: async function(files){
        console.log("graph_callback called");
        if( files.length <= 0 )
            return;

        if( files[0].name.toLowerCase().endsWith(".csv") )
            this.csv_callback(files[0]);
        else if( files[0].name.toLowerCase().endsWith(".tsv") )
            this.tsv_callback(files[0]);
        else
            throw new Error("unknown file ext");
    },
    csv_callback: async function(file){
        console.log("csv_callback called");

        var text = await read_file(file, "text");
        console.log(text);

        var rows =  csv_sync.parse(text);
        // console.log(rows);

        this.graph_data.datasets = [];
        this.graph_data.labels = [];

        for( var i = 0 ; i < rows[0].length ; i++ ){
          if( this.chk_label && i == 0)
            continue;
          var data = [];
          var label = this.chk_header ? rows[0][i] : this.graph_data.datasets.length + 1;
          for( var j = 0 ; j < rows.length ; j++ ){
            if( this.chk_header && j == 0 )
              continue;

            data.push(parseInt(rows[j][i], 10));
          }
          this.graph_data.datasets.push({
              label: label,
              data: data,
              stepped: this.chk_stepped
          });
        }
        for( var i = 0 ; i < rows.length ; i++ ){
          if( this.chk_header && i == 0 )
            continue;
          if( this.chk_label )
            this.graph_data.labels.push(rows[i][0]);
          else
            this.graph_data.labels.push(this.chk_header ? i : i + 1);
        }

        if( graph_chartjs ){
            graph_chartjs.data = this.graph_data;
            graph_chartjs.update();
        }
    },
    tsv_callback: async function(file){
        console.log("tsv_callback called");

        var text = await read_file(file, "text");
        console.log(text);

        var rows =  csv_sync.parse(text, { delimiter: "\t" });
        console.log(rows);

        this.graph_data.datasets = [];
        this.graph_data.labels = [];

        var datum = [];
        for( var i = 0 ; i < rows[0].length ; i++ )
            datum[i] = [];
        for( var i = 0 ; i < rows.length ; i++ ){
            if( this.chk_header && i == 0 )
                continue;
            for( var j = 0 ; j < rows[i].length ; j++ ){
                datum[j].push(rows[i][j]);
            }
        }
        for( var i = 0 ; i < rows[0].length ; i++ ){
            this.graph_data.datasets.push({
                label: this.chk_header ? rows[0][i] : this.graph_data.datasets.length + 1,
                data: datum[i],
                stepped: this.chk_stepped
            });
        }
        for( var i = 0 ; i < datum[0].length ; i++ ){
            if( this.graph_data.labels.length <= i)
                this.graph_data.labels[i] = i;
        }
        if( graph_chartjs ){
            graph_chartjs.data = this.graph_data;
            graph_chartjs.update();
        }
    },
    tsv_scatter_callback: async function(files){
        console.log("tsv_scatter_callback called");
        if( files.length <= 0 )
            return;

        var text = await read_file(files[0], "text");
        console.log(text);

        var rows =  csv_sync.parse(text, { delimiter: "\t" });
        console.log(rows);

        var datum = [];
        for( var i = 1 ; i < rows[0].length ; i++ )
            datum[i - 1] = [];
        for( var i = 0 ; i < rows.length ; i++ ){
            if( this.chk_header && i == 0 )
                continue;
            for( var j = 1 ; j < rows[i].length ; j++ ){
                datum[j - 1].push({
                    x: rows[i][0],
                    y: rows[i][j]
                });
            }
        }
        for( var i = 1 ; i < rows[0].length ; i++ ){
            this.scatter_data.datasets.push({
                label: this.chk_header ? rows[0][i] : this.scatter_data.datasets.length + 1,
                data: datum[i - 1],
            });
        }
        scatter_chartjs.data = this.scatter_data;
        scatter_chartjs.update();
    },
  },
  mounted: function(){
    graph_chartjs = new Chart(document.getElementById('graph_chart'), {
      type: this.chartjs_type,
      data: this.graph_data,
      options: this.graph_options
    });
    scatter_chartjs = new Chart(document.getElementById('scatter_chart'), {
      type: "scatter",
      data: this.scatter_data,
      options: this.scatter_options
    });
  }
};
