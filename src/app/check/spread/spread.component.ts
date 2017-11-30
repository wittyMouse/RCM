// import { Component,OnInit } from '@angular/core';
// import { Router,ActivatedRoute,Params } from '@angular/router';
// import { SpreadService,SendData } from './spread.service';
// import { PopService } from 'dolphinng'

// @Component({
// 	moduleId: module.id,
// 	selector: 'spread',
// 	templateUrl: 'spread.component.html',
// 	styleUrls:['spread.component.less'],
// 	providers:[SpreadService]

// })
// export class SpreadComponent implements OnInit {
// 	dataList:any
// 	status="1"

// 	path:string='check/spread'

// 	//分页参数
// 	loading:boolean
// 	page:number=0;
// 	count:number
// 	rows:number=10;
// 	authApplyReplyNum:number
// 	constructor(
// 		private authList:SpreadService,
// 		private router:Router,
// 		private route:ActivatedRoute,
// 		private pop:PopService,

// 		){}

// 	ngOnInit(){
// 		// if (this.route.queryParams['value']['status']) {
// 		// 	this.status=this.route.queryParams['value']['status']
// 		// }
// 		// this.getList(this.status)
// 		this.subscribeRouteParams()

// 	}
// 	subscribeRouteParams() {
//   this.route.params.subscribe((params: Params)=> {
//     // let tabIndex = params['tab'] ? parseInt(params['tab']) : 0;
// 		let status = params['status'] ? params['status'] : 1;
//     let page = params['page'] ? parseInt(params['page']) : 0;
//     let rows = params['rows'] ? parseInt(params['rows']) : this.rows;
//     // let companyName = params['companyName'] ? params['companyName'] : '';
//     // let borrowApplyId = params['borrowApplyId'] ? params['borrowApplyId'] : '';
// 		this.status = status;
//     this.page = page;
//     this.rows = rows;
// 		console.log(params)
// 		console.log(params['status'])
// 		console.log(this.status)


//     this.getList(this.status);
//   });
// }
// navigate(status) {
//   // let tab = 0;
//   // for (let i = 0, len = this.tabs.length; i < len; i++) {
//   //   if (this.tabs[i].active) {
//   //     tab = i;
//   //     break;
//   //   }
//   // }
// 	this.status=status
//   let params: {
//     status,
//     page: number,
//     rows: number,
//     companyName?: string,
//     borrowApplyId?: string,
//   } = {
//     status: status,
//     page: this.page,
//     rows: this.rows,
//   };
// 	console.log(params)
//   // if (this.params.companyName !== '') {
//   //   params.companyName = this.params.companyName;
//   // }
//   // if (this.params.borrowApplyId !== '') {
//   //   params.borrowApplyId = this.params.borrowApplyId;
//   // }
//   this.router.navigate([this.path, params]);
// }


// 	getList(type){
// 		this.authApplyReplyNum=type
// 		// this.router.navigate(['check/spread'], { queryParams: {status:type} });
// 		let sendData:SendData={
// 			page:this.page+1,
// 			rows:this.rows,
// 			// serviceMan:this.authRole.userName,
// 			qryStatus:type,
// 		}
// 		this.authList.getListData(sendData)
// 					.then(res=>{
// 						this.handleListData(res)
// 					})
// 					.catch(res=>{
// 						this.pop.error({
// 							title:'错误提示',
// 							text:res.message
// 						})
// 					})
// 	}
// 	handleListData(res){
// 		console.log(res);
// 		this.loading=false;
// 		this.count=res.body.paginator.totalCount;
// 		this.dataList=res.body.records;
// 	}

	

// 	replaceDate(date:string):string{
//     if(typeof date==='string'){
//       return date.replace(/-/g,'/');
//     }else{
//       return date;
//     }
//   }
// }

import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap } from '@angular/router'
import { PopService } from 'dolphinng'
import { SpreadService,SendData } from './spread.service';

@Component({
	moduleId: module.id,
	selector: 'spread',
	templateUrl: 'spread.component.html',
	styleUrls:['spread.component.less'],
	providers:[SpreadService]

})
export class SpreadComponent implements OnInit {
    loading:boolean

