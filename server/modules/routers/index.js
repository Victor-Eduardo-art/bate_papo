const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
 res.send('boa noite')
})

module.exports = router