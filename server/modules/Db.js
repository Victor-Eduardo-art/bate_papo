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

const User = sequelize.define('user', {
    nome: Sequelize.DataTypes.STRING,
    message: Sequelize.DataTypes.JSON,
    conversation_history: Sequelize.DataTypes.JSON,

    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

User.sync()
    .then(() => console.log('sucesso ao criar a tabela'))
    .catch(error => console.log(`Falha ao criar a tabela... Erro: ${error}`))

sequelize.authenticate()
    .then(() => console.log('sucesso ao acessar o mysql'))
    .catch(error => console.log(`Falha ao acessar o mysql... Erro: ${error}`))

module.exports = sequelize