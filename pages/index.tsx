import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../Components/Sidebar';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Build</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=''>
        <Sidebar />
        {/* center  */}

       <div> {/* Player */} </div>
      </main>
    </div>
  )
}

export default Home
