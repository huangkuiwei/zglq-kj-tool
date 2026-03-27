<template>
  <div class="conLeft flex">
    <div v-if="scope.fileSuffix == ''">
      <svg class="tableLinkIcon">
        <use xlink:href="#icon-wenjian"></use>
      </svg>
    </div>
    <div v-else>
      <svg v-if="$videoFileSuffix.indexOf(scope.fileSuffix) > -1 || $otherVideoFileSuffix.indexOf(scope.fileSuffix) > -1" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-shipin"></use>
      </svg>
      <svg v-if="$ibimFileSuffix.indexOf(scope.fileSuffix) > -1" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-BIMwenjian"></use>
      </svg>
      <svg v-if="$imageFileSuffix.indexOf(scope.fileSuffix) > -1" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-tupian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.txt'" class="tableLinkIcon">
        <use xlink:href="#icon-text"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.docx' || scope.fileSuffix.toLowerCase() == '.doc'" class="tableLinkIcon">
        <use xlink:href="#icon-word"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.xls' || scope.fileSuffix.toLowerCase() == '.xlsx'" class="tableLinkIcon">
        <use xlink:href="#icon-excel"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.dgn'" class="tableLinkIcon">
        <use xlink:href="#icon-DGN"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.dwg'" class="tableLinkIcon">
        <use xlink:href="#icon-DWG"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.ifc'" class="tableLinkIcon">
        <use xlink:href="#icon-IFC"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.rvt'" class="tableLinkIcon">
        <use xlink:href="#icon-RVT"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.cel'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-Celwenjian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.dgnlib'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-DGNLIBwenjian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.dxf'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-a-DXFwenjian_huaban1"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.nwd'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-a-NWDwenjian_huaban1"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.skp'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-skpwenjian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.obj'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-objwenjian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.fbx'" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-fbxwenjian"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.ppt' || scope.fileSuffix.toLowerCase() == '.pptx'" class="tableLinkIcon">
        <use xlink:href="#icon-ppt"></use>
      </svg>
      <svg v-if="scope.fileSuffix.toLowerCase() == '.pdf'" class="tableLinkIcon">
        <use xlink:href="#icon-pdf"></use>
      </svg>
      <svg v-if="$zipFileSuffix.indexOf(scope.fileSuffix) > -1" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-yasuo"></use>
      </svg>
      <svg v-if="$allfileType.indexOf(scope.fileSuffix) === -1" class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-weizhiwenjian"></use>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    scope: {
      type: Object,
      default: null
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
};
</script>
<style scoped>
.conLeft {
  align-items: center;
}

.conLeft .tableLinkIcon {
  width: 34px;
  height: 34px;
}

.conRight {
  align-items: center;
}

.conRight img {
  width: 16px;
  height: 16px;
}
</style>