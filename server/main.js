const express = require('express')
const dotenv = require('dotenv').config() 
const app = express()
const cors = require('cors')
const Db = require('./modules/Db')
const { cripto } = require('cripto')
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: [
            process.env.HOST_CLIENT,
        ]
    }
});

console.clear()

app.use(express.json())
app.use(cors())

io.on('connection', (socket) => {
    socket.on('online', (online) => {
        socket.on('getName', (name) => {
            Db.User.findOne({where: {userName: name}})
                .then((data) => {
                    data.online = true

                    data.save()
            }).catch((error) => console.log(error))

            socket.on('disconnect', () => {
                console.log('saiu! mas saiu satisfeito');
        
                Db.User.findOne({where: {userName: name}})
                    .then((data) => {
                        data.online = false
                        data.save()
                    }).catch((error) => console.log(error))
            });

            socket.on('userBlocked', (data) => {
                console.log(`user blocked: ${data}`)
                socket.broadcast.emit('getUserBlocked', data)
            })

            socket.on('addUser', (data) => {
                console.log(`new friend: ${data}`)
                socket.broadcast.emit('getNewsFriends', data)
            })

            socket.on('sendMessage', (message) => {
                console.log(message)
                socket.broadcast.emit('getMessage', message)
            })
        })
    })
})

