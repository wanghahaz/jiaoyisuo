import {marketCategoryList} from '@/api/center_api.js';
let list = [];
list = [{
		"type": 'hierarchy',
		"submenu": [
			{
				"name": '全部',
				"value": "全部",
				"submenu": [
				]
			},{
				"name": '买入',
				"value": "买入",
				"submenu": [
				]
			},{
				"name": '买出',
				"value": "买出",
				"submenu": [
				]
			},
		]
	},{
		"type": 'hierarchy',
		"submenu": [
			{
				"name": '全部',
				"value": "全部",
				"submenu": [
				]
			},{
				"name": '已撤单',
				"value": -1,
				"submenu": [
				]
			},{
				"name": '成交',
				"value": 3,
				"submenu": [
				]
			},
		]
	},
];
let obj = {};
async function getData() {
	let resData =  await marketCategoryList();
		obj.type = "hierarchy";
		obj.submenu = [
			{
				"name": '全部',
				"value": "全部",
				"submenu": [
				]
			}
		];
		for (let i = 0; i < resData.data.length; i++) {
			obj.submenu[i+1] = {
					"name": resData.data[i].categoryName,
					"value": resData.data[i].categoryName,
					"submenu": [
					]
			}
			for (let j = 0; j < resData.data[i].marketCategoryList.length; j++) {
				obj.submenu[i+1].submenu[j] = {
					"name": resData.data[i].marketCategoryList[j].marketMame,
					"value": resData.data[i].marketCategoryList[j].marketId
				}
			}
		}
		list.unshift(obj);
		return list
} 
// getData();
export default getData
// [{
		// name:'全部',
	// 	"type": 'hierarchy',
	// 	"submenu": [{
	// 			"name": '全部',
	// 			"value": "全部",
	// 			"submenu": [

	// 			]
	// 		},
	// 		{
	// 			"name": 'BTC',
	// 			"value": "BTC",
	// 			"submenu": [{
	// 					"name": "BTC/ETH",
	// 					"value": "BTC/ETH"
	// 				},
	// 				{
	// 						"name": "TOKEN/ETH",
	// 						"value": "TOKEN/ETH"
	// 					},
	// 					{
	// 						"name": "TOKEN2/ETH",
	// 						"value": "TOKEN2/ETH"
	// 						}
	// 			]
	// 		},
	// 		{
	// 			"name": 'ETH',
	// 			"value": "ETH",
	// 			"submenu": [{
	// 					"name": "BTC/ETH",
	// 					"value": "BTC/ETH"
	// 				}
	// 			]
	// 		},
	// 		{
	// 			"name": 'USTD',
	// 			"value": "USTD",
	// 			"submenu": [{
	// 					"name": "BTC/ETH",
	// 					"value": "BTC/ETH"
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	// {
	// 	"type": 'hierarchy',
	// 	"submenu": [
	// 		{
	// 				"name": '全部',
	// 				"value": "全部",
	// 				"submenu": [
			
	// 				]
	// 			},{
	// 			"name": '买入',
	// 			"value": "买入",
	// 			"submenu": [

	// 			]
	// 		},{
	// 			"name": '买出',
	// 			"value": "买出",
	// 			"submenu": [

	// 			]
	// 		},
	// 	]
	// },{
	// 	"type": 'hierarchy',
	// 	"submenu": [
	// 		{
	// 				"name": '全部',
	// 				"value": "全部",
	// 				"submenu": [
			
	// 				]
	// 			},{
	// 			"name": '未完成',
	// 			"value": "未完成",
	// 			"submenu": [

	// 			]
	// 		},{
	// 			"name": '已完成',
	// 			"value": "已完成",
	// 			"submenu": [

	// 			]
	// 		},
	// 	]
	// },
// ]