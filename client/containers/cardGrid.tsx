import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Container,
  TextField,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import RecipeCard from '../components/recipeCard';
import AddRecipeModal from '../components/addRecipePage/AddRecipeModal';
import { init } from '../slices/cardSlice';
import { clearKeywordResult } from '../slices/modalSlice';
import { RootState } from '../index';
import { Recipe as Recipe } from '../slices/cardSlice';
import APIAddForm from '../components/forms/ApiAddForm';


function CardGrid() {
  const dispatch = useDispatch();
  // States to support live filtering of the recipes
  const [filteredRecipes, setFilteredRecipes] = React.useState<Recipe[]>([]);
  const [filterKeyword, setFilterKeyword] = React.useState<String>('');

  // State to support the add recipe modal.
  const [openAddRecipe, setOpenAddRecipe] = React.useState<boolean>(false);

  // Handler for control the filter keyword in text field.
  //
  const onFilterKeywordChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFilterKeyword(e.target.value);

  // Two handlers for open and close the add recipe modal.
  const handleCloseAddRecipe = () => {
    setOpenAddRecipe(false);
    dispatch(clearKeywordResult())
  };
  const handleOpenAddRecipe = () => {
    setOpenAddRecipe(true);
  };

  const recipesArray = useSelector<RootState, Recipe[]>((state) => state.card.recipes)
  

// import { configureStore } from '@reduxjs/toolkit'
// // ...
// const store = configureStore({
//   reducer: {
//     one: oneSlice.reducer,
//     two: twoSlice.reducer,
//   },
// })
// export type RootState = ReturnType<typeof store.getState>

// export default store


  useEffect(() => {
    fetch('/recipe/all', { method: 'GET' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(String(res.status));
      })
      .then((data) => {
        dispatch(init(data));
      })
      .catch((err) => console.log(`Error code: ${err}`));
  }, []);

  useEffect(() => {
    setFilteredRecipes(
      recipesArray.filter((recipe) => {
        return recipe.title.toLowerCase().includes(filterKeyword.toLowerCase())
      })
    );
  }, [recipesArray, filterKeyword]);

  return (
    <main>
      <div>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" onClick={handleOpenAddRecipe} sx={{marginTop: '16px'}}>
                Get New Recipe
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <TextField
                label="Find Your Recipe"
                variant="standard"
                value={filterKeyword}
                onChange={onFilterKeywordChange}
                inputProps={{ style: { fontSize: 32 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Container className="classes.cardGrid">
                <Grid container spacing={3}>
                  {filteredRecipes.map((card) => (
                    <Grid item key={card.id} xs={12} sm={4} md={3}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <RecipeCard key={`${card.id}`} addHandler={(card) => () => undefined} type='' recipe={card} title={card.title} image={card.imagePath} />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
              <AddRecipeModal
                open={openAddRecipe}
                handleClose={handleCloseAddRecipe}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
    </main>
  );
}

export default CardGrid;
