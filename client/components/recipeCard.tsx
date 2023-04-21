import React, {FC} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useSelector, useDispatch } from 'react-redux';
import MoreButton from "./recipeCardButtons/MoreButton";
import { deleteCard } from '../slices/cardSlice';
import { Recipe as Recipe } from '../slices/cardSlice';

// const useStyles = makeStyles(theme => ({
//   root: {
//     "& .MuiPaper-root": {
//       background: 'black'
//     }
//   }
// }));

interface RecipeProps {
  recipe: Recipe;
  children: any; // FIXME: Type?
  type: String;
  addHandler: any; // FIXME: type?
};


const RecipeCard: FC<RecipeProps> = ({ recipe, children, type, addHandler }) => {
  // need to loop through the the fetch data
  // console.log('type', type)
  // const [saveEdit, setSaveEdit] = useToggle();

  const dispatch = useDispatch();

  const [deleteButton, setDeleteButton] = React.useState(true);
  const setDeleteButtonLogic = () => {
    setDeleteButton((prev) => !prev);
    fetch(`/recipe/delete/${recipe.id}`, {
      method: 'DELETE',
    })
    .then((res) => {
      if (res.ok) return dispatch(deleteCard(recipe));
      throw new Error(String(res.status));
    })
    .catch((err) => console.log(`Error code: ${err}`));
  };

  if (deleteButton)
    return (
      <Card sx={{ maxWidth: 600,
      }}
      style={{ border: "none", background:'#DDBEA9' }}
       >
        <CardMedia
          component="img"
          alt="recipe image"
          sx={{width: '258px', height: '256px',  alignItems:'flex-end'}}
          // height="140"
          image={recipe.imagePath}
        />
        <CardContent >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
          >
            {recipe.title}
          </Typography>
        </CardContent>
        <CardActions> 
          {type === 'addForm' ? <Button color="success" onClick={addHandler(recipe)}>Add</Button> : null}
          <MoreButton recipe={recipe}/>
          <Button color="error"  size="small" onClick={setDeleteButtonLogic}>
            Delete
          </Button>
        </CardActions>
        {children}
      </Card>
    );
}

export default RecipeCard;
