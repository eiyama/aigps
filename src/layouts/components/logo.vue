<template>
  <div class="logo">
    <img v-if="userInfo.logo" :src="userInfo.logo">
    <img v-else src="@/assets/image/index/logo.png">
    {{$t('home.logo')}}
  </div>
</template>

<style lang="scss" scoped>
.logo {
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-top: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo img {
  max-width: 100px;
  max-height: 40px;
  line-height: 40px;
  display: block;
  float: left;
  margin-right: 5px;
}
.logo .text {
  color: #fff;
  float: left;
  font-size: 18px;
  font-weight: bold;
  line-height: 20px;
}
.logo .en {
  display: block;
  line-height: 14px;
  font-size: 12px;
  font-weight: inherit;

}
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>