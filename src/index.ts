import express from 'express'

const APP_PORT = 1234

const app = express()
// app.use('/pets', PetsController)
app.get('/', (req, res) => res.send('🏠'))


app.listen(APP_PORT, () => console.log(`Silence, ça tourne sur le port ${APP_PORT}.`))