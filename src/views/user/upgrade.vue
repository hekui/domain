<template>
  <div class="page-upgrade">
    <div class="user-title">升级会员</div>
    <div class="main">
      <div class="upgrade-tips">
        赞助本站，可升级会员。
      </div>
      <el-table
        :data="levelData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="会员级别"
          width="160">
        </el-table-column>
        <el-table-column
          prop="expire"
          label="会员有效期"
          width="160">
        </el-table-column>
        <el-table-column
          prop="price"
          label="赞助金额"
          width="160">
          <template slot-scope="scope">
            <span class="green">￥{{ scope.row.price }} 元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
      </el-table>
      <div class="code-wrap clearfix">
        <div class="code-item">
          <div class="code">
            <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
          </div>
          <p>支付宝</p>
        </div>
        <div class="code-item">
          <div class="code">
            <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
          </div>
          <p>微信</p>
        </div>
        <div class="code-item">
          <div class="code">
            <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
          </div>
          <p>客服微信，扫码联系</p>
        </div>
        <el-alert
          title="扫码赞助，请备注会员账号。"
          type="success"
          :closable="false">
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelData: [{
        name: '体验会员',
        price: '4.99',
        expire: '1天',
        remark: '仅新用户首次可用',
      }, {
        name: '月度会员',
        price: '19.9',
        expire: '1个月',
        remark: '每天约0.66元',
      }, {
        name: '季度会员',
        price: '36',
        expire: '3个月',
        remark: '月均12元，每天约0.4元',
      }, {
        name: '半年会员',
        price: '59',
        expire: '6个月',
        remark: '月均约9.83元，每天约0.33元',
      }, {
        name: '年度会员',
        price: '96',
        expire: '12个月',
        remark: '月均8元，每天约0.26元',
      }]
    }
  }
}
</script>

<style lang="scss">
.page-upgrade{
  .upgrade-tips{
    margin-bottom: 15px;
  }
  .code-wrap{
    margin: 30px 80px 20px;
    .code-item{
      width: 33%;
      display: inline-block;
      text-align: center;
      img{
        width: 140px;
        height: 140px;
        display: block;
        margin: 0 auto 10px;
      }
    }
  }
}
</style>
