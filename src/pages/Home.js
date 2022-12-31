import axios from 'axios'
import { motion } from 'framer-motion'
import { scaleTransition } from '../animations'
import { useEffect, useState } from 'react'
import { sendFile } from '../api'
import Loader from '../components/Loader'
import MicRecorder from 'mic-recorder-to-mp3'
import '../styles/Home.scss'

const Home = () => {
	const recorder = new MicRecorder({ bitRate: 128 })
	const [recorderData, setRecorderData] = useState({
		isRecording: false,
		isBlocked: false,
	})
	const [isFileLoaded, setIsFileLoaded] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isSuccess, setIsSuccess] = useState(true)
	const [result, setResult] = useState('')

	const restart = () => {
		setIsFileLoaded(false)
		setIsLoading(true)
		setIsSuccess(true)
	}

	const onStartRecording = () => {
		if (recorderData.isBlocked) {
			console.log('Разрешение отклонено!')
		} else {
			recorder
				.start()
				.then(() => null)
				.catch(err => console.error(err))
		}
	}

	const onStopRecording = () => {
		recorder
			.stop()
			.getMp3()
			.then(([buffer, blob]) => {
				const file = new File(buffer, 'file.mp3', {
					type: blob.type,
					lastModified: Date.now(),
				})

				setRecorderData({ ...recorderData, isRecording: false })

				console.log(file)

				const formData = new FormData()
				formData.append('file', file)

				sendFile(formData)
					.then(res => {
						setIsSuccess(true)
						setResult(res.data.result)
					})
					.catch(err => console.log(err))
					.finally(() => setIsLoading(false))
			})
			.catch(err => console.log(err))
	}

	const onSubmit = e => {
		e.preventDefault()

		if (recorderData.isRecording) {
			onStopRecording()
			return
		}

		onStartRecording()
		navigator.getUserMedia(
			{ audio: true },
			() => {
				console.log('Разрешение получено!')
				setRecorderData({ ...recorderData, isBlocked: false })
			},
			() => {
				console.log('Разрешение отклонено!')
				setRecorderData({ ...recorderData, isBlocked: true })
			}
		)
	}

	const onChange = e => {
		e.preventDefault()
		setIsFileLoaded(true)

		const file = e.target.files[0]
		const formData = new FormData()

		if (file.type === 'audio/mpeg') formData.append('file', file)
		else {
			alert('Загрузите mp3!')
			setIsFileLoaded(false)
			return
		}

		sendFile(formData)
			.then(res => {
				setIsSuccess(true)
				setResult(res.data.result)
			})
			.catch(err => console.log(err))
			.finally(() => setIsLoading(false))
	}

	return (
		<>
			<header className='header'>
				<div className='header__ellipse header__ellipse_first' />
				<div className='header__ellipse header__ellipse_second' />
				<div className='header__ellipse header__ellipse_third' />
				<nav className='nav'>
					<div className='container'>
						<motion.div className='nav__logo' {...scaleTransition}>
							<img src='/logo.svg' alt='Voicemoji логотип' />
							<span>voicemoji</span>
						</motion.div>
					</div>
				</nav>

				<div className='form'>
					<div className='container'>
						{!isFileLoaded ? (
							<motion.form
								{...scaleTransition}
								onSubmit={onSubmit}
								className='form__inner'
							>
								<h1 className='form__title'>Узнать эмоции человека</h1>
								<p className='form__text'>
									Загрузите голосовой файл, мы его проанализируем и покажем вам
									подробные результаты. Не передаём никуда ваши данные!
								</p>

								<div className='form__buttons'>
									<button className='form__button form__upload'>
										<input
											className='form__file'
											onChange={onChange}
											type='file'
										/>
										<span>
											<span>Загрузить файл</span>
										</span>
									</button>
									<button className='form__button form__voice'>
										<span>
											<span>
												{recorderData.isRecording
													? 'Остановить запись'
													: 'Начать запись'}
											</span>
										</span>
									</button>
								</div>
							</motion.form>
						) : (
							<div className='form__inner'>
								{isLoading && <Loader />}
								{!isLoading && (
									<>
										<p className='form__result'>
											{isSuccess
												? result
												: 'Произошла ошибка, попробуйте снова!'}
										</p>

										<button
											className='form__button form__update'
											onClick={restart}
										>
											<span>
												<span>Ещё раз</span>
											</span>
										</button>
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</header>
		</>
	)
}

export default Home
