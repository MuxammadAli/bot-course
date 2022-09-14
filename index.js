
const TelegramBot = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5601493931:AAHBDtBdNLTvF_ngtdHi8A5YDtIY01p8ClM';

const bot = new TelegramBot(token, {polling:true})

const chats = {}




const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадываю цыфру от 0 до 9, а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить инормацию о пользователе'},
        {command: '/game', description: 'Игра угадай цыфру'}
    ])
    
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://bestoftelegram.com/stickers/img/DevRunner/DevRunner1.jpg')
            return bot.sendMessage(chatId, 'writing with me telegram bot start')
        }
    
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if(text === '/game'){
            return startGame(chatId)   
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })
    
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цыфру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цыфру ${chats[chatId]}`, againOptions)
        }
    }) 
}

start()