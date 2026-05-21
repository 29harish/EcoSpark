const express = require('express')
const router = express.Router()
const { getMissions, submitMission, seedMissions } = require('../controllers/missionController')

router.get('/', getMissions)
router.post('/submit', submitMission)
router.post('/seed', seedMissions)

module.exports = router