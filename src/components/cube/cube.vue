<!-- loading动画 -->
<template>
  <div class="cube_box">
    <div style="text-align: center;clear: both;"></div>
    <div class="base">
      <div class="cube" v-for="i in 9">
        <div class="cubeLeft"></div>
        <div class="cubeRight"></div>
      </div>
    </div>
  </div>
</template>

<script>
import './follow'
import './prefixfree.min'

export default {
  name: "",
  data() {
    return {
    };
  }
}

</script>
<style scoped>
.cube_box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  font-size: 5px;
  background-color: #fff;
  overflow: hidden;
  perspective: 1000px;

}

.base {
  /* background: #f00; */
  box-sizing: content-box;
  height: 9em;
  left: 50%;
  margin: -7.5em;
  padding: 3em;
  position: absolute;
  top: 50%;
  width: 9em;
  transform: rotateX(45deg) rotateZ(45deg) rotateY(0);
  transform-style: preserve-3d;
}

.cube,
.cubeLeft,
.cubeRight {
  content: '';
  float: left;
  height: 3em;
  position: absolute;
  width: 3em;
}

/* Top */
.cube {
  background-color: #05afd1;
  position: relative;
  transform: translateZ(3em);
  -webkit-transform: translateZ(3em);
  transform-style: preserve-3d;
  transition: .25s;
  box-shadow: 13em 13em 1.5em rgba(0, 0, 0, 0.1);
  animation: anim 1s infinite;
}

.cubeLeft {
  background-color: #049dbc;
  transform: rotateX(-90deg) translateY(3em);
  transform-origin: 100% 100%;
}

.cubeRight {
  background-color: #048ca7;
  transform: rotateY(90deg) translateX(3em);
  transform-origin: 100% 0;
}

.cube:nth-child(1) {
  animation-delay: 0.05s;
}

.cube:nth-child(2) {
  animation-delay: 0.1s;
}

.cube:nth-child(3) {
  animation-delay: 0.15s;
}

.cube:nth-child(4) {
  animation-delay: 0.2s;
}

.cube:nth-child(5) {
  animation-delay: 0.25s;
}

.cube:nth-child(6) {
  animation-delay: 0.3s;
}

.cube:nth-child(7) {
  animation-delay: 0.35s;
}

.cube:nth-child(8) {
  animation-delay: 0.4s;
}

.cube:nth-child(9) {
  animation-delay: 0.45s;
}

@keyframes anim {
  50% {
    transform: translateZ(0.5em);
  }
}
</style>
