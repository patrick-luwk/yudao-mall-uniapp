<!-- 欢乐颂 - 欢乐颂 -->
<template>
  <s-layout class="wallet-wrap" title="录入提醒">
    <!-- 信息统计卡片 -->
    <view class="header-box ss-flex ss-row-center ss-col-center">
      <view class="card-box ui-BG-Main ui-Shadow-Main">
        <view class="card-head ss-flex ss-col-center">
          <view class="card-title ss-m-r-10">大路桌号{{state.summary.tableId || 0}}</view>
          <view @tap="state.showMoney = !state.showMoney" class="ss-eye-icon"
            :class="state.showMoney ? 'cicon-eye' : 'cicon-eye-off'" />
        </view>
        <view class="ss-flex ss-row-between ss-col-center ss-m-t-30">
          <view class="card-title ss-m-r-10">{{
            state.summary.recordCount || 0
          }}</view>
          <view class="ss-flex">
            <view class="money-num">获利:{{
              state.moneyAll || 0
            }}</view>
          </view>
          <view class="ss-flex ss-row-between ss-col-center ss-m-t-30">
            <view class="ss-flex">
              <button class="ss-reset-button balance-btn ss-m-l-20" @tap="getADDInfo(false)">
                桩
              </button>
              <button class="ss-reset-button balance-btn ss-m-l-20" @tap="getADDInfo(true)">
                娴
              </button>
            </view>
          </view>
        </view>

        <view class="ss-flex">
          <view class="loading-money">
            <view class="loading-money-title">大路数据</view>
            <view class="loading-money-num">
              {{ state.showMoney ? state.summary.record || 0 : '*****' }}
            </view>
          </view>
        </view>
        <view class="ss-flex">
          <view class="loading-money">
            <view class="loading-money-title">建议</view>
            <view class="loading-money-num">
              {{ state.showMoney ? state.summary.suggestion || 0 : '*****' }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <s-empty v-if="state.pagination.total === 0" icon="/static/data-empty.png" text="暂无数据"></s-empty>

    <!-- 欢乐颂记录 -->
    <view v-if="state.pagination.total > 0">
      <view class="wallet-list ss-flex border-bottom" v-for="item in state.pagination.list" :key="item.id">
        <view class="list-content">
          <view class="title-box ss-flex ss-row-between ss-m-b-20">
            <text class="title ss-line-1">获利:{{ item.isWin ? "是" : "否" }}</text>
            <text>建议:{{ item.remindContent }}</text>
          </view>
        </view>
      </view>
    </view>

  </s-layout>
</template>

<script setup>
import { reactive } from 'vue';
import { onLoad  } from '@dcloudio/uni-app';
import _ from 'lodash-es';
import sheep from '@/sheep';
import BigroadApi from '@/sheep/api/baijia';


const headerBg = sheep.$url.css('/static/img/shop/user/wallet_card_bg.png');

const state = reactive({
  showMoney: false,
  summary: {}, // 分销信息
  bigroadId: '',
  pagination: {
    list: [],
    total: 0,
    pageNo: 1,
    pageSize: 100,
  },
  loadStatus: '',
  moneyAll: '',
});


async function getADDInfo(isOdd) {
  const { code, data } = await BigroadApi.addBigroad(state.bigroadId, isOdd);
  if (code !== 0) {
    return;
  }
  state.summary = data;
  state.summary.recordCount = `总次数:${state.summary.record.length}`;
  getLogList();
}

async function getOriginInfo() {
  const { code, data } = await BigroadApi.getBigroad(state.bigroadId);
  if (code !== 0) {
    return;
  }
  state.summary = data;
  state.summary.recordCount = `总次数:${state.summary.record.length}`;
}

async function getLogList() {
  state.loadStatus = 'loading';
  let { code, data } = await BigroadApi.getBigroadBidRecordPage({
    pageSize: state.pagination.pageSize,
    pageNo: state.pagination.pageNo,
    bigroadId: state.bigroadId
  });
  if (code !== 0) {
    return;
  }
  state.pagination.list = data.list;
  state.pagination.total = data.total;
  state.moneyAll = data.list.reduce((prev, item) => { return prev + (item.isWin ? 1 : -1) * item.bidAmount }, 0);
}

onLoad(async (options) => {
  // 非法参数
  if (!options.id) {
    state.summary = null;
    return;
  }
  state.bigroadId = options.id;
  getOriginInfo();
  getLogList();

});

</script>

<style lang="scss" scoped>
// 钱包
.header-box {
  background-color: $white;
  padding: 30rpx;

  .card-box {
    width: 100%;
    min-height: 300rpx;
    padding: 40rpx;
    background-size: 100% 100%;
    border-radius: 30rpx;
    overflow: hidden;
    position: relative;
    z-index: 1;
    box-sizing: border-box;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
      background: v-bind(headerBg) no-repeat;
      pointer-events: none;
    }

    .card-head {
      color: $white;
      font-size: 24rpx;
    }

    .ss-eye-icon {
      font-size: 40rpx;
      color: $white;
    }

    .money-num {
      font-size: 40rpx;
      line-height: normal;
      font-weight: 500;
      color: $white;
      font-family: OPPOSANS;
    }

    .reduce-num {
      font-size: 26rpx;
      font-weight: 400;
      color: $white;
    }

    .withdraw-btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 30px;
      font-size: 24rpx;
      font-weight: 500;
      background-color: $white;
      color: var(--ui-BG-Main);
    }

    .balance-btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 30px;
      font-size: 24rpx;
      font-weight: 500;
      color: $white;
      border: 1px solid $white;
    }
  }
}

