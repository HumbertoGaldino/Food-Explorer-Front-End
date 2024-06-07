import { FiMenu, FiLogOut } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

import { NavigationHeaderContainer, MenuButton, Logo, LogoutButton } from "./style";

import { SearchBar } from "../../components/SearchBar";
import { Button } from "../../components/Button";

import logo from "../../assets/logo.svg";
import logoDesktopAdmin from "../../assets/brand-desktop-admin.svg";
import logoMobileAdmin from "../../assets/brand-mobile-admin.svg";

export function NavigationHeader({ isAdmin, isDisabled, isMenuOpen, setIsMenuOpen, setSearch }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const logoUser = isAdmin ? (isDesktop ? logoDesktopAdmin : logoMobileAdmin) : logo;

  const [carts, setCarts] = useState([])
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("@foodexplorer:user"));
  
  const { signOut } = useAuth();
  const navigate = useNavigate();


  function handleFavorites() {
    navigate("/favorites");
  }

  function handleNew() {
    navigate("/new");
  }

  function handleSignOut() {
    navigate("/");
    signOut();
  }

  function handleHome() {
    navigate(`/`);
  }

  function handleOrders() {
    navigate(`/cart`);
  }

  useEffect(() => {
        
    const fetchDishData = async () => {
        try {
            const getCarts = await api.get('/carts');
            setCarts(getCarts.data);
        } catch (error) {
            console.error("Ocorreu um erro ao buscar os dados do carrinho:", error);
        }
    }

    fetchDishData();
  }, []);

  useEffect(() => {
    const findUserCart = () => {
        const cartUser = carts.find(cart => cart.user_id === user.id);
        if (cartUser) {
            const cartId = cartUser.id;

            const fetchCartItems = async () => {
              try {
                  const response = await api.get(`/carts/${cartId}`);
                  const items = response.data.items;

              setCartItems(items);
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os itens do carrinho:", error);
            }
          };

          fetchCartItems();
        } else {
            console.log("Carrinho do usuário não encontrado.");
        }
    };

    if (carts.length > 0) {
        findUserCart();
    }
  }, [carts, user.id]);

 
  return (
    <NavigationHeaderContainer>
      {!isDesktop && (
        <MenuButton>
          {!isMenuOpen ?
            <FiMenu className="fi-menu-icon" onClick={() => setIsMenuOpen(true)} /> :
            <>
              <MdClose size={"1.8rem"} onClick={() => setIsMenuOpen(false)} />
              <span>Menu</span>
            </>
          }
        </MenuButton>
      )}

      {(isDesktop || !isMenuOpen) && (
        <>
          <Logo>
              <img src={logoUser} alt="Logo" onClick={handleHome}/>
          </Logo>

          {isDesktop && <SearchBar isDisabled={isDisabled} setSearch={setSearch} />}

          {isAdmin ? '' :
            isDesktop &&
            <button className="favorites" onClick={handleFavorites}>Meus favoritos</button>
          }

          {isAdmin ? 
            (isDesktop && <Button className="new" title="Novo prato" onClick={handleNew} />) :
            <Button className="orders" title={isDesktop ? "Pedidos" : undefined} isCustomer orderCount={cartItems.length} onClick={handleOrders} />
          }

          {isDesktop &&
            <LogoutButton onClick={handleSignOut}>
              <FiLogOut size={"3.2rem"} />
            </LogoutButton>
          }
        </>
      )}
    </NavigationHeaderContainer>
  );
}