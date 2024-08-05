import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Input, Button } from '@mui/material';

export default function HomePage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const onSubmit = () => {
    window.ipc.send('add-message', message)
    setMessages([...messages, message])
    setMessage('')
  }

  const removeMessage = (index: number) => {
    window.ipc.send('remove-message', index)
    setMessages(messages.filter((_, i) => i !== index))
  }

  useEffect(() => {
    window.ipc.on('messages', (messages: string[]) => {
      setMessages(messages)
    })

    window.ipc.send('get-messages', null)
  }, [])

  return (
    <div>
      <Head>
        <title>Home - Nextron (basic-store-data)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <Link href="/next">Go to next page</Link>
        </p>
        <Image
          src="/images/logo.png"
          alt="Logo image"
          width={256}
          height={256}
        />
        <hr />
        <h2 className=''>Enter your message:</h2>
        <Input type="text" value={message} onChange={(e)=>{setMessage(e.target.value)}}></Input>
        <Button className='bg-green-500 text-white' onClick={onSubmit}>Enviar</Button>
        <hr />
        <h2>Messages</h2>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>
              {m}{' '}
              <button onClick={() => removeMessage(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
