<template />

<script>
import axios from "axios";

export default {
    props:{
        row:{
            type:Object,
            default: null
        }
    },
    watch:{
        row: {
	      handler(newValue, oldValue) {
              console.log(this.row)
              this.getWpsUrl()
	      },
	      immediate: true,
	      deep: true
	    }
    },
    methods:{
        async getWpsUrl(){
            axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
            var res = await axios.post("/api/wps/genarate", {fileId: this.row.iuid});
            this.openWps(res.data.wpsUrl);
        },
         openWps(url) {
                let _this = this;
                const wps = _this.wps.config({
                    mode: 'normal',
                    mount: document.querySelector('#wpsContainer'),
                    wpsUrl: url,
                });
                wps.setToken({token:'BIM Windows'});
                let app = wps.Application;
                document.getElementById('wps-iframe').style.height="100%"
        }
    }
}
</script>