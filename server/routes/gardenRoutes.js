const express = require('express')
const router = express.Router()
const { getGarden, waterGarden, cleanGarden } = require('../controllers/gardenController')

router.get('/:firebaseUid', getGarden)
router.post('/water', waterGarden)
router.post('/clean', cleanGarden)

module.exports = router