import { useState, useEffect } from 'react'
import './Banner.css'
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'

const banners = [banner1, banner2, banner3]

const Banner = () => {
  const [index, setIndex] = useState(0)

  const nextSlide = () => setIndex((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length)
  const goToSlide = (i) => setIndex(i)

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [index])

  return (
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((img, i) => (
          <img src={img} alt={`banner-${i}`} key={i} className="carousel-img" />
        ))}
      </div>

      <button className="nav left" onClick={prevSlide}>❮</button>
      <button className="nav right" onClick={nextSlide}>❯</button>

      <div className="indicators">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`dot ${index === i ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Banner
