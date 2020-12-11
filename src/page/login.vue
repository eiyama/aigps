<template>
  <div class="box">
    <div class="top">
      <div class="left">
        <img src="@/assets/image/login/logo.png"/>
        <span class="icon"></span>
        <p>智慧管车平台</p>
      </div>
      <div class="right">
        <p class="tel">联系我们：0755-86725380</p>       
      </div>
       <!-- <h1>智慧管车平台</h1> -->
    </div>
   
    <div :style="{ height: bannerH + 'px' }" class="banner">
      <div class="content">
        <h3 style="color: #000;font-size: 30px;">欢迎登录智慧管车平台</h3>
        <el-input
          class="input-text"
          prefix-icon="icon-yonghu iconfont"
          @keyup.enter.native="submitForm"
          v-model="ruleForm.userCode"
          :placeholder="$t('placeholder.userName')"
        ></el-input>
        <!-- <input @input="changeVal" type="text" v-model="ruleForm.userCode"/> -->
        <el-input
          type="password"
          prefix-icon="icon-mima1 iconfont"
          @keyup.enter.native="submitForm"
          v-model="ruleForm.userPwd"
          class="input-text"
          :placeholder="$t('placeholder.userPsw')"
        ></el-input>
        <div class="en-bar">
          <el-checkbox class="checkbox" v-model="ruleForm.checked">记住密码</el-checkbox>
          <a v-show="language == 'cn'" @click="changeLang('en')" class="text-type" href="javascript:;">中文</a>
          <a v-show="language == 'en'" @click="changeLang('cn')" class="text-type" href="javascript:;">EN</a>
        </div>
        <el-button type="primary" class="login-btn" size="medium" :loading="ruleForm.loading" @click="submitForm">登录</el-button>
      </div>
      <div class="bannerCarousel" style="width:100%;height:100%">
          <el-carousel :height="bannerH + 'px'" >
            <el-carousel-item v-for="(item,index) in carouselList" :key="index">
              <div class="describe">
                <h3>{{item.title}}</h3>
                <p>{{item.describe}}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
      </div>      
      <!-- <img src="@/assets/image/login/banner.png" /> -->
    </div>
    <div class="footer">
      <div class="link-box">
        <div class="wrapper">
          <div class="label">友情链接：</div>
          <ul>
            <li>
              <a href="http://huochechacha.com/" target="_blank">
                <img src="@/assets/image/link/chacha.png" alt="货车查查">
              </a>
            </li>
            <li>
              <a href="http://www.sinohb.com/" target="_blank">
                <img src="@/assets/image/link/huabao.png" alt="华宝科技">
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        版权所有 © Copyright 深圳市开源节流科技有限公司保留一切权利。
        <a href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备15066857号</a>
      </div>  
      <div style="width:300px;margin:0 auto; padding:20px 0;">
            <a target="_blank" href=" " style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="@/assets/image/login/beian.png" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">粤公网安备 44030602004971号</p ></a>
      </div>    
    </div>

    <!-- <p class="bottom">深圳市开源节流科技有限公司</p> -->
  </div>
