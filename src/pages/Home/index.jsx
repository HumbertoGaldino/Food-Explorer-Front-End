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
import 'swiper/css';

import bannerHomeMobile from "../../assets/banner-mobile.png";
import bannerHomeDesktop from "../../assets/home-banner.png";


export function Home({ isAdmin, user_id }) {
  const swiperElRef1 = useRef(null);
  const swiperElRef2 = useRef(null);
  const swiperElRef3 = useRef(null);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // the value in percentage indicates at what visibility the callback should be called
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the element is visible, start the Swiper autoplay if the ref is not null
          entry.target.swiper && entry.target.swiper.autoplay.start();
        } else {
          // If the element is not visible, stop the Swiper autoplay if the ref is not null
          entry.target.swiper && entry.target.swiper.autoplay.stop();
        }        
      });
    }, options);

    // Observe the visibility changes of elements containing Swiper
    observer.observe(swiperElRef1.current);
    observer.observe(swiperElRef2.current);
    observer.observe(swiperElRef3.current);

    return () => {
      observer.disconnect();
    }
  }, []);

  const [dishes, setDishes] = useState({ meals: [], desserts: [], beverages: [] });
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  function handleDetails(id) {
    navigate(`/dish/${id}`);
  }

  useEffect(() => {
    async function fetchDishes() {
      const response = await api.get(`/dishes?search=${search}`);
      const meals = response.data.filter(dish => dish.category === "meal");
      const desserts = response.data.filter(dish => dish.category === "dessert");
      const beverages = response.data.filter(dish => dish.category === "beverage");

      setDishes({ meals, desserts, beverages });
    }

    fetchDishes();
  }, [search]);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        const favorites = response.data.map((favorite) => favorite.dish_id);

        setFavorites(favorites);
      } catch (error) {
        console.log("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavorites();
  }, []);

  const updateFavorite = async (isFavorite, dishId) => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${dishId}`);

        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite !== dishId)
        );
      } else {
        await api.post('/favorites', { dish_id: dishId });
        setFavorites((prevFavorites) => [...prevFavorites, dishId]);
      }
    } catch (error) {
      console.log('Erro ao atualizar favoritos:', error);
    }
  };

  return (
    <ContainerHome>
      {!isDesktop && 
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
            <img 
              src={isDesktop ? bannerHomeDesktop : bannerHomeMobile} 
              alt="Uma variedade de macarons coloridos em tons pastel, como rosa, azul, amarelo e verde, caem graciosamente ao lado de folhas verdes frescas e frutas suculentas, como morangos e framboesas, sobre um fundo branco limpo. A cena é vibrante e alegre, evocando uma sensação de frescor e doçura.." 
            />
          
            <div>
              <h1>Sabores inigualáveis</h1>
              <p>Sinta o cuidado do preparo com ingredientes selecionados</p>
            </div>
          </header>

          <HomeContent>
            <Section title="Refeições">
              <Swiper
                key={isDesktop}
                ref={swiperElRef1}
                spaceBetween={isDesktop ? 27 : 16}
                slidesPerView="auto"
                navigation={isDesktop ? true : false}
                loop={true}
                grabCursor={true}
              >
                {
                  dishes.meals.map(dish => (
                    <SwiperSlide key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish}
                        isFavorite={favorites.includes(dish.id)}
                        updateFavorite={updateFavorite} 
                        user_id={user_id}
                        handleDetails={handleDetails}
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </Section>

            <Section title="Sobremesas">
              <Swiper
                key={isDesktop}
                ref={swiperElRef2}
                spaceBetween={isDesktop ? 27 : 16}
                slidesPerView="auto"
                navigation={isDesktop ? true : false}
                loop={true}
                grabCursor={true}
              >
                {
                  dishes.desserts.map(dish => (
                    <SwiperSlide key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish}
                        isFavorite={favorites.includes(dish.id)}
                        updateFavorite={updateFavorite} 
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
                key={isDesktop}
                ref={swiperElRef3}
                spaceBetween={isDesktop ? 27 : 16}
                slidesPerView="auto"
                navigation={isDesktop ? true : false}
                loop={true}
                grabCursor={true}
              >
                {
                  dishes.beverages.map(dish => (
                    <SwiperSlide key={String(dish.id)}>
                      <Food 
                        isAdmin={isAdmin}
                        data={dish} 
                        isFavorite={favorites.includes(dish.id)}
                        updateFavorite={updateFavorite}
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