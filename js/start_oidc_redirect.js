'use strict';

//const vConsole = new VConsole();
//window.datgui = new dat.GUI();

var vue_options = {
    el: "#top",
    mixins: [mixins_bootstrap],
    data: {
    },
    computed: {
    },
    methods: {
    },
    created: function(){
    },
    mounted: function(){
      proc_load();

      if( hashs.access_token ){
        var message = {
          id_token: hashs.id_token,
          access_token: hashs.access_token,
          token_type: hashs.bearer,
          expires_in: hashs.expires_in,
          state: hashs.state
        };
        window.opener.vue.oidc_do_token(message);
        window.close();
      }else
      if( searchs.code ){
          var message = {
              code : searchs.code,
              state: searchs.state
          };
          window.opener.vue.oidc_do_token(message);
          window.close();
      }else
      if( searchs.client_id ){
          var params = {
            client_id: searchs.client_id,
            redirect_uri: searchs.redirect_uri,
            response_type: searchs.response_type,
            state: searchs.state,
            scope: searchs.scope
        };
        if( searchs.state )
          params.state = searchs.state;
        window.location = searchs.authorize_endpoint + "?" + to_urlparam(params);
      }        
    }
};
vue_add_data(vue_options, { progress_title: '' }); // for progress-dialog
vue_add_global_components(components_bootstrap);
vue_add_global_components(components_utils);

/* add additional components */

window.vue = new Vue( vue_options );

function to_urlparam(qs){
  var params = new URLSearchParams();
  for( var key in qs )
      params.set(key, qs[key] );
  return params.toString();
}
