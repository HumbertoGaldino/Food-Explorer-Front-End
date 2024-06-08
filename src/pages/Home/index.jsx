import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import { api } from '../../services/api';
import { ContainerHome, HomeContent } from "./style";

import { Menu } from "../../components/Menu";
import { NavigationHeader } from '../../components/NavigationHeader';
import { Section } from '../../components/Section';
import { Food } from "../../components/Food";
import { Footer } from '../../components/Footer';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import bannerHomeMobile from "../../assets/banner-home-mobile.png";
import bannerHomeDesktop from "../../assets/banner-home-desktop.png";

export function Home({ isAdmin, user_id }) {
  const isDesktopView = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [dishes, setDishes] = useState({ meals: [], desserts: [], beverages: [] });
  const [search, setSearch] = useState("");

  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
      swiperRef.current.swiper.update();
    }
  }, [dishes.meals, dishes.desserts, dishes.beverages]);

 
  useEffect(() => {
    async function fetchDishes() {
      const response = await api.get(`/dishes?search=${search}`);
      const meals = response.data.filter(dish => dish.category === "Refeição");
      const desserts = response.data.filter(dish => dish.category === "Sobremesa");
      const beverages = response.data.filter(dish => dish.category === "Bebidas");

      setDishes({ meals, desserts, beverages });
    }

    fetchDishes();
  }, [search]);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        const favoritesMap = response.data.map((favorite) => favorite.dish_id);

        setFavorites(favoritesMap);
      } catch (error) {
        console.log("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (isFavorite, dishId) => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${dishId}`);

        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite !== dishId)
        );
      } else {
        await api.post(`/favorites/${dishId}`);
        setFavorites((prevFavorites) => [...prevFavorites, dishId]);
      }
    } catch (error) {
      console.log('Erro ao atualizar favoritos:', error);
    }
  };

  function handleDetails(id) {
    navigate(`/dishes/${id}`);
  }

  
  return (
    <ContainerHome>
      {!isDesktopView && 
        <Menu 
          isAdmin={isAdmin} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          setSearch={setSearch}
        />
      }

      <NavigationHeader
        isAdmin={isAdmin} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        setSearch={setSearch}
      />

      <main>
        <div>
          <header>    
            <div className="custom-header">
              <img 
                src={ isDesktopView ? bannerHomeDesktop : bannerHomeMobile} 
                alt="Uma variedade de macarons coloridos em tons pastel, como rosa, azul, amarelo e verde, 
                caem graciosamente ao lado de folhas verdes frescas e frutas suculentas, como morangos e 
                framboesas, sobre um fundo branco limpo. A cena é vibrante e alegre, evocando uma sensação 
                de frescor e doçura.." 
                className="header-image"
              />
            
              <div className="header-content">
                <h1>Sabores inigualáveis</h1>
                <p>Sinta o cuidado do preparo com ingredientes selecionados</p>
              </div>
            </div>
          </header>

          <HomeContent>
            <Section title="Refeições">
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                className="swiper-container"
                slidesPerView={isDesktopView ? 3 : 2}
                spaceBetween={isDesktopView ? 27 : 16}
                navigation={true}
                loop={true}
                grabCursor={true}
              >
                {dishes.meals.map(dish => (
                    <SwiperSlide className="swiper-item" key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish}
                        isFavorite={favorites.includes(dish.id)}
                        toggleFavorite={toggleFavorite} 
                        user_id={user_id}
                        handleDetails={handleDetails}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </Section>

            <Section title="Sobremesas">
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                className="swiper-container"
                slidesPerView={isDesktopView ? 3 : 2}
                spaceBetween={isDesktopView ? 27 : 16}
                navigation={true}
                loop={true}
                grabCursor={true}
              >
                {
                  dishes.desserts.map(dish => (
                    <SwiperSlide className="swiper-item" key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish}
                        isFavorite={favorites.includes(dish.id)}
                        toggleFavorite={toggleFavorite}
                        user_id={user_id}
                        handleDetails={handleDetails}
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </Section>

            <Section title="Bebidas">
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                className="swiper-container"
                slidesPerView={isDesktopView ? 3 : 2}
                spaceBetween={isDesktopView ? 27 : 16}
                navigation={true}
                loop={true}
                grabCursor={true}
                loopFillGroupWithBlank={true}
                onSwiper={(swiper) => swiper.slideTo(0)}
              >
                {
                  dishes.beverages.map(dish => (
                    <SwiperSlide className="swiper-item" key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish} 
                        isFavorite={favorites.includes(dish.id)}
                        toggleFavorite={toggleFavorite}
                        user_id={user_id}
                        handleDetails={handleDetails}
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </Section>
          </HomeContent>
        </div>
      </main>

      <Footer />
    </ContainerHome>
  );
}