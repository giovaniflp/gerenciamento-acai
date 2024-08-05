import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    window.ipc.send('add-message', message)
    setMessages([...messages, message])
    setMessage('')
  }

  const removeMessage = (index: number) => {
    window.ipc.send('remove-message', index)
    setMessages(messages.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    window.ipc.on('messages', (messages: string[]) => {
      setMessages(messages)
    })

    window.ipc.send('get-messages', null)
  }, [])

  return (
    <React.Fragment>
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
        <form onSubmit={onSubmit}>
          <input type="text" value={message} onChange={onChange} />
        </form>
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
    </React.Fragment>
  )
}
