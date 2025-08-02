import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/logo.jpeg'
import  NetworkPackages from "./components/NetworkPackages"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <NetworkPackages/>
    </>
  )
}

export default App
