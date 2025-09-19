import React from 'react'
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <div className='p-5'>
        <Hero />
        <div className="-mt-4">
          <CardList title="Now Playing" category="now_playing" />
        </div>
        <CardList title="Top Rated" category="top_rated" />
        <CardList title="Popular" category="popular" />
        <CardList title="Upcoming" category="upcoming" />
        <Footer />

    </div>
  )
}

export default Homepage