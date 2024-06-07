import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams, useNavigate } from 'react-router-dom';

import { RxCaretLeft } from 'react-icons/rx';
import { FiUpload } from 'react-icons/fi';
import { RiArrowDownSLine } from 'react-icons/ri';

import { api } from '../../services/api';

import { ContainerEdit, FormEdit, ImageEdit, CategoryEdit } from './style';

import { Menu } from '../../components/Menu';
import { NavigationHeader } from '../../components/NavigationHeader';
import { ButtonText } from '../../components/ButtonText';
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { FoodItem } from '../../components/FoodItem';
import { Textarea } from '../../components/Textarea';
import { Button } from '../../components/Button';
import { Footer } from '../../components/Footer';

export function EditDish({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dish, setDish] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null);

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const response = await api.get(`/dishes/${params.id}`);
        setDish(response.data);
      } catch (error) {
        console.error('Error fetching dish data:', error);
      }
    };

    fetchDishData();
  }, [params.id]);

  useEffect(() => {
    if (dish) {
      setFileName(dish.image);
      setImage(dish.image);
      setName(dish.name);
      setCategory(dish.category);
      setPrice(dish.price);
      setDescription(dish.description);

      const ingredientList = dish.ingredients.map((ingredient) => ingredient.name);
      setIngredients(ingredientList);
    }
  }, [dish]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setUpdatedImage(file);
    setFileName(file.name);
  };

  const addIngredient = () => {
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const updateDish = async () => {
    if (!image || !name || !category || !price || !description) {
      return alert('Por favor, preencha todos os campos obrigatórios.');
    }

    if (ingredients.length === 0) {
      return alert('Por favor, adicione pelo menos um ingrediente.');
    }

    if (newIngredient) {
      return alert('Você deixou um ingrediente no campo para adicionar, mas não clicou em adicionar.');
    }

    setLoading(true);

    try {
      const dishData = {
        name,
        category,
        price,
        description,
        ingredients,
      };

      if (image !== dish.image) {
        const formData = new FormData();
        formData.append('image', image);
        await api.patch(`/dishes/${params.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await api.patch(`/dishes/${params.id}`, dishData);

      alert('Prato atualizado com sucesso!');
      navigate(-1);
    } catch (error) {
      alert('Erro ao atualizar prato:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeDish = async () => {
    if (window.confirm('Deseja realmente remover o prato?')) {
      setLoading(true);
      try {
        await api.delete(`/dishes/${params.id}`);
        navigate('/');
      } catch (error) {
        alert('Erro ao remover prato:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ContainerEdit>
      {!isDesktop && (
        <Menu
          isAdmin={isAdmin}
          isDisabled={true}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      <NavigationHeader
        isAdmin={isAdmin}
        isDisabled={true}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main>
        <FormEdit>
          <header>
            <ButtonText onClick={goBack}>
              <RxCaretLeft />
              Voltar
            </ButtonText>
            <h1>Editar prato</h1>
          </header>

          <Section title="Imagem do prato">
            <ImageEdit className="image">
              <label htmlFor="image">
                <FiUpload size={'2.4rem'} />
                <span>{fileName || 'Selecione imagem'}</span>
                <input id="image" type="file" onChange={handleImageChange} />
              </label>
            </ImageEdit>
          </Section>

          <Section title="Nome">
            <Input
              className="name"
              placeholder="Ex.: Salada Ceasar"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Section>

          <Section title="Categoria">
            <CategoryEdit className="category">
              <label htmlFor="category">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Selecionar</option>
                  <option value="meal">Refeição</option>
                  <option value="dessert">Sobremesa</option>
                  <option value="beverage">Bebida</option>
                </select>
                <RiArrowDownSLine size={'2.4rem'} />
              </label>
            </CategoryEdit>
          </Section>

          <Section title="Ingredientes">
            <div className="tags">
              {ingredients.map((ingredient, index) => (
                <FoodItem
                  key={String(index)}
                  value={ingredient}
                  onClick={() => removeIngredient(ingredient)}
                />
              ))}

              <FoodItem
                isNew
                placeholder="Adicionar"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onClick={addIngredient}
              />
            </div>
          </Section>

          <Section title="Preço">
            <Input
              className="price"
              placeholder="R$ 00,00"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Section>

          <Section title="Descrição">
            <Textarea
              placeholder="Fale brevemente sobre o prato, seus ingredientes e composição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Section>

          <div className="buttons">
            <Button
              className="delete"
              title="Excluir prato"
              onClick={removeDish}
              loading={loading}
            />
            <Button
              className="save"
              title="Salvar alterações"
              onClick={updateDish}
              loading={loading}
            />
          </div>
        </FormEdit>
      </main>

      <Footer />
    </ContainerEdit>
  );
}