// ### ROUTERS ### 
    app.post('/signup', (req, res) => {
        const datasUser = {
            userName: req.body.userName,
            password: req.body.password
        }

        const date = new Date()

        Db.User.create({
            userName: datasUser.userName,
            password: cripto.toCode(datasUser.password),
            online: false,
            friends: [{
                userName: datasUser.userName,
                blocked: false
            }],
            myChats: [{
                name: `${datasUser.userName} (you)`,
                message: {
                    text: 'boas vindas',
                    date: date.toLocaleString(),
                    user: datasUser.userName
                },
                history: [{
                    text: 'boas vindas', 
                    date: date.toLocaleString,
                    user: datasUser.userName 
                }]
            }]
        }).then(() => {
            res.send(datasUser)
        })

    })

    app.post('/signin', (req, res) => {
        const userName = req.body.userName
        const password = req.body.password

        const user = Db.User.findOne({where: {userName: userName, password: cripto.toCode(password)}})
            .then((data) => {
                console.log(data.userName)
                res.send(data)
            }).catch((error) => console.log(error))

    })

    app.post('/addChat', (req, res) => {
        const userName = req.body.userName
        const friendName = req.body.friendName
        const message = req.body.message
        const date = new Date()

        Db.User.findOne({where: {userName: friendName}})
            .then((data) => {
                if (data !== null) {
                    Db.User.findOne({where: {userName: userName}})
                        .then((dataUser) => {
                            let chats = 'user already added'
                            let friendsAmount = 0

                            for (let i = 0; i < dataUser.friends.length; i++) {
                                if (dataUser.friends[i].userName !== friendName) {
                                    friendsAmount++
                                }
                            }

                            if (friendsAmount === dataUser.friends.length) {
                                dataUser.friends = [...dataUser.friends, {
                                    userName: friendName,
                                    blocked: false
                                }]

                                dataUser.myChats = [...dataUser.myChats, {
                                    name: friendName,
                                    message: {
                                        text: message,
                                        date: date.toLocaleString(),
                                        user: userName
                                    },
                                    history: [{
                                        text: message, 
                                        date: date.toLocaleString(), 
                                        user: userName
                                    }]
                                }]
                                dataUser.save()
                                chats = dataUser.myChats
                            } else if (dataUser.friends[0].userName === friendName) {
                                chats = 'this user is you'
                            }

                            res.send(chats)
                        })

                    Db.User.findOne({where: {userName: friendName}})
                        .then((dataUser) => {
                            let friendsAmount = 0

                            for (let i = 0; i < dataUser.friends.length; i++) {
                                if (dataUser.friends[i].userName !== userName) {
                                    friendsAmount++
                                }

                            }

                            if (friendsAmount === dataUser.friends.length) {
                                dataUser.friends = [...dataUser.friends, {
                                    userName: userName,
                                    blocked: false
                                }]
                                dataUser.myChats = [...dataUser.myChats, {
                                    name: userName,
                                    message: {
                                        text: message,
                                        date: date.toLocaleString(),
                                        user: userName
                                    },
                                    history: [{
                                        text: message, 
                                        date: date.toLocaleString(), 
                                        user: userName
                                    }]
                                }]
                                dataUser.save()
                            }
                        })
                } else {
                    res.send('user not found')
                }

            }).catch((error) => {
                console.log(error)
            })

            
    })

    app.post('/getMyChats', (req, res) => {
        let userName = req.body.userName

        Db.User.findOne({where: {userName: userName}})
            .then((dataUser) => {
                let sendChats = []
                dataUser.myChats[0].name = userName + ' (you)'
                dataUser.friends[0].userName = userName + ' (you)'

                if (dataUser !== null) {
                    for (let i = 0; i < dataUser.myChats.length; i++) {
                        if (dataUser.myChats[i].name === dataUser.friends[i].userName && dataUser.friends[i].blocked === false) {
                            sendChats = [...sendChats, dataUser.myChats[i]]
                        }
                    }

                    res.send(sendChats)
                }
            })
        
    })

    app.post('/getChat', (req, res) => {
        const chatName = req.body.chatName
        const userName = req.body.userName

        Db.User.findOne({where: {userName: userName}})
            .then((data) => {
                if (data !== null) {
                    for (let i = 0; i < data.myChats.length; i++) {
                        data.myChats[i].name === chatName && res.send(data.myChats[i])
                    }
                } else {
                    console.log('error, user not found')
                }
            }).catch((error) => console.log(error))
    })

    app.post('/getOnline', (req, res) => {
        const chatName = req.body.chatName

        Db.User.findOne({where: {userName: chatName}})
            .then((data) => {
                if (data !== null) {
                    res.send(data.online)
                } else {
                    console.log('error, user not found')
                }
            }).catch((error) => console.log(error))
    })

    app.post('/sendMessage', (req, res) => {
        const chatName = req.body.chatName // chatName === friendName
        const userName = req.body.userName
        const message = req.body.message
        const date = new Date()

        Db.User.findOne({where: {userName: userName}})
            .then((data) => {
                if (data !== null) {
                    for (let i = 0; i < data.myChats.length; i++) {
                        if (data.myChats[i].name === chatName) {
                            const historyTmp = data.myChats[i].history

                            data.myChats.splice(i,1)

                            data.myChats = [...data.myChats, {
                                name: chatName,
                                online: data.online,
                                message: {
                                    text: message,
                                    date: date.toLocaleString(),
                                    user: userName
                                },
                                history: [...historyTmp, {
                                    text: message, 
                                    date: date.toLocaleString(), 
                                    user: userName
                                }]
                            }]
                            
                            data.save()
                            res.send(data.myChats[i])
                        }
                    }
                }

            }).catch((error) => {
                console.log(error)
            })

        Db.User.findOne({where: {userName: chatName}})
            .then((data) => {
                if (data !== null) {
                    for (let i = 0; i < data.myChats.length; i++) {
                        if (data.myChats[i].name === userName) {
                            const historyTmp = data.myChats[i].history

                            data.myChats.splice(i,1)

                            data.myChats = [...data.myChats, {
                                name: userName,
                                online: data.online,
                                message: {
                                    text: message,
                                    date: date.toLocaleString(),
                                    user: userName
                                },
                                history: [...historyTmp, {
                                    text: message, 
                                    date: date.toLocaleString(), 
                                    user: userName
                                }]
                            }]
                            
                            data.save()
                        }
                    }
                }

            }).catch((error) => {
                console.log(error)
            })
    })

    app.get('/getChatsData', (req, res) => {
        Db.User.findAll().then((data) => {
            res.send(data)
        })
    })

    app.post('/blockUser', (req, res) => {
        const userName = req.body.userName
        const userBlock = req.body.userBlock

        Db.User.findOne({where: {userName: userName}}).then((data) => {
            for (let i = 0; i < data.friends.length; i++) {
                if (data.friends[i].userName === userBlock) {
                    data.friends.splice(i,1)

                    data.friends = [...data.friends, {
                        userName: userBlock,
                        blocked: true
                    }]

                    data.save()
                    res.send(data.friends[i])

                    Db.User.findOne({where: {userName: userBlock}}).then((dataUserBlock) => {
                        dataUserBlock.friends.splice(i,1)

                        dataUserBlock.friends = [...dataUserBlock.friends, {
                            userName: userName,
                            blocked: true
                        }]

                        dataUserBlock.save()
                    }).catch((error) => console.log(error))
                }
            }
        }).catch((error) => console.log(error))
    })

server.listen(process.env.PORT_SERVER, () => console.log(`server rodando em localhost:${process.env.PORT_SERVER}`))