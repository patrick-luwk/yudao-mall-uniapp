import store from "../store";
import Cache from '../utils/cache';
import { Debounce } from '@/utils/validate.js'
// #ifdef H5
import { isWeixin } from "../utils";
import auth from './wechat';
// #endif

import { LOGIN_STATUS, USER_INFO, EXPIRES_TIME, STATE_R_KEY, BACK_URL} from './../config/cache';

function prePage(){
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 1];
	return prePage.route;
}

export const toLogin = Debounce(_toLogin,800)

export function _toLogin(push, pathLogin) {

	store.commit("LOGOUT");
	let path = prePage();
	let login_back_url = Cache.get(BACK_URL);
	// #ifdef H5
	// path = location.href;
	path = location.pathname + location.search;
	// #endif
	if(!pathLogin){
		pathLogin = '/page/users/login/index'
		Cache.set('login_back_url',path);
	}

	// #ifdef H5
	if (isWeixin()) {
		let urlData = location.pathname + location.search
		if (!Cache.has('snsapiKey')) {
      // TODO 芋艿：先临时禁用掉，改成普通登录页
      // auth.oAuth('snsapi_base', urlData);
      uni.navigateTo({
        url: '/pages/users/login/index'
      })
		} else {
			if (['/pages/user/index'].indexOf(login_back_url) == -1) {
				uni.navigateTo({
					url: '/pages/users/wechat_login/index'
				})
			}
		}
	} else {
		if (['/pages/user/index'].indexOf(login_back_url) == -1) {
			uni.navigateTo({
				url: '/pages/users/login/index'
			})
		}
	}
	// #endif

	if (['pages/user/index','/pages/user/index'].indexOf(login_back_url) == -1) {
		// #ifdef MP
    // TODO 芋艿：先临时禁用掉，改成普通登录页
    uni.navigateTo({
      url: '/pages/users/login/index'
    })
		// #endif
	}
}


export function checkLogin()
{
	let token = Cache.get(LOGIN_STATUS);
	let expiresTime = Cache.get(EXPIRES_TIME);
	let newTime = Math.round(new Date() / 1000);
	if (expiresTime < newTime || !token){
		Cache.clear(LOGIN_STATUS);
		Cache.clear(EXPIRES_TIME);
		Cache.clear(USER_INFO);
		Cache.clear(STATE_R_KEY);
		return false;
	}else{
		store.commit('UPDATE_LOGIN',token);
		let userInfo = Cache.get(USER_INFO,true);
		if(userInfo){
			store.commit('UPDATE_USERINFO',userInfo);
		}
		return true;
	}

}
