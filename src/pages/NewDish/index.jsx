import { useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';

import { RxCaretLeft } from "react-icons/rx";
import { FiUpload } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";

import { api } from '../../services/api';

import { ContainerNewDish, FormNewDish, ImageNewDish, CategoryNewDish } from "./style";

import { Menu } from "../../components/Menu";
import { NavigationHeader } from '../../components/NavigationHeader';
import { ButtonText } from "../../components/ButtonText";
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { FoodItem } from '../../components/FoodItem';
import { Textarea } from '../../components/Textarea';
import { Button } from "../../components/Button";
import { Footer } from '../../components/Footer';

export function NewDish({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

 function handleImageChange(event) {
    const file = event.target.files[0];
    setImage(file);
    setFileName(file.name);
  };

  const handleAddTag = () => {
    setTags((prevTags) => [...prevTags, newTag]);
    setNewTag("");
  };

  const handleRemoveTag = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleNewDish = async () => {
    if (!image) {
      return alert("Selecione a imagem do prato.");
    }

    if (!name) {
      return alert("Digite o nome do prato.");
    }

    if (!category) {
      return alert("Selecione a categoria do prato.");
    }

    if (tags.length === 0) {
      return alert("É necessário ao menos um ingrediente!");
    }

    if (newTag) {
      return alert("Adicione o ingrediente ou deixe o campo vazio.");
    }

    if (!price) {
      return alert("Digite o preço do prato.");
    }

    if (!description) {
      return alert("Digite a descrição do prato.");
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(tags));

    try {
      await api.post("/dishes", formData);
      alert("Prato cadastrado com sucesso!");
      navigate(-1);
    } catch (error) {
      const message = error.response?.data?.message || "Não foi possível cadastrar o prato.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerNewDish>
      {!isDesktop && (
        <Menu 
          isAdmin={isAdmin} 
          isDisabled 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      )}

      <NavigationHeader
        isAdmin={isAdmin} 
        isDisabled 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <main>
        <FormNewDish>
          <header>
            <ButtonText onClick={handleBack}>
              <RxCaretLeft />
              voltar
            </ButtonText>

            <h1>Adicionar prato</h1>
          </header>

          <div>
            <Section title="Imagem do prato">
              <ImageNewDish>
                <label htmlFor="imagem">
                  <FiUpload size="2.4rem" />
                  <span>{fileName || "Selecione imagem"}</span>

                  <input 
                    id="imagem" 
                    type="file"
                    onChange={handleImageChange}
                  />
                </label>
              </ImageNewDish>
            </Section>

            <Section title="Nome">
              <Input 
                placeholder="Ex.: Salada Ceasar"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Section>

            <Section title="Categoria">
              <CategoryNewDish>
                <label htmlFor="category">
                  <select 
                    id="category" 
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Selecionar</option>
                    <option value="Refeição">Refeição</option>
                    <option value="Sobremesa">Sobremesa</option>
                    <option value="Bebida">Bebida</option>
                  </select>
                  <RiArrowDownSLine size="2.4rem" />
                </label>
              </CategoryNewDish>
            </Section>
          </div>

          <div>
            <Section title="Ingredientes">
              <div className="tags">
                {tags.map((tag, index) => (
                  <FoodItem
                    key={index}
                    value={tag}
                    onClick={() => handleRemoveTag(tag)}
                  />
                ))}

                <FoodItem
                  isNew
                  placeholder="Adicionar"
                  onChange={(event) => setNewTag(event.target.value)}
                  value={newTag}
                  onClick={handleAddTag}
                />
              </div>
            </Section>

            <Section title="Preço">
              <Input 
                className="price"
                placeholder="R$ 00,00" 
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Section>
          </div>

          <Section title="Descrição">
            <Textarea 
              placeholder="Fale brevemente sobre o prato, seus ingredientes e composição"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </Section>

          <div className="save">
            <Button
              title="Salvar alterações"
              onClick={handleNewDish}
              loading={loading}
            />
          </div>
        </FormNewDish>
      </main>
      
      <Footer />
    </ContainerNewDish>
  );
}
