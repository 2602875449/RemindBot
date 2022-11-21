"use strict"
const xlsx = require('node-xlsx');
const {bot} = require("./index");
const {segment} = require("oicq");
const CronJob = require('cron').CronJob
// excel文件类径
const excelFilePath = "./excelList/1.xlsx"
const sheets = xlsx.parse(excelFilePath);

/**
 * 根据sheetName表格中的名字
 * @param sheetName 组别 string
 * @returns {*[]} names[]
 */
function getNames(sheetName) {
    let namesArray = [];
    sheets.filter(sheet => {
        if (sheet.name === sheetName) {
            namesArray = sheet.data;
        }
    });
    let names = [];
    namesArray.filter((value) => {
        return (value[1] !== "姓名")
    }).forEach(name => {
        names.push(name[1]);
    });
    return names;
}

//构造qq消息
async function ConstructionMsg(day, msg, gruop) {
    let names = [];
    //获取名字
    names = getNames(gruop);

    //获取群员名字
    let qqList = [];
    let memberMap = await msg.group.getMemberMap();
    memberMap.forEach(value => {
        names.forEach(names => {
            if (value.card.match(names)) {
                qqList.push(value.user_id);
            }
        })
    })
    //开始构造消息
    let message = [];
    message.push(`${day}核酸共：${qqList.length}人,`);
    //@响应的同学
    qqList.forEach(item => {
        message.push(segment.at(item));
    })
    return message;
}

async function sendMsg(msg, group) {
    // 发送消息
    let newVar1 = await ConstructionMsg("明天", msg, group);
    await msg.group.sendMsg(newVar1);
    new CronJob(
        '25 7 * * *', async function () {
            let newVar = await ConstructionMsg("今天", msg, group);
            await msg.group.sendMsg(newVar);
            this.stop();
        }, null, true, 'Asia/Shanghai');
}

//把表格中的sheet.name拿到放到 msgArray
let msgArray = [];
sheets.map(value => {
    msgArray.push(value.name);
});

bot.on("message.group", function (msg) {
    //当有消息是才会触发
    msgArray.forEach(function (value) {
        if (msg.raw_message.match(value)) {
            sendMsg(msg, value);
        }
    })
})
