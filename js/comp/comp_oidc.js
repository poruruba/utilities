const REDIRECT_URL = "oidc_redirect.html";
var decoder = new TextDecoder('utf-8');
var new_win;
const EXPIRES = 365;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">OpenID Connect</h2>

  <label class="title">authorize_endpoint</label>
  <div class="input-group">
    <input type="text" class="form-control" v-model="oidc_authorize_endpoint">
    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="(item, index) in oidc_authorize_endpoint_list">
        <a class="dropdown-item" v-on:click="oidc_select_item('authorize_endpoint','select', index)">
          <span v-on:click.stop="oidc_select_item('authorize_endpoint', 'delete', index)">× </span>&nbsp;&nbsp;{{item}}
        </a>
      </li>
    </ul>
  </div>
  <label class="title">client_id</label> 
  <div class="input-group">
    <input type="text" v-model="oidc_client_id" class="form-control">
    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="(item, index) in oidc_client_id_list">
        <a class="dropdown-item" v-on:click="oidc_select_item('client_id', 'select', index)">
          <span v-on:click.stop="oidc_select_item('client_id', 'delete', index)">× </span>&nbsp;&nbsp;{{item}}
        </a>
      </li>
    </ul>
  </div>
  <div class="row">
    <label class="title col-auto">response_type</label>
    <div class="col-auto">
      <select class="form-select" v-model="oidc_response_type">
          <option value="token">token</option>
          <option value="code">code</option>
      </select>
    </div>
  </div>
  <label class="title">redirect_uri</label> {{oidc_redirect_uri}}<br>
  <label class="title">scope</label> <input type="text" v-model="oidc_scope" class="form-control">
  <label class="title">state</label> <input type="text" v-model="oidc_state" class="form-control">
  <button class="btn btn-primary" v-on:click="oidc_authorize">Authorize</button>

  <hr>
  <label class="title">code</label> <input type="text" class="form-control" v-model="oidc_code">
  <label class="title">token_endpoint</label>
  <div class="input-group">
    <input type="text" class="form-control" v-model="oidc_token_endpoint">
    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="(item, index) in oidc_token_endpoint_list">
        <a class="dropdown-item" v-on:click="oidc_select_item('token_endpoint', 'select', index)">
          <span v-on:click.stop="oidc_select_item('token_endpoint', 'delete', index)">× </span>&nbsp;&nbsp;{{item}}
        </a>
      </li>
    </ul>
  </div>
  <label class="title">client_secret</label>
  <div class="input-group">
    <input type="text" class="form-control" v-model="oidc_client_secret">
    <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="(item, index) in oidc_client_secret_list">
        <a class="dropdown-item" v-on:click="oidc_select_item('client_secret', 'select', index)">
          <span v-on:click.stop="oidc_select_item('client_secret', 'delete', index)">× </span>&nbsp;&nbsp;{{item}}
        </a>
      </li>
    </ul>
  </div>
  <label class="title">grant_type</label> {{oidc_grant_type}}<br>
  <button class="btn btn-primary" v-on:click="oidc_token">Token</button>
  <hr>
  <label class="title">expires_in</label> {{oidc_expires_in}}<br>
  <collapse-panel v-if="oidc_idtoken" id="oidc_panel_idtoken" title="IDトークン" collapse="true">
    <span slot="content">
        <div class="card-body">
            <textarea class="form-control" rows="10" readonly>{{oidc_idtoken}}</textarea>
        </div>
        <div class="card-footer">
            <button class="btn btn-secondary" data-bs-toggle="collapse" href="#oidc_panel_idtoken">閉じる</button>
        </div>
    </span>
  </collapse-panel>
  <collapse-panel v-if="oidc_accesstoken" id="oidc_panel_accesstoken" title="アクセストークン" collapse="true">
    <span slot="content">
        <div class="card-body">
            <textarea class="form-control" rows="10" readonly>{{oidc_accesstoken}}</textarea>
        </div>
        <div class="card-footer">
            <button class="btn btn-secondary" data-bs-toggle="collapse" href="#oidc_panel_accesstoken">閉じる</button>
        </div>
    </span>
  </collapse-panel>
  <collapse-panel v-if="oidc_refreshtoken" id="oidc_panel_refreshtoken" title="リフレッシュトークン" collapse="true">
    <span slot="content">
        <div class="card-body">
            <textarea class="form-control" rows="10" readonly>{{oidc_refreshtoken}}</textarea>
        </div>
        <div class="card-footer">
            <button class="btn btn-secondary" data-bs-toggle="collapse" href="#oidc_panel_refreshtoken">閉じる</button>
        </div>
    </span>
  </collapse-panel>
  <label class="title">{{oidc_token_type}}</label>
  <div class="row">
    <div v-if="oidc_idtoken_header" class="col-3">
      <label class="title">ヘッダ</label>
      <textarea class="form-control" rows="20" readonly>{{oidc_idtoken_header}}</textarea>
    </div>
    <div v-if="oidc_idtoken_payload" class="col-9">
      <label class="title">ペイロード</label>
      <textarea class="form-control" rows="20" readonly>{{oidc_idtoken_payload}}</textarea>
    </div>
  </div>

