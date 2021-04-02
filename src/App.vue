<template>  
  <div id="app" class="pinetime-container d-flex w-100 h-100 mx-auto flex-column">
    
    <svg id="background_ico" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor"
      class="bi bi-smartwatch" viewBox="0 0 16 16">
      <path d="M9 5a.5.5 0 0 0-1 0v3H6a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5V5z" />
      <path
        d="M4 1.667v.383A2.5 2.5 0 0 0 2 4.5v7a2.5 2.5 0 0 0 2 2.45v.383C4 15.253 4.746 16 5.667 16h4.666c.92 0 1.667-.746 1.667-1.667v-.383a2.5 2.5 0 0 0 2-2.45V8h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H14v-.5a2.5 2.5 0 0 0-2-2.45v-.383C12 .747 11.254 0 10.333 0H5.667C4.747 0 4 .746 4 1.667zM4.5 3h7A1.5 1.5 0 0 1 13 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3z" />
    </svg>    

    <div class="pinetime-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header class="mb-auto">
        <div>
          <h3 class="float-md-start mb-0"><i class="bi bi-smartwatch"></i> Pinetime Lite</h3>
          <nav class="nav nav-masthead justify-content-center float-md-end">
            <a class="nav-link" v-bind:class="{ active: currPage == 'home' }" aria-current="page" @click="home">
              <i class="bi bi-house-door"></i>
              Home
            </a>
            <a class="nav-link" v-bind:class="{ active: currPage == 'download' }" aria-current="page" @click="download">
              <i class="bi bi-cloud-arrow-down"></i>
              Download
            </a>
          </nav>
        </div>
      </header>
      <main class="px-3">        
        <PinetimeApp v-if="currPage == 'home'" />
        <PinetimeDownload v-if="currPage == 'download'" />
      </main>
      <footer class="mt-auto text-white-50">
        <p id="footer_info" class="show">
          The PineTime is a open source smartwatch capable of running custom-built open operating systems, like <a
            target="_bank" class="text-white" href="https://github.com/joaquimorg/PinetimeLite">Pinetime Lite OS</a>. Some
          of the
          notable features include a week-long battery as well as a capacitive touch IPS display
          that is legible in direct sunlight.
          <br />It is a fully community driven side-project.
          <br />
          <a class="text-white" target="_bank" href="https://www.pine64.org/pinetime/">pine64.org</a> | <a
            class="text-white" target="_bank" href="https://wiki.pine64.org/index.php/PineTime">wiki PineTime</a>
        </p>
        <p>&copy; 2021 joaquim.org - <i class="bi bi-github"></i> <a class="text-white" target="_bank"
            href="https://github.com/joaquimorg/PinetimeLite">Github Pinetime Lite OS</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import PinetimeApp from "./components/PinetimeApp.vue";
import PinetimeDownload from "./components/PinetimeDownload.vue";

export default {
  name: "App",
   data: function() {
    return {
      currPage: "home",
    };
  },
  components: {
    PinetimeApp,
    PinetimeDownload,
  },
  methods: {
    home() {
      this.currPage = 'home';
    },
    download() {
      this.currPage = 'download';
    }
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
