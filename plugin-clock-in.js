/**
 * 该文件用来自动提醒打卡功能 每天7：26 9：30进行提醒健康打卡
 */
"use strict"
const axios = require("axios");
const {bot} = require("./index");
const {segment} = require("oicq");
const CronJob = require("cron").CronJob;

const groupId = 123456789

//这里放入奕辅导有管理员权限的token
const userAccessToken = '4h40DcionWzhOHlFbYLtSrYApAL+AdQEfaTFnj6FiBTiHIw7irVbVemJuyfpfYcA1bt5U+yODqQA7CyrmCn+7AVYKlWkFmKaXmGbJO4LZ0nmHkhJnX6332SdJ8udG9ls2kjxfYjqsaw/M9AiZ2Glqg==';
const baseURL = "https://yfd.ly-sky.com"
const request = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Host': 'yfd.ly-sky.com',
        'accept': '*/*',
        'accept-language': 'zh-cn',
        'userauthtype': 'MS',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac',
        'accesstoken': userAccessToken,
        'content-type': 'application/json'
    }
})

//获取到今日打卡的id
async function getNotReadListNames() {
    let respData = await request.get("/ly-pd-mb/form/api/healthCheckIn/client/stu/index");
    let todayQuestionId = await respData.data.data.questionnairePublishEntityId;
    let getNotReadList = await request.post("/ly-ms/application/api/st/cadres/questionnaireFillList", {keyword: todayQuestionId});
    return getNotReadList.data.data.notReadList;
}

/**
 * 构造消息
 * @returns {Promise<string[]>} 构造完成的消息
 */
async function ConstructionMsg(msg) {
    //没健康打卡的人
    let nameList = [];
    nameList.push(...await getNotReadListNames());
    let names = [];
    nameList.forEach(value => {
        names.push(value.userName);
    })

    let memberMap = await bot.getGroupMemberList(groupId);
    //匹配群成员放入qqList中
    let qqList = [];
    memberMap.forEach(value => {
        names.forEach(names => {
            if (value.card.match(names)) {
                qqList.push(value.user_id);
            }
        })
    })
    // 生成消息

    let message = [msg];
    qqList.forEach(item => {
        message.push(segment.at(item));
    });

    if (qqList.length === 0) {
        message = [];
        message.push("今日健康打卡全部完成！");
    }
    return message;
}


bot.on("message.group", async (msg) => {
    if (msg.raw_message === "未打卡") {
        let message = await ConstructionMsg("");
        await msg.group.sendMsg(message);
    }
})


//定时提醒还能继续优化
//定时提醒
new CronJob('26 7 * * *', async () => {
    let msg = "健康打卡提醒，"
    let message = await ConstructionMsg(msg);
    //发送消息
    bot.sendGroupMsg(groupId, message);
}, null, true, 'Asia/Shanghai');
// 未打卡提醒，
new CronJob('30 9 * * *', async () => {
    //这里想法是传入消息将消息放入ConstructionMsg中的message; (没写)
    let msg = "未打卡提醒，"
    let message = await ConstructionMsg(msg);
    //发送消息
    bot.sendGroupMsg(groupId, message);
}, null, true, 'Asia/Shanghai');


/*async function ConstructionMsg() {
    let nameList = [];
    //获取没打卡的人名字
    nameList.push(...await getNotReadListNames());
    let names = [];
    let qqList = [];
    let message = [];
    //遍历出名字
    nameList.forEach(value => {
        names.push(value.userName);
    });
    //获取群员名字
    // let memberMap = await msg.group.getMemberMap();
    let memberMap = await bot.getGroupMemberList(718241769);
    memberMap.forEach(value => {
        names.forEach(name => {
            if (value.card.match(name)) {
                qqList.push(value.user_id);
            }
        })
    })

    qqList.forEach(item => {
        message.push(segment.at(item));
    })
    console.log(message);
    return message;
}*/





