import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PopService } from 'dolphinng';
import { CreditDetailService } from './credit-detail.service'
import { GalleryComponent} from 'dolphinng';
@Component({
	selector:'credit-detail',
	templateUrl:'./credit-detail.component.html',
	styleUrls:['./credit-detail.component.less'],
	providers:[CreditDetailService]
})
export class CreditDetailComponent implements OnInit{
	creditAuthId:number; 			//申请ID
	createTime:string;		//申请时间	

	expiryDateBegin
	expiryDateEnd
	addCreditValue
	memberName
	memberId
	productName
	productTypeName
	serviceMan:string;		//服务经理
	totalCreditValue:number=0

	oldCreditValue
	authRemark
	auditBy:string;			//审核人
    auditRemark:string;		//审核意见
    auditDate:string;		//审核时间
	status
    statusDic               //状态，中文
    productList

    memberRating			//会员评级
    memberRatingGrate		//会员评分：
	constructor(
		private router:Router,
		private route:ActivatedRoute,
		private pop:PopService,
		private creditDetail:CreditDetailService
		){
		// setTimeout(()=>{
		// 	this.gallery.open();
		// },3000);
		
	} 
	ngOnInit(){
		this.getData();
	}

	getData(){
		this.creditDetail.getData(this.route.params['value']['id'])
						.then(res=>{
							console.log(res)
							this.handle(res)
							return Promise.resolve(res.body.memberId)
							.then(res=>{
								this.creditDetail.getProductsList(res)
								.then(res=>{
									console.log(res)
									this.productList=res.body.records
									if(this.productList&&this.productList.length>0){
										for(let i=0;i<this.productList.length;i++){
											if (this.productList[i].creditFacility) {
												this.totalCreditValue+=this.productList[i].creditFacility.creditValue
											}
										}
									}
								})
								.catch(res=>{
									this.pop.error({
										title:'错误信息',
										text:res.message
									})
								})
							})
						})
	}

	handle(res){
		console.log(res)
		this.creditAuthId=res.body.creditAuthId; 			//申请ID
		this.createTime=res.body.createTime
		this.expiryDateBegin=res.body.expiryDateBegin
		this.expiryDateEnd=res.body.expiryDateEnd
		this.addCreditValue=res.body.addCreditValue
		this.memberName=res.body.memberName
		this.memberId=res.body.memberId
		this.productName=res.body.productName
		this.productTypeName=res.body.productTypeName
		this.serviceMan=res.body.serviceMan;		//服务经理
		this.oldCreditValue=res.body.oldCreditValue
		this.auditDate=res.body.auditDate
		this.authRemark=res.body.authRemark
		this.auditBy=res.body.auditBy;			//审核人
	    this.auditRemark=res.body.auditRemark;		//审核意见
	    this.status=res.body.status
	    this.statusDic=res.body.statusDic       //状态，中文
	    this.memberRating=res.body.memberRating
		this.memberRatingGrate=res.body.memberRatingGrate
	}


	

	back(){
		this.router.navigate(['check/credit'],{queryParams:{status:'2'}})
		
	}

}