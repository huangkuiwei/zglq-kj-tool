<template>
 	<div slot="empty" class="empty">
 		<img :src="tableEmptyImage"/>
 		<span></span>
   	</div>
</template>

<script>
import tableEmptyImage from "@/assets/tableEmpty.png";

export default {
  data() {
    return {
        tableEmptyImage:tableEmptyImage
    };
  },
}
</script>
