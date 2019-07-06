<template>
<div class="align-self-center">
  <div class="circle-spinner"></div>
</div>
</template>
<style scoped>
@keyframes circleSpinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
.circle-spinner {
  margin: 50px auto;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border-width: 3px;
  border-style: solid;
  border-color: #17a2b8 #17a3b81a #17a3b81a;
  border-image: initial;
  animation: circleSpinner 1s linear 0s infinite normal none running;
}
</style>
