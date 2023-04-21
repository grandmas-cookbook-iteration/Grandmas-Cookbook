import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { updateCard } from '../../slices/cardSlice';
import { purple } from '@mui/material/colors';

export default function MoreButton({ recipe }) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

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
    if (canEdit) {
      console.log(
        'ingredientText',
        document.getElementById(`${recipe.id}ingredientText`).textContent
      );
      setSaveEditButton('Edit');
      fetch(`/recipe/update/${recipe.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...recipe,
          ingredientList: document
            .getElementById(`${recipe.id}ingredientText`)
            .textContent.split('\n'),
          directions: document
            .getElementById(`${recipe.id}directions`)
            .textContent.split('\n'),
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((data) => {
          // console.log(data);
          dispatch(updateCard(data));
        })
        .catch((err) => console.log(`Error code: ${err}`));
    } else setSaveEditButton('Save');
    setCanEdit((state) => !state);
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
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
            contentEditable={canEdit.toString()}
            // multiline
            style={{ whiteSpace: 'pre-line' }}
          >
            {recipe.ingredientList ? recipe.ingredientList.join('\n') : null}
          </DialogContentText>
        </DialogContent>

        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id={`${recipe.id}directions`}
            ref={descriptionElementRef}
            tabIndex={-1}
            contentEditable={canEdit.toString()}
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
