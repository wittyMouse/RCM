import { Injectable } from '@angular/core'
import { MyHttpClient } from '../../../services/myHttp/myhttpClient.service'

export class SendData{
	page:number;
	rows:number;
	// serviceMan:string;
	qryStatus:number;
}

@Injectable()
export class AuthenticationService{
	constructor(
		private myHttp:MyHttpClient,
		){}
	getListData(sData:SendData):Promise<any>{
		return this.myHttp.get({
			api:this.myHttp.api.authMemberList,
			query:sData
		}).toPromise().then(res=>{
			let data=res
			if (data.status==200) {
				return Promise.resolve(data)
			}else{
				return Promise.reject(data)
			}
		})
	}




}