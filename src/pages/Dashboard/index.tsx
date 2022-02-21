import Header from 'components/Header';
import api from 'services/api';
import Food from 'components/Food';
import ModalAddFood from 'components/ModalAddFood';
import ModalEditFood from 'components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FoodType } from 'entities/Food';

const Dashboard = () => {
  const [foods, setFoods] = useState<Array<FoodType>>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleLoadFoods = useCallback(async () => {
    const response = await api.get('/foods');
    setFoods(response.data);
  }, []);

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods((prev) => [...prev, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  const toggleEditModal = () => {
    setEditModalOpen((prev) => !prev);
  };

  const handleEditFood = (food: FoodType) => {
    setEditModalOpen(true);
    setEditingFood(food);
  };
  useEffect(() => {
    handleLoadFoods();
  }, [handleLoadFoods]);
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
