<template>  
    <div class="m-2">
      <h1>Pinetime Lite OS</h1>

      <transition name="fade">
        <p
          v-if="connectionButton" 
          class="lead"
        >
          Welcome, in order to use the features of this site you must first
          connect to your Pinetime Lite smartwatch.
        </p>
      </transition>
      <transition name="fade">
        <p class="lead">
          <button
            v-if="connectionButton"
            @click="connectDevice"
            id="btn-connect"
            class="btn btn-lg fw-bold btn-dark"
            type="button"
          >
            Connect to Pinetime
          </button>
        </p>
      </transition>
      <transition name="fade">
        <div v-if="showConnecting" id="connect_info">
          <h3><i class="bi bi-smartwatch"></i> Connecting to Pinetime...</h3>
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </transition>
      <div v-if="isConnected" id="connected">      
        <p class="lead text-success">Successfully connected to the smartwatch.</p>

        <div class="d-flex justify-content-center py-4">

          <div class="row row-cols-2">
            <div class="col-2 align-items-start">
              <img src="assets/img/smartwatch_1.png" alt="Smartwatch" />
            </div>
            <div class="col-10 align-items-start">
              <h6>
                <span id="device">{{deviceName}}</span> <span v-if="deviceVersion != ''">- version </span><span id="device_version">{{deviceVersion}}</span>
              </h6>
              <h6>
                Battery level <span class="text-info fw-bolder" id="batt_level">{{batteryLevel}}%</span>
              </h6>

              <button 
                @click="onDisconnected"
                id="btn-disconnect" class="btn btn-success fw-bold" type="button"
              >
                Disconnect
              </button>
              <button @click="Reload" class="btn btn-warning m-2">Reload <i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
        </div>

        <h5 v-if="deviceVersionError" class="text-danger">
          You Pinetime Lite version is not supported by this application, some options may not work properly!<br />
          Do not use the options to update the firmware or bootloader.
        </h5>
        <hr />
        <div v-if="showMenu">
          <div class="container">
            <div class="row">
              <div class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-watch"></i> Time</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Update your smartwatch's time.</p>
                    <button @click="setTime" class="btn btn-info">Set time</button>
                  </div>
                </div>
              </div>
              <div class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-sliders"></i> Settings</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Change your smartwatch's settings.</p>
                    <button @click="showSettings" class="btn btn-success">Change settings</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!fileServiceReady" class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="row">
              <div v-if="fileServiceReady" class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-images"></i> Resources</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Option to update your smartwatch's resources.</p>
                    <button @click="showResource" class="btn btn-warning">Upload Resources</button>
                  </div>
                </div>
              </div>
              <div v-if="fileServiceReady" class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-folder"></i> File Explorer</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Smartwatch's File Explorer.</p>
                    <button @click="showFiles" class="btn btn-success">File Explorer</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div v-if="fileServiceReady" class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-cpu-fill text-danger"></i> Firmware</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Option to update your smartwatch's firmware.</p>
                    <button @click="showFirmware" class="btn btn-danger">Upload Firmware</button>
                  </div>
                </div>
              </div>
              <div v-if="fileServiceReady" class="col-sm">
                <div class="card mb-3">
                  <div class="card-header bg-light">
                    <h2 class="h5 m-0"><i class="bi bi-cpu text-danger"></i> Bootloader</h2>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Option to update your smartwatch's bootloader.</p>
                    <button @click="showBootloader" class="btn btn-danger">Upload Bootloader</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div v-if="showOption === 'Resources'">
          <div class="card mb-3">
            <div class="card-header bg-light">
              <h2 class="h5 m-0"><i class="bi bi-images"></i> Resources</h2>
            </div>
            <div class="card-body">
              <p class="card-text text-warning">Please note that this action is not reversible, the current resource in the smartwatch will be overwritten.</p>
              <div v-if="!showFileName" class="mb-3">
                <label for="resourcesFile" class="form-label">Select the resources file (*.res)</label>
                <input @change="requestUpload" class="form-control" type="file" id="uploadFile" accept=".res">
              </div>
              <div v-if="showFileName" class="mb-3">
                <p class="card-text text-success">{{fileSourceName}}</p>
                <p v-if="fileVersion != null" class="card-text text-info">Resource version {{fileVersion}}</p>
              </div>
              <div v-if="canUploadFile && deviceVersion > '0.3.0'">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed1" value="240" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed1">
                    Use High-Speed transfer
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed2" value="20" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed2">
                    Use normal transfer speed
                  </label>
                </div>
                <div v-if="mtuSize == 240" class="text-muted"><small>if you experience errors use the normal transfer speed.</small></div>
              </div>
              <button @click="fileUpload" v-if="canUploadFile" class="btn btn-success m-3"><i class="bi bi-cloud-arrow-up"></i> Upload Resource</button>
              <button @click="closeOption" v-if="!isUploading" class="btn btn-light m-3">Cancel</button>
              <div v-if="isUploading" class="mb-3">
                <h2 class="h5 m-2">Uploading resource file</h2>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" v-bind:style="{width: uploadingPercentage + '%'}" v-bind:aria-valuenow="uploadingPercentage" aria-valuemin="0" aria-valuemax="100">{{uploadingPercentage}}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showOption === 'Bootloader'">
          <div class="card mb-3">
            <div class="card-header bg-light">
              <h2 class="h5 m-0"><i class="bi bi-cpu text-danger"></i> Bootloader</h2>
            </div>
            <div class="card-body">
              <p class="card-text text-danger">Attention, you must choose a specific bootloader for <strong>Pinetime Lite</strong>, the use of another non-compatible one can make your smartwatch <strong>bricked</strong>.<br />The application does not validate the bootloader compatibility.</p>
              <div v-if="!showFileName" class="mb-3">
                <label for="bootloaderFile" class="form-label">Select the bootloader file (*.bot)</label>
                <input @change="requestUpload" class="form-control" type="file" id="uploadFile" accept=".bot">
              </div>
              <div v-if="showFileName" class="mb-3">
                <p class="card-text text-success">{{fileSourceName}}</p>
                <p v-if="fileVersion != null" class="card-text text-info">Bootloader version {{fileVersion}}</p>
              </div>
              <div v-if="canUploadFile && deviceVersion > '0.3.0'">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed1" value="240" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed1">
                    Use High-Speed transfer
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed2" value="20" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed2">
                    Use normal transfer speed
                  </label>
                </div>
                <div v-if="mtuSize == 240" class="text-muted"><small>if you experience errors use the normal transfer speed.</small></div>
              </div>
              <button @click="fileUpload" v-if="canUploadFile" class="btn btn-success m-3"><i class="bi bi-cloud-arrow-up"></i> Upload Bootloader</button>
              <button @click="closeOption" v-if="!isUploading" class="btn btn-light m-3">Cancel</button>
              <div v-if="isUploading" class="mb-3">
                <h2 class="h5 m-2">Uploading bootloader file</h2>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" v-bind:style="{width: uploadingPercentage + '%'}" v-bind:aria-valuenow="uploadingPercentage" aria-valuemin="0" aria-valuemax="100">{{uploadingPercentage}}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showOption === 'Firmware'">
          <div class="card mb-3">
            <div class="card-header bg-light">
              <h2 class="h5 m-0"><i class="bi bi-cpu-fill text-danger"></i> Firmware</h2>
            </div>
            <div class="card-body">
              <p class="card-text text-danger">Attention, you must choose a specific firmware for <strong>Pinetime Lite</strong>, the use of another non-compatible one can make your smartwatch <strong>bricked</strong>.<br />The application does not validate the firmware compatibility.</p>
              <div v-if="!showFileName" class="mb-3">
                <label for="bootloaderFile" class="form-label">Select the firmware file (*.fw)</label>
                <input @change="requestUpload" class="form-control" type="file" id="uploadFile" accept=".fw">
              </div>
              <div v-if="showFileName" class="mb-3">
                <p class="card-text text-success">{{fileSourceName}}</p>
                <p v-if="fileVersion != null" class="card-text text-info">Firmware version {{fileVersion}}</p>
              </div>
              <div v-if="canUploadFile && deviceVersion > '0.3.0'">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed1" value="240" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed1">
                    Use High-Speed transfer
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="flexSwitchSpeed" id="flexSwitchSpeed2" value="20" v-model="mtuSize">
                  <label class="form-check-label" for="flexSwitchSpeed2">
                    Use normal transfer speed
                  </label>
                </div>
                <div v-if="mtuSize == 240" class="text-muted"><small>if you experience errors use the normal transfer speed.</small></div>
              </div>
              <button @click="fileUpload" v-if="canUploadFile" class="btn btn-success m-3"><i class="bi bi-cloud-arrow-up"></i> Upload Firmware</button>
              <button @click="closeOption" v-if="!isUploading" class="btn btn-light m-3">Cancel</button>
              <div v-if="isUploading" class="mb-3">
                <h2 class="h5 m-2">Uploading firmware file</h2>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" v-bind:style="{width: uploadingPercentage + '%'}" v-bind:aria-valuenow="uploadingPercentage" aria-valuemin="0" aria-valuemax="100">{{uploadingPercentage}}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showOption === 'Settings'">
          <div class="card mb-3">
            <div class="card-header bg-light">
              <h2 class="h5 m-0"><i class="bi bi-sliders"></i> Settings</h2>
            </div>
            <div class="card-body">
              <p class="card-text">Change settings and click save to sync to smartwatch.</p>
              <button @click="closeOption" v-if="!isUploading" class="btn btn-light btn-sm m-3">Cancel</button>
            </div>
          </div>
        </div>

        <div v-if="showOption === 'Files'">
          <div class="card mb-3">
            <div class="card-header bg-light">
              <h2 class="h5 m-0"><i class="bi bi-folder"></i> File Explorer</h2>
            </div>
            <div class="card-body">
              <p class="card-text">Smartwatch file explorer.</p>
              <div v-if="!showFileName" class="mb-3">
                <label for="bootloaderFile" class="form-label">Select the file to upload</label>
                <input @change="requestUploadFile" class="form-control" type="file" id="uploadFile" multiple>
              </div>
              <div v-if="showFileName" class="mb-3">
                <p class="card-text text-success">{{fileSourceName}}</p>
              </div>

              <button @click="closeOption" v-if="!isUploading" class="btn btn-light btn-sm m-3">Cancel</button>

              <div v-if="isUploading" class="mb-3">
                <h2 class="h5 m-2">Uploading file</h2>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" v-bind:style="{width: uploadingPercentage + '%'}" v-bind:aria-valuenow="uploadingPercentage" aria-valuemin="0" aria-valuemax="100">{{uploadingPercentage}}%</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
