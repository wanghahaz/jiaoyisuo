<script>
import { checkUpdata } from '@/api/system_api';

export default {
  async onLaunch() {
    uni.getSystemInfo({
      success: system => {
        let device = system.platform == 'ios' ? '1' : system.platform == 'android' ? '2' : '0';
        console.log( plus.runtime.version)
        checkUpdata({
          type: 2,
          version: plus.runtime.version
        }).then(checkres => {
          console.log(checkres)
          if (checkres.success) {
            uni.showModal({
              //提醒用户更新
              title: '更新提示',
              content: '检测到有新版本，请更新到最新版本',
              showCancel: true,
              confirmColor: '#48BEA4',
              confirmText: '去更新',
              success: res => {
                if (res.confirm) {
                  plus.runtime.openURL(checkres.data.downloadUrl);
                }
              }
            });
          }
        });
      }
    });
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  }
};
</script>

<style>
@import './common/qiun.css';

body {
  height: 100%;
}

uni-page-body {
  height: 100%;
  background: #f5f5f5;
  color: #333;
}

view {
  box-sizing: border-box;
}

.theme_bg {
  background-color: #36303f !important;
}

.theme_color {
  background-color: #5dc1cf !important;
}

.pd30 {
  padding: 30upx;
}

.pd23 {
  padding: 20upx 30upx;
}

.bcf {
  background-color: #fff;
}

.ft6 {
  font-weight: 600;
}

.bb {
  border-bottom: 1px solid #f5f5f5;
}

.small {
  transform: scale(0.5);
}
</style>
