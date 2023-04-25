import React, { FC, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { updateCard } from '../../slices/cardSlice';
import { purple } from '@mui/material/colors';
import { Recipe as Recipe } from '../../slices/cardSlice';

interface MoreButtonProps {
  recipe: Recipe;
};

const MoreButton: FC<MoreButtonProps> = ({ recipe }) => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  //   useEffect(() => {
  //     if (page) dispatch(getPosts(page));
  // }, [canEdit, page]);

  //   useEffect(() =>
  //     if (page) dispatch(getPosts(page));
  // }, [dispatch, page]);

  const dispatch = useDispatch();

  const [saveEditButton, setSaveEditButton] = React.useState('Edit');
  const [canEdit, setCanEdit] = React.useState(false);

  // const [ingredientList, setIngredientList] = React.useState(recipe.ingredientList ? recipe.ingredientList.join('\n') : '');
  // const [directions, setDirections] = React.useState(recipe.direction ? recipe.directions.join('\n') : '');

  function setSaveEditButtonLogic() {
    if (saveEditButton === 'Edit') {
      setSaveEditButton('Save');
    } else {
      setSaveEditButton('Edit');
    }
  }

  const canEditLogic = () => {
    const ingredientText = document.getElementById(`${recipe.id}ingredientText`);
    const directionsText = document.getElementById(`${recipe.id}directions`);
    
    if (canEdit && ingredientText && ingredientText.textContent && directionsText && directionsText.textContent) {
      // console.log(
      //   'ingredientText',
      //   document.getElementById(`${recipe.id}ingredientText`).textContent
      // );
      setSaveEditButton('Edit');
      fetch(`/recipe/update/${recipe.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...recipe,
          ingredientList: ingredientText.textContent.split('\n'), 
          directions: directionsText.textContent.split('\n'),
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(String(res.status));
        })
        .then((data) => {
          // console.log(data);
          dispatch(updateCard(data));
        })
        .catch((err) => console.log(`Error code: ${err}`));
    } else setSaveEditButton('Save');
    setCanEdit((state) => !state);
  };

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLInputElement>(null); // FIXME: (type) is it an input element?
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button color="success" onClick={handleClickOpen('paper')}>
        More
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{recipe.title}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id={`${recipe.id}ingredientText`}
            ref={descriptionElementRef}
            tabIndex={-1}
            contentEditable={canEdit} // why were they parsing it as a string here?
            // multiline
            style={{ whiteSpace: 'pre-line' }}
          >
            {recipe.ingredients ? recipe.ingredients.join('\n') : null}
          </DialogContentText>
        </DialogContent>

        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id={`${recipe.id}directions`}
            ref={descriptionElementRef}
            tabIndex={-1}
            contentEditable={canEdit}
            // multiline
            style={{ whiteSpace: 'pre-line' }}
          >
            {recipe.directions ? recipe.directions.join('\n') : null}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="success" onClick={canEditLogic}>
            {saveEditButton}
          </Button>
          <Button color="warning" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



export default MoreButton;