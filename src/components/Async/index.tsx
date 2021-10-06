import { useEffect, useState } from "react"

export function Async() {
  const [isVisible, setIsVisible] = useState(false)
  const [isInvisible, setIsInvisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
      setIsInvisible(true)
    }, 1000)
  }, [])

  return (
    <div>
      <h1>Hello World!</h1>
      { isVisible && <button>Button Visible</button> }
      { !isInvisible && <button>Button Invisible</button> }
    </div>
  )
}
