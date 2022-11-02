"use strict"
const {createClient} = require("oicq")

// const account = 3423980682
const account = 2103883644

const bot = createClient(account)

bot
	.on("system.login.qrcode", function (e) {
		this.logger.mark("扫码后按Enter完成登录")
		process.stdin.once("data", () => {
			this.login()
		})
	})
	.login()

exports.bot = bot

// template plugins
require("./plugin-request")
require("./plugin-timing")


process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
