<!--  -->
<template>
    <data-dictionary :actionType="'0'"></data-dictionary>
</template>

<script>
import dataDictionary from '@/views/SystemSetting/dataDictionary.vue';
export default {
    name: "privateResource",
    components: {
        dataDictionary
    },
    data() {
        return {
        };
    }
}
</script>