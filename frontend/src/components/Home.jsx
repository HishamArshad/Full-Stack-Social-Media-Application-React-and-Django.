import React from 'react'
import { Link } from 'react-router-dom'
import Posts from './Posts'
const Home = () => {

 
  return (
    <div>
        <p className='text-center mt-32'>Home</p>
        <Posts />
    </div>
  )
}

export default Home