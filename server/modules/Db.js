const Sequelize = require('sequelize')
const sequelize = new Sequelize('batepapo', 'ptf99ujn3kngs3idvjpc', 'pscale_pw_fW4q8CQUIJeFun6up5lD9levkq6IAUiYWk7MyONRW8M', {
    host: 'us-east.connect.psdb.cloud',
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,        
        }
    }
});

// database: batepapo
// username: 69wr0cy1vj0whstf6iy2
// host: us-east.connect.psdb.cloud
// password: pscale_pw_uh88UL7JHi4VZ95weuCbnEVucouGOelwkqCKMhgZxlZ


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