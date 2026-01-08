import React from 'react'

export const Hero = () => {
  return (
    <section className="text-gray-600 body-font bg-gradient-to-r from-blue-50 via-white to-blue-100 h-[89vh]" >
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">

        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img style={{height: "62vh",
          width: "55vh",
          marginLeft: "5rem"}}
            className="object-cover object-center rounded shadow-lg shadow-blue-200/40"
            alt="hero" 
            src="../src/assets/ChatGPT Image Dec 12, 2025, 11_09_07 AM.png"
          />
        </div>

        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold text-gray-900">
            Learn Skills That  
            <br className="hidden lg:inline-block" />
            <span className="text-blue-600">Shape Your Future</span>
          </h1>

          <p className="mb-8 leading-relaxed max-w-lg text-gray-700">
            Join India’s most practical learning platform. Master full-stack development,
            build real projects, and unlock high-paying opportunities without confusion.
          </p>

          <div className="flex justify-center">
            <button className="inline-flex text-white bg-blue-600 border-0 py-2 px-6 
            focus:outline-none hover:bg-blue-700 rounded text-lg shadow-md shadow-blue-200/50">
              Get Started
            </button>

            <button className="ml-4 inline-flex text-blue-600 bg-white border border-blue-600 py-2 px-6 
            hover:bg-blue-50 rounded text-lg">
              Explore Courses
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
