const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

app.use(cors())

app.post('/sendFile', (req, res) => {
	setTimeout(() => {
		return res.json({
			result:
				'Это результат, который выдаёт нейронка после анализа голоса. Задержка 1000мс.',
		})
	}, 1000)
})

app.listen(PORT, err => {
	if (err) console.log(err)
	console.log(`Сервер запущен на ${PORT} порту`)
})