</div>`,
  data: function () {
    return {
      oidc_authorize_endpoint: "",
      oidc_response_type: "code",
      oidc_client_id: "",
      oidc_redirect_uri: "",
      oidc_scope: "openid profile email",
      oidc_state: "",
      oidc_code: "",
      oidc_client_secret: "",
      oidc_token_endpoint: "",
      oidc_grant_type: "authorization_code",
      oidc_idtoken: null,
      oidc_accesstoken: null,
      oidc_refreshtoken: null,
      oidc_idtoken_header: "",
      oidc_idtoken_payload: "",
      oidc_expires_in: 0,
      oidc_token_type: "",
      oidc_authorize_endpoint_list: [],
      oidc_token_endpoint_list: [],
      oidc_client_id_list: [],
      oidc_client_secret_list: [],
    }
  },
  methods: {
    /* OpenID Connect */
    oidc_authorize: async function(){
      var params = {
        authorize_endpoint: this.oidc_authorize_endpoint,
        redirect_uri: this.oidc_redirect_uri,
        response_type: this.oidc_response_type,
        state: this.oidc_state,
        client_id: this.oidc_client_id,
        scope: this.oidc_scope,
      };
      new_win = open(REDIRECT_URL + '?' + to_urlparam(params), null, 'width=450,height=750');
    },
    oidc_token: async function(){
      var params = {
          grant_type: this.oidc_grant_type,
          client_id: this.oidc_client_id,
          redirect_uri: this.oidc_redirect_uri,
          code: this.oidc_code,
      };
      return do_post_urlencoded_basic(this.oidc_token_endpoint, params, this.oidc_client_id, this.oidc_client_secret )
      .then(result =>{
          console.log(result);
          this.oidc_expires_in = result.expires_in;
          this.oidc_idtoken = result.id_token;
          this.oidc_accesstoken = result.access_token;
          this.oidc_refreshtoken = result.refresh_token;

          this.oidc_token_type = "IDトークン";
          var jwt = this.oidc_idtoken.split('.');
          var header = decoder.decode(base64url.decode(jwt[0].trim()));
          var payload = decoder.decode(base64url.decode(jwt[1].trim()));
          this.oidc_idtoken_header = JSON.stringify(JSON.parse(header), null, '\t');
          this.oidc_idtoken_payload = JSON.stringify(JSON.parse(payload), null, '\t');

          if( this.oidc_token_endpoint_list.indexOf(this.oidc_token_endpoint) < 0 ){
            this.oidc_token_endpoint_list.push(this.oidc_token_endpoint);
            Cookies.set("oidc_token_endpoint_list", this.oidc_token_endpoint_list, { expires: EXPIRES });
          }
          if( this.oidc_client_secret_list.indexOf(this.oidc_client_secret) < 0 ){
            this.oidc_client_secret_list.push(this.oidc_client_secret);
            Cookies.set("oidc_client_secret_list", this.oidc_client_secret_list, { expires: EXPIRES });
          }
      })
      .catch(error =>{
        console.error(error);
        alert(error);
      });
    },
    oidc_do_token: function(message){
      if( this.oidc_state && this.oidc_state != message.state ){
        alert("OIDC: state is mismatch");
        return;
      }
      if(message.access_token){
        this.oidc_expires_in = message.expires_in;
        this.oidc_idtoken = message.id_token;
        this.oidc_accesstoken = message.access_token;
        this.oidc_refreshtoken = null;

        var token;
        if( this.oidc_idtoken ){
          this.oidc_token_type = "IDトークン";
          token = this.oidc_idtoken;
        }else{
          this.oidc_token_type = "アクセストークン";
          token = this.oidc_accesstoken;
        }
        var jwt = token.split('.');
        var header = decoder.decode(base64url.decode(jwt[0].trim()));
        var payload = decoder.decode(base64url.decode(jwt[1].trim()));
        this.oidc_idtoken_header = JSON.stringify(JSON.parse(header), null, '\t');
        this.oidc_idtoken_payload = JSON.stringify(JSON.parse(payload), null, '\t');
      }else{
        this.oidc_code = message.code;
      }

      if( this.oidc_authorize_endpoint_list.indexOf(this.oidc_authorize_endpoint) < 0 ){
        this.oidc_authorize_endpoint_list.push(this.oidc_authorize_endpoint);
        Cookies.set("oidc_authorize_endpoint_list", this.oidc_authorize_endpoint_list, { expires: EXPIRES });
      }
      if( this.oidc_client_id_list.indexOf(this.oidc_client_id) < 0 ){
        this.oidc_client_id_list.push(this.oidc_client_id);
        Cookies.set("oidc_client_id_list", this.oidc_client_id_list, { expires: EXPIRES });
      }
    },
    oidc_select_item: function(target, type, index){
      switch(target){
        case "authorize_endpoint":{
          if( type == "select" ){
            this.oidc_authorize_endpoint = this.oidc_authorize_endpoint_list[index];
          }else if( type == "delete"){
            this.oidc_authorize_endpoint_list.splice(index, 1);
            Cookies.set("oidc_authorize_endpoint_list", this.oidc_authorize_endpoint_list, { expires: EXPIRES });
          }
          break;
        }
        case "token_endpoint":{
          if( type == "select" ){
            this.oidc_token_endpoint = this.oidc_token_endpoint_list[index];
          }else if( type == "delete"){
            this.oidc_token_endpoint_list.splice(index, 1);
            Cookies.set("oidc_token_endpoint_list", this.oidc_token_endpoint_list, { expires: EXPIRES });
          }
          break;
        }
        case "client_id":{
          if( type == "select" ){
            this.oidc_client_id = this.oidc_client_id_list[index];
          }else if( type == "delete"){
            this.oidc_client_id_list.splice(index, 1);
            Cookies.set("oidc_client_id_list", this.oidc_client_id_list, { expires: EXPIRES });
          }
          break;
        }
        case "client_secret":{
          if( type == "select" ){
            this.oidc_client_secret = this.oidc_client_secret_list[index];
          }else if( type == "delete"){
            this.oidc_client_secret_list.splice(index, 1);
            Cookies.set("oidc_client_secret_list", this.oidc_client_secret_list, { expires: EXPIRES });
          }
          break;
        }
      }
    },
  },
  mounted: function () {
    var url = new URL("./", location);
    this.oidc_redirect_uri = url.href + REDIRECT_URL;

    var list = Cookies.get('oidc_authorize_endpoint_list');
    if( list )
      this.oidc_authorize_endpoint_list = JSON.parse(list);
    var list = Cookies.get('oidc_token_endpoint_list');
    if( list )
      this.oidc_token_endpoint_list = JSON.parse(list);
    var list = Cookies.get('oidc_client_id_list');
    if( list )
      this.oidc_client_id_list = JSON.parse(list);
    var list = Cookies.get('oidc_client_secret_list');
    if( list )
      this.oidc_client_secret_list = JSON.parse(list);
  }
};

function to_urlparam(qs){
  var params = new URLSearchParams();
  for( var key in qs )
      params.set(key, qs[key] );
  return params.toString();
}

function do_post_urlencoded_basic(url, params, client_id, client_secret){
  var data = new URLSearchParams();
  for( var name in params )
      data.append(name, params[name]);

  var basic = 'Basic ' + btoa(client_id + ':' + client_secret);
  const headers = new Headers( { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : basic } );
  
  return fetch(url, {
      method : 'POST',
      body : data,
      headers: headers
  })
  .then((response) => {
      if( response.status != 200 )
          throw 'status is not 200';
      return response.json();
  })
}
