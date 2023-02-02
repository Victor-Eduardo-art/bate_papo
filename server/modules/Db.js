const Sequelize = require('sequelize')
const dotEnd = require('dotenv')
const sequelize = new Sequelize(process.env.NAME_DATABASE, process.env.USERNAME_DATABASE, process.env.PASSWORD_DATABASE, {
    host: process.env.HOST_DATABASE,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,        
        }
    }
});

const User = sequelize.define('users', {
    userName: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    online: Sequelize.DataTypes.BOOLEAN,
    friends: Sequelize.DataTypes.JSON,
    myChats: Sequelize.DataTypes.JSON
})

/* user
    friends: [
        userName: name of friend,
        userName: name of friend,
        userName: name of friend,
    ]
*/

/* user/myChats [{
    name: userName + ' ' + friend's name

    myChats/history [
            {name: user, message.text, message.date},
        ]

    chat/message {
        text: STRING,
        date: DATE,
    }
},]
*/

User.sync()
    .then(() => console.log('sucesso ao criar a tabela users'))
    .catch(error => console.log(`Falha ao criar a tabela users... Erro: ${error}`))

sequelize.authenticate()
    .then(() => console.log('sucesso ao acessar o mysql'))
    .catch(error => console.log(`Falha ao acessar o mysql... Erro: ${error}`))

module.exports = {
    User: User,
    sequelize: sequelize,
}