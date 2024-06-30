import { useState } from 'react'
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { icons } from '@/constants'
import { usePathname, router } from 'expo-router'

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  const handleSearch = () => {
    if (!query) {
      return Alert.alert('Missing query', 'Please input something to search')
    }

    if (pathname.startsWith('/search')) {
      router.setParams({ query })
    } else {
      router.push(`/search/${query}`)
    }
  }

  return (
    <View className="w-full h-16 px-4 bg-blasdqdck-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} resizeMode="contain" className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
