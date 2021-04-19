import React, { useEffect, useState, useRef } from 'react'

const VIDEO_WIDTH = 1000
export default function Video() {
	const videoRef = useRef()
	const timelineRef = useRef()
	const [buttonPositionX, setButtonPositionX] = useState(0)
	const [duration, setDuration] = useState(0)
	const timer = useRef(null)

	useEffect(() => {
		const onLoadedMetadata = () => {
			console.log('cargo la data', videoRef.current.duration)
			setDuration(videoRef.current.duration)
		}
		const onEnded = () => {
			if (timer.current) clearInterval(timer.current)
		}

		const onClickBtn = e => {
			var rect = e.target.getBoundingClientRect()
			const positionX = e.clientX - rect.left
			const time = (videoRef.current.duration * positionX) / VIDEO_WIDTH
			setButtonPositionX(positionX - 3)
			onSeek(time)
		}
		timelineRef.current.addEventListener('click', onClickBtn)
		videoRef.current.addEventListener('ended', onEnded)
		videoRef.current.addEventListener('canplay', onLoadedMetadata)
		return () => {
			videoRef.current.removeEventListener('canplay', onLoadedMetadata)
			videoRef.current.removeEventListener('ended', onEnded)
		}
	}, [])

	const onPlay = () => {
		videoRef.current.play()

		timer.current = setInterval(() => {
			const newTime = Number((VIDEO_WIDTH / duration).toFixed(1))
			console.log(videoRef.current.currentTime)
			setButtonPositionX(buttonPositionX => {
				const newButtonPositionX = buttonPositionX + Number(newTime)
				// se puede mejorar si se usa el currentTime del video y tambien el interval
				if (buttonPositionX <= VIDEO_WIDTH - 6) return newButtonPositionX
				else return buttonPositionX
			})
		}, 1000)
	}
	const onPause = () => {
		videoRef.current.pause()
		// falta limpiar interval cuando llega al final del video
		clearInterval(timer.current)
	}

	const onSeek = seekedTime => {
		videoRef.current.currentTime = seekedTime
	}

	return (
		<div>
			<div style={{ position: 'relative', display: 'inline-block', marginLeft: '40px' }}>
				<video width={VIDEO_WIDTH} ref={videoRef}>
					<source
						src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
				<div
					className="controls"
					style={{
						position: 'absolute',
						bottom: '20px',
						width: '100%',
					}}
				>
					<div
						className="timeline"
						ref={timelineRef}
						style={{
							width: '100%',
							height: '5px',
							backgroundColor: 'rgba(250,250,250,.8)',
							marginBottom: '15px',
							position: 'relative',
							borderTop: '1px solid #666',
							borderBottom: '1px solid #666',
						}}
					>
						<button
							style={{
								width: '6px',
								height: '12px',
								backgroundColor: 'rgba(250,250,250,.8)',
								marginBottom: '5px',
								top: '-3px',
								position: 'absolute',
								left: buttonPositionX,
								display: 'block',
								padding: '0',
								border: '1px solid #222',
								border: '1px solid #666',
							}}
						></button>
					</div>
					<button onClick={onPlay}>Play</button>
					<button onClick={onPause}>Pause</button>
				</div>
			</div>
		</div>
	)
}