.loading-money {
  margin-top: 56rpx;

  .loading-money-title {
    font-size: 24rpx;
    font-weight: 400;
    color: #ffffff;
    line-height: normal;
    margin-bottom: 30rpx;
  }

  .loading-money-num {
    font-size: 30rpx;
    font-family: OPPOSANS;
    font-weight: 500;
    color: #fefefe;
  }
}

// 筛选

.filter-box {
  height: 120rpx;
  padding: 0 30rpx;
  background-color: $bg-page;

  .total-box {
    font-size: 24rpx;
    font-weight: 500;
    color: $dark-9;
  }

  .date-btn {
    background-color: $white;
    line-height: 54rpx;
    border-radius: 27rpx;
    padding: 0 20rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: $dark-6;

    .ss-seldate-icon {
      font-size: 50rpx;
      color: $dark-9;
    }
  }
}

// tab
.wallet-tab-card {
  .tab-item {
    height: 80rpx;
    position: relative;

    .tab-title {
      font-size: 30rpx;
    }

    .cur-tab-title {
      font-weight: $font-weight-bold;
    }

    .tab-line {
      width: 60rpx;
      height: 6rpx;
      border-radius: 6rpx;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 2rpx;
      background-color: var(--ui-BG-Main);
    }
  }
}

// 钱包记录
.wallet-list {
  padding: 30rpx;
  background-color: #ffff;

  .head-img {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background: $gray-c;
  }

  .list-content {
    justify-content: space-between;
    align-items: flex-start;
    flex: 1;

    .title {
      font-size: 28rpx;
      color: $dark-3;
      width: 400rpx;
    }

    .time {
      color: $gray-c;
      font-size: 22rpx;
    }
  }

  .money {
    font-size: 28rpx;
    font-weight: bold;
    font-family: OPPOSANS;

    .add {
      color: var(--ui-BG-Main);
    }

    .minus {
      color: $dark-3;
    }
  }
}

.model-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.model-subtitle {
  font-size: 26rpx;
  color: #c2c7cf;
}

.model-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: normal;
}

.input-box {
  height: 100rpx;

  .unit {
    font-size: 48rpx;
    color: #333;
    font-weight: 500;
    line-height: normal;
  }

  .uni-easyinput__placeholder-class {
    font-size: 30rpx;
    height: 40rpx;
    line-height: normal;
  }
}
</style>
