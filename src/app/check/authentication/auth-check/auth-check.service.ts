import { Injectable } from '@angular/core'
import { MyHttpClient } from '../../../../services/myHttp/myhttpClient.service'

export class SendData{
	authId
	auditBy
	status
	auditRemark?
}

@Injectable()
export class AuthCheckService{
	constructor(
		private myHttp:MyHttpClient
		){}

	getData(id:number):Promise<any>{
		return this.myHttp.get({
			api:this.myHttp.api.authMemberDetail,
			query:{
				authId:id
			}
		}).toPromise().then(res=>{
			let data=res;
			if (data.status==200) {
				 return Promise.resolve(data)
			}else{
				return Promise.reject(data)
			}
		})
	}

	memberAuthApplyReply(data:SendData){
		return this.myHttp.post({
			api:this.myHttp.api.memberAuthApplyReply,
			query:data
		}).toPromise().then(res=>{
			let data=res;
			if (data.status==200) {
				 return Promise.resolve(data)
			}else{
				return Promise.reject(data)
			}
		})
	}

	getFileUrl(id,mode?){
		return this.myHttp.sShow(id,mode)
				
	}
	downLoadFile(id){
		return this.myHttp.sDownLoad(id)
	}

}