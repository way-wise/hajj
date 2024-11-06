/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'

// function shuffle(array) {
//   let currentIndex = array.length,
//     randomIndex;

//   // While there remain elements to shuffle.
//   while (currentIndex !== 0) {
//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }

//   return array;
// }

// const animations = shuffle([
//   'animation1',
//   'animation2',
//   'animation3',
//   'animation4',
//   'animation5',
//   'animation6',
//   'animation7',
//   'animation8',
//   'animation9',
//   'animation10',
//   'animation11',
//   'animation12',
//   'animation13',
//   'animation14',
//   'animation15',
//   'animation16',
//   'animation17',
//   'animation18',
// ]);

function KenBurnsSlider({ timing = 5000, images, zoomEffect = false }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const x = setInterval(() => {
      setTick((tick) => {
        if (tick + 1 > images.length - 1) {
          return 0
        }
        return tick + 1
      })
    }, timing)
    return () => {
      clearInterval(x)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lastTick =
    tick - (2 % images.length) < 0
      ? images.length - Math.abs(tick - (2 % images.length))
      : tick - (2 % images.length)

  return (
    <div
      className="sliderContainer h-screen"
      style={
        {
          '--timing': timing,
        } as React.CSSProperties
      }
    >
      {images.map((image, index) => {
        return (
          <div
            key={image}
            className={`sliderImageContainer ${
              tick === index ? `animationFadeIn sliderPlaying` : ''
            }`}
          >
            <img
              alt="wow"
              className={`sliderImage ${zoomEffect ? 'animation' + index : ''} ${index === lastTick ? 'sliderClear' : ''}`}
              src={image}
              loading="lazy"
            />
          </div>
        )
      })}
    </div>
  )
}

export default KenBurnsSlider
