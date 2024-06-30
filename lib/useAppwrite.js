import { useState, useEffect } from 'react'

const useAppWrite = (fn) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const res = await fn()
      setData(res)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return { data, isLoading, refetch }
}

export default useAppWrite
