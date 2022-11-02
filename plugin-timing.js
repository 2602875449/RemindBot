"use strict"
const xlsx = require('node-xlsx');
const {bot} = require("./index");
const {segment} = require("oicq");
const CronJob = require("cron").CronJob;

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
    }).forEach((name) => {
        names.push(name[1]);
    });
    return names;
}

//构造qq消息
async function ConstructionMsg(day, msg) {
    let names = [];
    let qqList = [];
    let message = [];

    //获取名字
    names = getNames(msg.raw_message.slice(2, 5));
    // console.log(names);
    //获取群员名字
    let memberMap = await msg.group.getMemberMap();

    memberMap.forEach(value => {
        names.forEach(names => {
            if (value.card.match(names)) {
                qqList.push(value.user_id);
            }
        })
    })
    message.push(`${day}核酸共${qqList.length}人`);
    // console.log(qqList);
    qqList.forEach(item => {
        message.push(segment.at(item));
    })

    return message;

}

//把表格中的sheet.name拿到放到 msgArray
let msgArray = [];
sheets.map(value => {
    msgArray.push("明天" + value.name + "核酸");
});

bot.on("message.group", function (msg) {
    //当有消息是才会触发
    msgArray.forEach(value => {
        if (msg.raw_message.includes(value)) {
            // 发送消息
            ConstructionMsg("明天", msg).then(r => {
                msg.group.sendMsg(r);
            });

            new CronJob(
                '20 7 * * *',
                function () {
                    ConstructionMsg("今天", msg).then(r => {
                        msg.group.sendMsg(r);
                    })
                }, null, true, 'Asia/Shanghai'
            );
        }
    })

})
