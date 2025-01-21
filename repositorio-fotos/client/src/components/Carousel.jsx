import React from "react";
import Slider from "react-slick";
import "./../styles/Carousel.css";

// Flechas de navegación personalizadas
const SampleNextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-slick-arrow custom-slick-next`}
    style={style}
    onClick={onClick}
  >
    &gt;
  </div>
);

const SamplePrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-slick-arrow custom-slick-prev`}
    style={style}
    onClick={onClick}
  >
    &lt;
  </div>
);

const Carousel = ({ images, onDelete }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const bufferToBase64 = (buffer) => {
    if (!buffer?.data) return "";
    return btoa(
      new Uint8Array(buffer.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  return (
    <section className="carousel-section">
      {images.length > 0 ? (
        <Slider {...sliderSettings}>
          {images.map((image) => (
            <div key={image._id} className="carousel-image-container">
              <img
                src={`data:${image.mimetype};base64,${bufferToBase64(image.buffer)}`}
                alt={image.originalname}
                className="carousel-img"
              />
              {/* Botón de eliminar con alias */}
              {onDelete && (
                <button
                  className="delete-icon"
                  onClick={() => onDelete(image._id, image.alias)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <p className="no-images">No hay imágenes aprobadas todavía.</p>
      )}
    </section>
  );
};

export default Carousel;
