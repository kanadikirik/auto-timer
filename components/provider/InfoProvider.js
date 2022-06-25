import React, { useState } from 'react'
import { InfoContext } from '../../services/context/InfoContext'
import Info from '../Info'

export default function InfoProvider({ children }) {
	const [messages, setMessages] = useState([])

	const createMessage = async (text, status) => {
		const newMessage = {
			id: messages.length ? messages[messages.length - 1].id + 1 : 1,
			text,
			status,
		}
		setMessages([newMessage, ...messages])
		setTimeout(async () => deleteMessage(newMessage.id), 3000)
	}

	const deleteMessage = async id => {
		const index = messages.findIndex(message => message.id === id)
		messages.splice(index, 1)
		setMessages([...messages])
	}

	return (
		<InfoContext.Provider value={{ createMessage }}>
			<Info messages={messages} />
			{children}
		</InfoContext.Provider>
	)
}