    rolloverApplyId              //展期单号
    companyName                  //会员名称
    borrowApplyId                //贷款单号
    repaymentAmount              //展期金额(元)
    currentPeriod                //还款期数
    currentPeriodStr             //还款期数，中文
    createTime                   //申请日期
    status                       //状态
    statusName                   //状态,中文
    rolloverStartDate            //展期开始日期

    rows:number=10
	page:number=0
    count:number
    
    qryStatus=2                     //请求状态
    keyWord                         //请求关键字

    dictList:any[]
    dataList:any[]



    thisPageRoute:string='check/spread'
    constructor(
		private authList:SpreadService,
		private router:Router,
		private route:ActivatedRoute,
		private pop:PopService,
		){}

	ngOnInit(){
        this.getStatusList()
        this.subscribeRouteParams()
    }
    
	subscribeRouteParams(){
		this.route.paramMap.subscribe((paramMap:ParamMap)=>{
			console.log(paramMap)
			console.log(paramMap['params']['rows'])
			console.log(!!paramMap['params'])
	
		    paramMap['params']['rows']?this.rows=parseInt(paramMap['params']['rows']):null
            paramMap['params']['page']?this.page=parseInt(paramMap['params']['page']):null
            paramMap['params']['qryStatus']?this.qryStatus=paramMap['params']['qryStatus']:null
			paramMap['params']['keyWord']?this.keyWord=paramMap['params']['keyWord']:null

			this.getDataList()
		})
	}

	navigate(){
		let routeParam:{
			page,
            rows,
            qryStatus?,
            keyWord?
		}={
			page:this.page,
            rows:this.rows,
        }
        
        if(this.qryStatus){
            routeParam.qryStatus=this.qryStatus
        }
        
        if(this.keyWord){
            routeParam.keyWord=this.keyWord
        }

		console.log("router",this.router)
		console.log("activerouter",this.route)
		this.router.navigate([this.thisPageRoute,routeParam])
    }

    getStatusList(){
        this.authList.getStatusList()
        .then(res=>{
            this.loading=false
            console.log(res)
            this.dictList=res.body.records
        })
        .catch(res=>{
            this.pop.error({
                title:'错误提示',
                text:res.message
            })
        })
    }
    
    getDataList(){
		this.loading=true
		let sendData:SendData={
			rows:this.rows,
            page:this.page+1,
            status:this.qryStatus,                  //请求状态
            companyName:this.keyWord,           //会员名称（支持模糊模糊匹配）
		}
		this.authList.getDataList(sendData)
			.then(res=>{
                this.handleData(res)
			})
			.catch(res=>{
				this.pop.error({
					title:'错误提示',
					text:res.message
				})
			})
    }
    
    handleData(res){
        console.log(res)
        this.loading=false
        this.dataList=res.body.records
        this.count=res.body.paginator.totalCount
        // this.format(this.dataList)
    }

    //展期开始日期格式化（由于展期是从第二天开始计算，所以展期开始日期需要加一天）
    // format(dataList:any[]){
    //     let temp:any
    //     let dataString:any
    //     let repaymentDate:string
    //     let dataTimeArray:any[]
    //     if(dataList&&dataList.length>0){
    //         for(let i=0;i<dataList.length;i++){
    //             dataTimeArray=dataList[i].repaymentDate.split(" ")
    //             dataString=new Date(dataTimeArray[0]);
    //             dataString.setDate(dataString.getDate()+1)
    //             repaymentDate=dataString.getFullYear()+'-'+(dataString.getMonth()<10?('0'+dataString.getMonth()):dataString.getMonth())+'-'+(dataString.getDate()<10?('0'+dataString.getDate()):dataString.getDate())
    //             dataList[i].repaymentDate=repaymentDate+' '+dataTimeArray[1]
    //         }
    //     }
    // }

    check(data){
		this.router.navigate(['check/spread/spreadCheck',data.rolloverApplyId])
	}

	detail(data){
		this.router.navigate(['check/spread/spreadDetail',data.rolloverApplyId])
	}
}