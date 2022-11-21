"use strict"
const {createClient} = require("oicq")

// const account = 3423980682
const account = 2103883644
// const password = ""
const config = {
    platform: 1,
}
const bot = createClient(account, config)

// bot.on("system.login.qrcode", function (e) {
// 	this.logger.mark("扫码后按Enter完成登录")
// 	process.stdin.once("data", () => {
// 		this.login()
// 	})
// }).login();


bot.on("system.login.slider", function (e) {
    console.log("输入ticket：")
    process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login(password)


exports.bot = bot

// template plugins
require("./plugin-request")
require("./plugin-timing");
require("./plugin-clock-in")


process.on("unhandledRejection", (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
