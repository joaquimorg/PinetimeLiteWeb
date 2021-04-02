<template>  
    <div class="p-2">
        <h1>Pinetime Lite OS Downloads <i class="bi bi-cloud-arrow-down"></i></h1>
        <hr />
        <h3>Pinetime Lite Current versions</h3>
        <div class="list-group">
            <a v-for="item in assets" :key="item.id" :href="item.browser_download_url" class="list-group-item d-flex justify-content-between list-group-item-action align-items-center">
                {{item.name}}
                <span class="badge bg-primary rounded-pill">{{item.download_count}}</span>
            </a>
        </div>
        <hr />
        <h4>More information on the Github page</h4>
        <i class="bi bi-github"></i> <a class="text-white" target="_bank" href="https://github.com/joaquimorg/PinetimeLite">Pinetime Lite OS</a>
        <div class="card bg-dark my-4 text-start">
            <div class="card-body">
                <markdown-it-vue-light :content="body" class="md-links"/>
            </div>
        </div>
    </div>
</template>

<script>

import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'

var apiURL = "https://api.github.com/repos/joaquimorg/PinetimeLite/releases/latest";

export default {
    name: "Download",
    components: {
        MarkdownItVueLight,
    },
    data: function() {
        return {
            assets: null,
            body: null,
        };
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open("GET", apiURL);
            xhr.onload = function() {
                let json = JSON.parse(xhr.responseText);
                self.body = json.body;
                self.assets = json.assets;
            };
            xhr.send();
        }
  },
}
</script>

<style>
.md-links a, .md-links a:hover {
    color: blue;
}
</style>