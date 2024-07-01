var decoder = new TextDecoder('utf-8');

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">BLE Central</h2>
  <button class="btn btn-primary" v-on:click="ble_connect()" v-if="!ble_isConnected">Connect</button>
  <button class="btn btn-primary" v-on:click="ble_disconnect()" v-else>Disconnect</button>
  <br><br>
  <label class="title">ServiceUUID</label> <input type="text" class="form-control" v-model="ble_target_serviceuuid"><br>
  <collapse-panel id="additional_services_panel" title="Additional Services" collapse="true">
    <span slot="content">
      <div class="card-body">
          <textarea class="form-control" v-model="ble_additional_services"></textarea>
      </div>
    </span>
  </collapse-panel>

  <div v-if="ble_device">
      <label class="title">id</label> {{ble_device.id}}<br>
      <label class="title">name</label> {{ble_device.name}}<br>
  </div>
  <button class="btn btn-secondary" v-on:click="ble_allread()" v-if="ble_isConnected">All Read</button>
  <button class="btn btn-secondary" v-on:click="ble_allnotify()" v-if="ble_isConnected">All Notify</button>
  <br><br>

  <div class="card m-3" v-for="(service, index) in ble_services">
    <h3 class="card-header">{{find_service_name(service.uuid)}}</h3>
    <div class="card-body">
      <label class="title">uuid</label> {{service.uuid}}
      <br><br>
      <table class="table table-striped">
        <tbody>
            <tr v-for="(characteristic, index) in service.characteristics">
            <td>
                <span data-bs-toggle="tooltip" v-bind:title="characteristic.properties">
                <label class="title">{{characteristic.uuid}}</label>
                <span v-if="find_characteristic_name(characteristic.uuid)"><br>{{find_characteristic_name(characteristic.uuid)}}</span>
                </span>
            </td>
            <td>
                <span v-bind:class="{ 'has-success': characteristic.value_changed }">
                    <span data-bs-toggle="tooltip" v-bind:title="ble_toStr(characteristic)">
                    <input type="text" class="form-control" v-model="characteristic.value_hex">
                    </span>
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" v-if="characteristic.characteristic.properties.read" v-on:click="value_read(characteristic)">Read</button>
                <button class="btn btn-secondary btn-sm" v-if="characteristic.characteristic.properties.write || characteristic.characteristic.properties.writeWithoutResponse || characteristic.characteristic.properties.authenticatedSignedWrites" v-on:click="value_write(characteristic)">Write</button>
                <button class="btn btn-secondary btn-sm" v-if="characteristic.characteristic.properties.notify" v-on:click="notify_enable(characteristic)"><span v-if="characteristic.notify_enabled">Disable Notify</span><span v-else>Enable Notify</span></button>
            </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      ble_device: null,
      ble_services: [],
      ble_isConnected: false,
      ble_additional_services: '',
      ble_target_serviceuuid: "",
    }
  },
  methods: {
    /* BLE Central */
    ble_toStr: function (characteristic) {
      if (!characteristic.characteristic.value)
        return null;
      return decoder.decode(characteristic.characteristic.value);
    },
    ble_allnotify: async function () {
      for (var i = 0; i < this.ble_services.length; i++) {
        for (var j = 0; j < this.ble_services[i].characteristics.length; j++) {
          var characteristic = this.ble_services[i].characteristics[j];
          if (characteristic.characteristic.properties.notify) {
            this.notify_enable(characteristic, true);
          }
        }
      }
      this.toast_show("All startNotificationしました。");
    },
    ble_allread: async function () {
      for (var i = 0; i < this.ble_services.length; i++) {
        for (var j = 0; j < this.ble_services[i].characteristics.length; j++) {
          var characteristic = this.ble_services[i].characteristics[j];
          if (characteristic.characteristic.properties.read) {
            try {
              await characteristic.characteristic.readValue();
              this.$set(characteristic, "value_changed", false);
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      this.toast_show("All readValueしました。");
    },
    ble_disconnect: function () {
      if (this.ble_device != null && this.ble_device.gatt.connected) {
        this.ble_device.gatt.disconnect();
        this.ble_device = null;
        this.ble_services = [];
        this.ble_isConnected = false;
      }
    },
    ble_connect: async function () {
      var device;
      try {
        this.ble_disconnect();

        var additional_services = [];
        if (this.ble_additional_services) {
          additional_services = this.ble_additional_services.split(/\r\n|\r|\n/);
          for (var i = 0; i < additional_services.length; i++) {
            if (additional_services[i].length == 4)
              additional_services[i] = parseInt(additional_services[i], 16);
            else
              additional_services[i] = additional_services[i].toLowerCase();
          }
        }
        var optionalServices = additional_services.concat(Object.keys(serviceUuidList).map(x => parseInt(x)));

        console.log('Execute : requestDevice');
        var params = {
          optionalServices: optionalServices
        };
        if( this.ble_target_serviceuuid )
          params.filters = [{services: [this.ble_target_serviceuuid]}];
        else
          params.acceptAllDevices = true;
        device = await navigator.bluetooth.requestDevice(params);
      } catch (error) {
        console.error(error);
        alert(error);
        return;
      }

      this.progress_open();
      try {
        console.log("requestDevice OK");
        this.ble_services = [];
        this.ble_device = device;
        this.ble_device.addEventListener('gattserverdisconnected', this.ble_onDisconnect.bind(this.ble_onDisconnect));
        var server = await this.ble_device.gatt.connect()
        console.log('Execute : getPrimaryServices');
        var services = await server.getPrimaryServices();
        console.log(services);
        //                services.map(async service => this.ble_setService(service));
        var list = [];
        for (var i = 0; i < services.length; i++) {
          var service = await this.ble_setService(services[i]);
          list.push(service);
        }
        this.ble_services = list;
        this.ble_isConnected = true;
        this.toast_show("接続しました。");
      } catch (error) {
        console.error(error);
        alert(error);
      } finally {
        this.progress_close();
      }
    },
    async ble_onDisconnect(event) {
      console.log('onDisconnect');
      this.ble_isConnected = false;
      //            this.ble_device = null;
      //            this.ble_services = [];
      this.progress_close();
    },
    async ble_onDataChanged(event) {
      console.log('ble_onDataChanged');
      var characteristic = this.find_characteristic(event.target.service.uuid, event.target.uuid);
      try {
        this.$set(characteristic, "value_hex", this.dataview2hex(characteristic.characteristic.value));
        this.$set(characteristic, "value_changed", true);
      } catch (error) {
        console.log(error);
      }
    },
    find_characteristic(service_uuid, characteristic_uuid) {
      var service = this.ble_services.find(item => item.uuid == service_uuid);
      if (!service)
        return null;
      return service.characteristics.find(item => item.uuid == characteristic_uuid);
    },
    async ble_setService(service) {
      var item = {
        uuid: service.uuid,
        service: service,
        characteristics: []
      };
      try {
        console.log('Execute : getCharacteristics');
        var characteristics = await service.getCharacteristics();
        //                characteristics.map(async characteristic => this.ble_setCharacteristic(item.characteristics, characteristic))
        for (var i = 0; i < characteristics.length; i++)
          await this.ble_setupCharacteristic(item.characteristics, characteristics[i]);
      } catch (error) {
        //                console.error(error);
      }
      //            this.ble_services.push(item);
      return item;
    },
    async ble_setupCharacteristic(characteristics, characteristic) {
      var item = {
        uuid: characteristic.uuid,
        characteristic: characteristic,
      };
      item.properties = "properties:";
      if (characteristic.properties.broadacast)
        item.properties += " broadcast";
      if (characteristic.properties.read)
        item.properties += " read";
      if (characteristic.properties.writeWithoutResponse)
        item.properties += " writeWithoutResponse";
      if (characteristic.properties.write)
        item.properties += " write";
      if (characteristic.properties.notify)
        item.properties += " notify";
      if (characteristic.properties.indicate)
        item.properties += " indicate";
      if (characteristic.properties.authenticatedSignedWrites)
        item.properties += " authenticatedSignedWrites";
      characteristics.push(item);
      characteristic.addEventListener('characteristicvaluechanged', this.ble_onDataChanged.bind(this.ble_onDataChanged));
    },
    dataview2hex: function (data) {
      return new Uint8Array(data.buffer).reduce((hex, val) => {
        var t = val.toString(16);
        return hex += ('00' + t).slice(-2);
      }, "").toUpperCase();
    },
    hex2array: function (hex) {
      var array = new Uint8Array(hex.length / 2);
      for (var i = 0; i < hex.length; i += 2)
        array[i / 2] = parseInt(hex.slice(i, i + 2), 16);
      return array;
    },
    async value_read(characteristic) {
      try {
        await characteristic.characteristic.readValue();
        this.$set(characteristic, "value_changed", false);
      } catch (error) {
        console.error(error);
      }
    },
    async value_write(characteristic) {
      try {
        var array = this.hex2array(characteristic.value_hex);
        if (characteristic.characteristic.properties.writeWithoutResponse)
          await characteristic.characteristic.writeValueWithoutResponse(array);
        else
          await characteristic.characteristic.writeValueWithResponse(array);
      } catch (error) {
        console.error(error);
      }
    },
    async notify_enable(characteristic, forceEnable = false) {
      if (characteristic.notify_enabled && !forceEnable) {
        characteristic.characteristic.stopNotifications();
        this.$set(characteristic, "notify_enabled", false);
      } else {
        characteristic.characteristic.startNotifications();
        this.$set(characteristic, "notify_enabled", true);
      }
    },
    uuid128touuid16(uuid128) {
      if (uuid128.substr(0, 4) == '0000' && uuid128.substr(8, 28) == "-0000-1000-8000-00805f9b34fb")
        return parseInt(uuid128.substr(0, 8), 16);
      else
        return -1;
    },
    find_service_name: function (uuid) {
      var uuid16 = this.uuid128touuid16(uuid);
      if (uuid16 < 0)
        return uuid;
      var name = serviceUuidList[uuid16];
      if (!name)
        return ('0000' + uuid16.toString(16)).slice(-4).toUpperCase();
      return name;
    },
    find_characteristic_name: function (uuid) {
      var uuid16 = this.uuid128touuid16(uuid);
      if (uuid16 < 0)
        return null;
      var name = characteristicUuidList[uuid16];
      if (!name)
        return ('0000' + uuid16.toString(16)).slice(-4).toUpperCase();
      return name;
    },
  }
};