</template>
<script>
import { Checkbox, Message ,Carousel ,CarouselItem } from 'element-ui'
import { getCookieAll } from '@/utils/cookie'
import { getTrim } from '@/utils/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    ElCheckbox: Checkbox,
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem
  },
  data () {
    return {
      ruleForm: {},
      tid: null,
      bannerH: 0 , // banner盒子的高度
      carouselList:[
        {
          title:"安全智能",
          describe:"通过AI智能体系实现多维度、全流程的安全管理"
        },
        {
          title:"智慧物联",
          describe:"实现数据全面透明，可视可控"
        },
        {
          title:"数据分析",
          describe:"通过大数据分析，输出安全报告，大数据大价值"
        },
      ]
    }
  },
  computed: {
    ...mapGetters(
      ['language']
    )
  },
  created() {
    const cookies = getCookieAll();
    if (cookies && cookies.userCode && cookies.userPwd) {
      this.$set(this.ruleForm, 'userCode', cookies.userCode)
      this.$set(this.ruleForm, 'userPwd', cookies.userPwd)
      this.$set(this.ruleForm, 'checked', true)
    } else {
      this.$set(this.ruleForm, 'checked', false)
    }
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
    this.popstate();
    window.addEventListener('popstate', this.popstate);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('popstate', this.popstate);
  },
  methods: {
    /**
     * 窗口改变
     */
    resize() {
      this.bannerH = Math.floor(document.documentElement.clientWidth * 0.39);
    },
    /**
     * 防止页面回退
     */
    popstate() {
      history.pushState(null, '', document.URL);
    },
    /**
     * 用户名输入框的值change的时候
     */
    changeVal(ev) {
      let val = ev.target.value;
      val = getTrim(val);
      this.$set(this.ruleForm, 'userCode', val);
      // console.log(this.ruleForm.userCode);
    },
    //点击登录调用方法
    async submitForm() {
      // 保存的账号
      const { ruleForm, $store } = this
      const { userCode, userPwd } = ruleForm
      if (!userCode) {
        Message.error(this.$t('error.msgUserName'))
        return
      } else if (!userPwd) {
        Message.error(this.$t('error.msgPsw'))
        return
      }
      try {
        const tree = await $store.dispatch('user/login', ruleForm)
        this.$store.dispatch('data/clearTree')
        const logo = await $store.dispatch('user/logo')
        const v = tree[0]
        this.$router.push({ path: v.url, query: { code: v.code } })
      } catch(err) {

      }
    },
    /**
     * 切换中英文
     * @param {String} lang 语言类型
     */
    changeLang(lang) {
      this.$store.dispatch('user/language', lang)
      this.$i18n.locale = lang
    }
  }
}
</script>
<style scoped>

.box .top {
  overflow: hidden;
  padding: 14px 190px 6px 72px;
}
.box .top .left {
  float: left;
  overflow: hidden;
  padding: 5px 0 0;
}
.box .top .right {
  float: right;
  overflow: hidden;
}
.box .right .tel {
  float: left;
  color: #333;
  font-size: 16px;
  /* margin: 26px 80px 0 0; */
  margin: 26px 0 0;
  line-height: 24px;
}
.box .right img {
  float: left;
  width: 50px;
  height: 50px;
}
.box .left img {
  float: left;
  width: 134px;
  height: 40px;
}
.box .left .icon {
  float: left;
  width: 2px;
  height: 34px;
  margin: 6px 6px 0;
  background: #f19100;
}
.box .left p {
  color: #f19100;
  font-size: 18px;
  line-height: 20px;
  margin: 20px 0 0;
  float: left;
}
.box .banner {
  /* flex: 1; */
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  height: 740px;
  background: #00a2e9;
}
.box .banner img {
  width: 100%;
  height: 100%;
}
.box .content {
  width: 430px;
  position: absolute;
  top: 50%;
  right: 190px;
  transform: translateY(-50%);
  padding: 55px 50px 65px;
  box-sizing: border-box;
  background: #d1eefb;
  z-index: 9;
  border: 15px solid #66c7f2;
}
.box .input-text {
  width: 100%;
  margin: 20px 0 0;
  height: 40px;
}
.box >>> .input-text input {
  background: #d1eefb;
  border: #00a2e9 1px solid;
  border-radius: 0;
}
.box >>> .input-text .iconfont {
  color: #00a2e9;
  font-size: 20px;
}
.box .login-btn {
  width: 100%;
  margin: 20px 0 0;
  height: 40px;
  background: #00a2e9 !important;
}
.en-bar {
  overflow: hidden;
}
.en-bar .checkbox {
  float: left;
  margin: 20px 0 0;
}
.en-bar .text-type {
  float: right;
  font-size: 14px;
  color: #00a8d4;
  margin: 21px 6px 0 0;
  display: block;
  line-height: 19px;
}
.link-box .wrapper {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.link-box .wrapper .label {
  float: left;
  font-size: 16px;
  color: #333;
  line-height: 78px;
}
.link-box .wrapper ul {
  overflow: hidden;
  float: left;
}
.link-box ul li {
  float: left;
  padding: 0 10px;
}
.link-box ul a {
  display: flex;
  height: 78px;
  align-items: center;
}
.footer .bottom {
  color: #999;
  text-align: center;
  font-size: 12px;
  padding: 0 0 20px;
}
.footer .bottom a {
  font-size: 12px;
  color: #999;
}
.bannerCarousel{
  background-image: url('../assets/image/login/banner.png');
  background-size:contain;
}
.describe{
  color: #ffffff;
  position: absolute;
  bottom: 80px;
  left: 20%;
}
.describe h3{
  font-size: 30px;
}
.describe p{
  font-size: 20px;
  color: #ffffff;
  margin-top: 10px;
}
</style>