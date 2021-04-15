import express from 'express'
import api from './lib/components'

// Initialise express
const app = express()

// Config
export const PORT = process.env.PORT || 5001

// For all API calls
app.use('/api', api)

// Starting the server
app.listen(PORT, () => console.log(`server started on port ${PORT}`))
