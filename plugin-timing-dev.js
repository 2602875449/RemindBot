// "use strict"
// const xlsx = require('node-xlsx');
// const {bot} = require("./index");
// const {segment} = require("oicq");
// const CronJob = require('cron').CronJob
// // excel文件类径
// const excelFilePath = "./excelList/1.xlsx"
// const sheets = xlsx.parse(excelFilePath);
// const groupId = 718241769;
//
// /**
//  * 根据sheetName表格中的名字
//  * @param sheetName 组别 string
//  * @returns {*[]} names[]
//  */
// function getNames(sheetName) {
//     let namesArray = [];
//     sheets.filter(sheet => {
//         if (sheet.name === sheetName) {
//             namesArray = sheet.data;
//         }
//     });
//     let names = [];
//     namesArray.filter((value) => {
//         return (value[1] !== "姓名")
//     }).forEach((name) => {
//         names.push(name[1]);
//     });
//     return names;
// }
//
// //构造qq消息
// async function ConstructionMsg(day, gruop) {
//     //获取名字
//     let names = getNames(gruop);
//
//     //获取群员名字
//     let memberMap = await bot.getGroupMemberList(groupId);
//     //匹配群中未打卡的人
//     let qqList = [];
//     memberMap.forEach(value => {
//         names.forEach(names => {
//             if (value.card.match(names)) {
//                 qqList.push(value.user_id);
//             }
//         })
//     })
//     //开始构造消息
//     let message = [];
//     message.push(`${day}核酸共：${qqList.length}人,`);
//     //@响应的同学
//     qqList.forEach(item => {
//         message.push(segment.at(item));
//     })
//     return message;
// }
//
//
// async function sendMsg(group) {
//     // 发送消息
//     let message = await ConstructionMsg("明天", group);
//     let tomorrowMessage = await ConstructionMsg("今天", group);
//     bot.sendGroupMsg(groupId, message);
//     runEveryDay(tomorrowMessage)
// }
//
//
//
// // let job = new CronJob('*/1 * * * *',async function runEveryDay (tomorrowMessage){
// //     await bot.sendGroupMsg(groupId, tomorrowMessage);
// // },null,true,'Asia/Shanghai');
// //
// // job.stop();
//
// bot.on("message.group", function (msg) {
//
//     msgArray.forEach(function (group) {
//         if (msg.raw_message.match(group)) {
//             sendMsg(group);
//
//         }
//     })
// })