export default {
  name: "PinetimeApp",
  data: function() {
    return {
      
      connectionButton: true,
      showConnecting: false,
      isConnected: false,

      showMenu: true,
      showOption: null,

      deviceName: "Reading information...",
      deviceVersion: "",
      deviceVersionError: false,
      batteryLevel: 0,
      device: null,
      fileService: null,
      fileServiceData: null,
      fileServiceControl: null,

      fileServiceReady: false,
      fileSource: null,
      showFileName: false,
      fileSourceName: null,
      fileType: null,
      fileVersion: null,
      canUploadFile: false,
      isUploading: false,
      uploadingPercentage: 0,
      mtuSize: 240,

    };
  },
  mounted: function () {
    if (!navigator.bluetooth) {
      this.msgError("Web Bluetooth API is not available.");
    }
  },
  methods: {
    msgError: function(status) {
      this.connectionButton = false;
      this.$toast.open({
        message: status,
        type: "error",
        duration: 5000,
        dismissible: true
      });
    },
    msgSuccess: function(status) {
      this.connectionButton = false;
      this.$toast.open({
        message: status,
        type: "success",
        duration: 3000,
        dismissible: true
      });
    },
    connectDevice: function() {
      try {
        this.connectionButton = false;
        this.showConnecting = true;
        this.requestBlE();

      } catch (error) {
        this.msgError( error );
        this.connectionButton = true;
        this.showConnecting = false;
      }
    },

    /* request connection to a Pinetime device */
    requestBlE() {
        let options = {
            filters: [
                {
                    name: "Pinetime-Lite",
                }
            ],
            optionalServices: [
                0x1801,
                0x180A,
                0x1805,
                0x180F,
                "00021000-78fc-48fe-8e23-433b3a1942d0",
            ]
        };
        if (navigator.bluetooth == undefined) {
            this.msgError("Sorry, Your device does not support Web BLE!");
            return;
        }
        
        navigator.bluetooth.requestDevice(options).then(device => {
          this.device = device;
          this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
          return this.device.gatt.connect();
        }).then(async server =>{
          if (server) {
            this.getDeviceCharacteristic();
            this.setTime();
            //await this.sleep(500);
            this.getBattery();
            //await this.sleep(500);
            this.getDeviceFileCharacteristic();
            //await this.Reload();
            this.isConnected = true;
            this.showConnecting = false;
          }
        }).catch(error => {
          this.msgError( error );
          this.connectionButton = true;
          this.showConnecting = false;
          this.isConnected = false;
        });

    },
    async Reload() {
      await this.getBattery();
      await this.getDeviceFileCharacteristic();
      this.msgSuccess("Reloading services...");
    },
    async getDeviceCharacteristic() {
      await this.device.gatt.getPrimaryService(0x180A).then(async service => {

        
        const characteristic1 = await service.getCharacteristic(0x2A28);
        const value1 = await characteristic1.readValue();
        this.deviceName = this.decode(value1);

        const characteristic2 = await service.getCharacteristic(0x2A26);
        const value2 = await characteristic2.readValue();
        this.deviceVersion = this.decode(value2);
        if(this.deviceVersion < "0.3.0") {
          this.msgError( "You Pinetime Lite version is not supported by this application, some options may not work properly!" );
          this.deviceVersionError = true;
        }
        if(this.deviceVersion == "0.3.0") {
          this.mtuSize = 20;
        }

      }).catch(error => {
        this.msgError( "getDeviceCharacteristic: " + error );
      });
    },

    async getDeviceFileCharacteristic() {
      await this.device.gatt.getPrimaryService("00021000-78fc-48fe-8e23-433b3a1942d0").then(async service => {
        this.fileServiceControl = await service.getCharacteristic("00021001-78fc-48fe-8e23-433b3a1942d0");

        await this.fileServiceControl.startNotifications().then(_ => {
          if(_) null;
          this.fileServiceControl.addEventListener('characteristicvaluechanged', this.handleFileNotifications);
          this.fileServiceReady = true;
        });
        
        this.fileServiceData = await service.getCharacteristic("00021000-78fc-48fe-8e23-433b3a1942d0");

      }).catch(error => {
        this.msgError( "getDeviceFileCharacteristic: " + error );
      });
    },

    async getBattery() {
      await this.device.gatt.getPrimaryService(0x180F).then(async service => {
        const characteristic1 = await service.getCharacteristic(0x2A19);

        const value1 = await characteristic1.readValue();
        this.batteryLevel = value1.getUint8(0);
      }).catch(error => {
        this.msgError( "getBattery: " + error );
      });
    },

    async setTime() {
      await this.device.gatt.getPrimaryService(0x1805).then(service => {
        service.getCharacteristic(0x2A2B).then(characteristic => {
          characteristic.writeValueWithoutResponse(this.dateToArray(new Date())).then(_ => {                    
            if(_) null;
            this.msgSuccess("The time on the smartwatch has been updated.");
          });
        }).catch(error => {
          this.msgError( error );
        });
      }).catch(error => {
        this.msgError( "setTime: " + error );
      });
    },
    onDisconnected() {
      alert("Device is disconnected.");
      location.reload();
    },

    decode(buf) {
      let dec = new TextDecoder("utf-8");
      return dec.decode(buf);
    },

    dateToArray(date) {
      let year = date.getFullYear();
      const b = [year % 256, year / 256, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0, 220];
      const ab = new Uint8Array(b);
      return ab;
    },

    closeOption() {
      this.showMenu = true;
      this.showOption = null;
      this.showFileName = false;
      this.fileSource = null;
      this.fileSourceName = null;
      this.canUploadFile = false;
      this.isUploading = false;
      this.uploadingPercentage = 0;
    },

    showResource() {
      this.showMenu = false;
      this.showOption = 'Resources';
    },
    showFirmware() {
      this.showMenu = false;
      this.showOption = 'Firmware';
    },
    showBootloader() {
      this.showMenu = false;
      this.showOption = 'Bootloader';
    },
    showSettings() {
      this.showMenu = false;
      this.showOption = 'Settings';
    },
    showFiles() {
      this.showMenu = false;
      this.showOption = 'Files';
    },

    requestUpload() {
      var src = this.$el.querySelector('#uploadFile');
      this.processFile(src.files);
    },

    requestUploadFile() {
      var src = this.$el.querySelector('#uploadFile');
      this.processExplorerFile(src.files);
    },

    processExplorerFile(files){
      this.showFileName = true;
      this.fileSourceName = '';
      this.isUploading = true;
      files.forEach(async file => {
        this.fileSourceName += file.name + ' ';
        let reader = new FileReader();
        reader.onload = f => {
          if ( f.target.result.byteLength > 0 ) {
            this.fileSource = new Uint8Array(f.target.result);
            // Send file
            this.sendExplorerFile(file.name);
          } else {
            this.msgError( "Selected file is empty." );
            this.isUploading = false;
          }         
        };
        reader.onerror = function() {
          this.msgError( "Failed to read file!\n\n" + reader.error);
          reader.abort();
          this.isUploading = false;
        };
        reader.readAsArrayBuffer(file);
        while(this.isUploading) {
          await this.sleep(5);
        }
      });
    },
    async sendExplorerFile( fileName ) {
      try {
        await this.fileExplorerWriteHeader( fileName );
        //this.isUploading = false;
      } catch(error) {
        this.msgError( error );
        this.isUploading = false;
      }
    },
    strToBuffer (string) {
      return new TextEncoder("utf-8").encode(string);
    },
    async fileExplorerWriteHeader( fileName ) {

      let fileSize = this.toBytesInt32(this.fileSource.byteLength);
            
      fileName = '/' + fileName;
      let name = this.strToBuffer(fileName);

      let header = new Uint8Array(8 + name.length);
      
      header[0] = 0x21; // COMMAND_FILE_INIT
      header[1] = 0x2; // type - create dir = 1 / create file = 2 / delete = 9
      header[2] = name.length;
      header[3] = fileSize[3];
      header[4] = fileSize[2];
      header[5] = fileSize[1];
      header[6] = fileSize[0];
      header.set(name, 7);
      header[header.length - 1] = 0x00;

      await this.fileServiceControl.writeValueWithoutResponse(header);
    },
    // ------------------------------------------------------------------------------------------------------
    processFile(files){
      // allows only 1 file
      if (files.length === 1) {
        let file = files[0];
        this.fileSourceName = file.name;
        let reader = new FileReader();
        reader.onload = f => {
          if ( f.target.result.byteLength > 0 ) {
            this.fileSource = new Uint8Array(f.target.result);
            this.showFileName = true;
            this.getFileType();
          } else {
            this.msgError( "Selected file is empty." );
          }         
        };
        reader.onerror = function() {
          this.msgError( "Failed to read file!\n\n" + reader.error);
          reader.abort();
        };
        
        reader.readAsArrayBuffer(file);
        
      } else {
        this.msgError( "Select only one file." );
      }
    },

    getFileType() {
      this.fileType = null;
      let fileArray = this.fileSource;
      // 0xAA,0x52,0x45,0x53,0x2D,0x50,0x2D,0x4C,0x49,0x54,0x45,0x00,0x01,0x01,0x00,0x01

      // resource ID 0xAA,0x52,0x45,0x53,0x2D,0x50,0x2D,0x4C,0x49,0x54,0x45,
      // resource file version 0x00,0x01,
      // resource version 0x01,0x00,0x01

      if (  fileArray[0] == 170 && fileArray[1] == 82 &&
            fileArray[2] == 69  && fileArray[3] == 83 &&
            fileArray[4] == 45  && fileArray[5] == 80 &&
            fileArray[6] == 45  && fileArray[7] == 76 &&
            fileArray[8] == 73  && fileArray[9] == 84 &&
            fileArray[10] == 69
      ) {
        if ( this.showOption == "Resources" ) {
          this.fileType = "RES";
          // read versions
          //let resFileVersion = fileArray[11] + '.' + tfileArray[12];
          this.fileVersion = fileArray[13] + '.' + fileArray[14] + '.' + fileArray[15];
          this.canUploadFile = true;
        } else {
          this.msgError( "Selected file is a Resource." );
        }
      } else {
        this.fileVersion = "not found.";
        if (this.fileSourceName.includes('.fw')) {
          if ( this.showOption == "Firmware" ) {
            this.fileType = "FW";
            this.canUploadFile = true;
          } else {
            this.msgError( "Selected file is a Firmware." );
          }
        } else if (this.fileSourceName.includes('.bot')) {
          if ( this.showOption == "Bootloader" ) {
            this.fileType = "BOT";
            this.canUploadFile = true;
          } else {
            this.msgError( "Selected file is a Bootloader." );
          }
        } else {
          this.fileType = null;
          this.canUploadFile = false;
          this.msgError( "Selected file cannot be used." );
        }
      }
    },

    async fileUpload() {
      //if ( this.batteryLevel < 15 ) {
        //this.msgError( "The battery level is very low, charge the smartwatch first before proceeding with the update." );
      //} else {
        this.canUploadFile = false;
        this.isUploading = true;
        
        try {
          await this.fileWriteHeader();
          //this.isUploading = false;
        } catch(error) {
          this.msgError( error );
          this.isUploading = false;
        }
      //}
    },
    toBytesInt32 (num) {
      let arr = new Uint8Array([
          (num & 0xff000000) >> 24,
          (num & 0x00ff0000) >> 16,
          (num & 0x0000ff00) >> 8,
          (num & 0x000000ff)
      ]);
      return arr;
    },

    toBytesInt16 (num) {
      let arr = new Uint8Array([
          (num & 0xff00) >> 8,
          (num & 0x00ff)
      ]);
      return arr;
    },

    async fileWriteHeader() {
      let header = new Uint8Array(6);

      let filesize = this.toBytesInt32(this.fileSource.byteLength);

      // COMMAND_SEND_FIRMWARE_INFO = 0x02;
      header[0] = 0x02;
      header[1] = filesize[3];
      header[2] = filesize[2];
      header[3] = filesize[1];
      header[4] = filesize[0];
      if ( this.fileType == "RES" ) {
        header[5] = 0x01;
      } else if ( this.fileType == "FW" ) {
        header[5] = 0x02;
      } else if ( this.fileType == "BOT" ) {
        header[5] = 0x03;
      }

      await this.fileServiceControl.writeValueWithoutResponse(header);
    },

    getCRC16() {
      let crc = 0xFFFF;
      this.fileSource.forEach(function(b) {
          crc = ((crc >>> 8) | (crc << 8)) & 0xffff;
            crc ^= (b & 0xff);
            crc ^= ((crc & 0xff) >> 4);
            crc ^= (crc << 12) & 0xffff;
            crc ^= ((crc & 0xFF) << 5) & 0xffff;
      });
      crc &= 0xffff;
      return crc;
    },

    async fileSendCheckSum() {
      let header = new Uint8Array(3);
      // calculate crc16
      let crc16 = this.toBytesInt16(this.getCRC16());

      // COMMAND_FIRMWARE_CHECKSUM = 0x04;
      header[0] = 0x04;
      header[1] = crc16[1];
      header[2] = crc16[0];

      await this.fileServiceControl.writeValueWithoutResponse(header);
    },

    fileSendCommand( command ) {
      let p = new Promise((resolve, reject) => {
        if (this.fileServiceControl != null) {
          let header = new Uint8Array(1);
          header[0] = command;
          this.fileServiceControl.writeValueWithoutResponse(header).then(_ => {
            if(_) null;
            resolve();
          }).catch( error =>  {
            reject("fileSendCommand : " + error)
          });
        } else {
          reject("No control file service.")
        }
      });
      return p;
    },

    fileSendData( data ) {
     let p = new Promise((resolve, reject) => {
        if (this.fileServiceData != null) {
          this.fileServiceData.writeValueWithoutResponse(data).then(_ => {
            if(_) null;
            resolve();
          }).catch( error =>  {
            reject("fileSendData : " + error)
          });
        } else {
          reject("No write file service.")
        }
      });
      return p;
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    fileSend() {
      let packetLength = parseInt(this.mtuSize);

      // going from 0 to len
      let firmwareProgress = 0;
      
      try {
        // COMMAND_FIRMWARE_START_DATA
        this.fileSendCommand( 0x03 ).then( async _ => {
          if(_) null;
          let sending = false;
          await this.sleep(5);
          // send data...
          while(firmwareProgress < this.fileSource.byteLength) {
            if(sending === false) {
              sending = true;
              let element = this.fileSource.slice(firmwareProgress, firmwareProgress + packetLength);
              this.fileSendData(element).then(_ => {
                if(_) null;
                firmwareProgress += element.length;
                this.uploadingPercentage = ((firmwareProgress / this.fileSource.byteLength) * 100).toFixed(0);
                sending = false;
              }).catch( error =>  {
                this.msgError( "fileSend data - " + error );
                this.isUploading = false;
              });
            } else {
              await this.sleep(5);
            }
          }
          await this.sleep(5);
          // COMMAND_FIRMWARE_END_DATA
          this.fileSendCommand( 0x06 ).then( async _ => {
            if(_) null;
            await this.sleep(5);
          }).catch( error =>  {
                this.msgError( "_END_DATA - " + error );
                this.isUploading = false;
              });       
        }).catch( error =>  {
                this.msgError( "_START_DATA - " + error );
                this.isUploading = false;
              });
      } catch( error ) {
        this.msgError( "fileSend: " + error );
        this.isUploading = false;
      }
    },

    fileExplorerSend() {
      let packetLength = parseInt(this.mtuSize);

      // going from 0 to len
      let firmwareProgress = 0;
      
      try {
        // COMMAND_FILE_START_DATA
        this.fileSendCommand( 0x22 ).then( async _ => {
          if(_) null;
          let sending = false;
          await this.sleep(5);
          // send data...
          while(firmwareProgress < this.fileSource.byteLength) {
            if(sending === false) {
              sending = true;
              let element = this.fileSource.slice(firmwareProgress, firmwareProgress + packetLength);
              this.fileSendData(element).then(_ => {
                if(_) null;
                firmwareProgress += element.length;
                this.uploadingPercentage = ((firmwareProgress / this.fileSource.byteLength) * 100).toFixed(0);
                sending = false;
              }).catch( error =>  {
                this.msgError( "fileSend data - " + error );
                this.isUploading = false;
              });
            } else {
              await this.sleep(5);
            }
          }
          await this.sleep(5);
          // COMMAND_FILE_END
          this.fileSendCommand( 0x23 ).then( async _ => {
            if(_) null;
            await this.sleep(5);
          }).catch( error =>  {
                this.msgError( "_END_DATA - " + error );
                this.isUploading = false;
              });       
        }).catch( error =>  {
                this.msgError( "_START_DATA - " + error );
                this.isUploading = false;
              });
      } catch( error ) {
        this.msgError( "fileSend: " + error );
        this.isUploading = false;
      }
    },

    // ------------------------------------------------------------------------------------------------------

    handleFileNotifications(event) {
      try {
        let value = event.target.value;
        if( value.getUint8(0) == 0x01 ) {
          switch (value.getUint8(1)) {
            case 0x01: // COMMAND_FIRMWARE_INIT
              // sends data...
              this.fileSend();
              break;
            case 0x06: // COMMAND_FIRMWARE_END_DATA
              // sends checksum...
              this.fileSendCheckSum();
              break;
            case 0x09: // COMMAND_FIRMWARE_CHECKSUM_ERR
              this.isUploading = false;
              this.msgError("Problem with the firmware, checksum error.");
              break;
            case 0x08: // COMMAND_FIRMWARE_ERROR
              this.isUploading = false;
              this.msgError("Problem with the firmware, download error.");
              break;
            case 0x07: // COMMAND_FIRMWARE_OK
              this.isUploading = false;
              this.uploadingPercentage = 100;
              this.msgSuccess("Firmware installation complete.");
              this.closeOption();
              break;
            case 0x22: //COMMAND_FILE_START_DATA
              // send file
              this.fileExplorerSend();
            break;
            case 0x23: //COMMAND_FILE_END
              this.isUploading = false;
              this.uploadingPercentage = 100;
              this.msgSuccess("File upload completed.");
            break;
            case 0x24: //COMMAND_FILE_ERROR
              this.isUploading = false;
              this.msgError("Problem with file upload.");
            break;

            default:
              this.msgError("Unexpected response during firmware update: [" + value.getUint8(1) + "]");
              this.isUploading = false;
              break;
          }
        } else {
          this.isUploading = false;
          this.msgError("Error sending file to smartwatch. [" + value.getUint8(0) + "] [" + value.getUint8(1) + "]");
        }
      } catch( error ) {
        this.msgError( "handleFileNotifications: " + error );
        this.isUploading = false;
      }
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
