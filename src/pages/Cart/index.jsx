import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContainerCart, Main } from './style';

import { NavigationHeader } from '../../components/NavigationHeader';
import { Footer } from '../../components/Footer';
import { CartItem } from '../../components/CartItem';
import { PaymentForm } from '../../components/PaymentForm';
import { api } from '../../services/api';

import { BsXDiamond } from 'react-icons/bs';
import { FaRegCreditCard } from 'react-icons/fa6';

import qrCode from '../../assets/qr-code.svg';

export function Cart(user){
    const [cartItems, setCartItems] = useState([]);
    const [carts, setCarts] = useState([]);
    const [paymentType, setPaymentType] = useState('card');

    const handlePix = () => setPaymentType('pix');

    const handleCreditCard = () => setPaymentType('card');

    const handleDeleteItem = async ()  => {
        await api.delete(`/carts/${cart_id}/item/${dish_id}`);
        
      };

    const user_id = user.user.id;

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
            const cartUser = carts.find(cart => cart.user_id === user_id);
            if (cartUser) {
                const cartId = cartUser.id;
    
                const fetchCartItems = async () => {
                    try {
                        const response = await api.get(`/carts/${cartId}`);
                        const items = response.data.items;
    
                        const fetchedItems = await Promise.all(items.map(async item => {
                            try {
                                console.log(item)
                                const dishResponse = await api.get(`/dishes/${item.dish_id}`);
                                const objectItem = {
                                    cart_id: item.cart_id,
                                    dish_id: item.dish_id,
                                    name: dishResponse.data.name,
                                    image: dishResponse.data.image,
                                    price: dishResponse.data.price,
                                    quantity: item.quantity
                                }
                                return objectItem;
                            } catch (error) {
                                console.error(`Erro ao buscar dados do item com dish_id ${item.dish_id}:`, error);
                                return null;
                            }
                        }));
    
                        setCartItems(fetchedItems);
                        console.log(cartItems)
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
    }, [carts, user_id]);

    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);

    return (
        <ContainerCart>
            <NavigationHeader />

            <Main>
                <section className='allOrders'>
                    <h2>Meu pedido</h2>
                    {cartItems.map(item => (
                        <CartItem
                            key={item.dish_id}
                            cart_id={item .cart_id}
                            dish_id={item.dish_id}
                            quantity={item .quantity}
                            name={item .name}
                            price={item .price}
                            image={item.image}
                            handleDeleteItem={handleDeleteItem}
                        />
                    ))}
                    <span className='priceItems'>Total: R$ {totalPrice}</span>
                </section>

                <section className='paymentMethods'>
                    <h2>Pagamento</h2>
                    
                    <div className='paymentBox'>
                        <div className='paymentMethods__wrapper'>
                            <button disabled={paymentType === 'pix'} onClick={handlePix}>
                                <BsXDiamond size={24} />
                                PIX
                            </button>

                            <button disabled={paymentType === 'card'} onClick={handleCreditCard}>
                                <FaRegCreditCard size={24} />
                                Crédito
                            </button>
                        </div>

                        <div className='paymentForms'>
                            {paymentType === 'pix' ? <img src={qrCode} alt="QR Code para pagamento via PIX" /> : <PaymentForm />}
                        </div>
                    </div>
                </section>
            </Main>

            <Footer />
        </ContainerCart>
    );
}
