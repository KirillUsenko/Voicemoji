import axios from "axios"

const BACKEND_URL = 'http://localhost:5000'

const sendFile = data => {
	return axios
		.post(`${BACKEND_URL}/sendFile`, data, {
			headers: { 'content-type': 'multipart/form-data' },
		})
}

export { sendFile }
