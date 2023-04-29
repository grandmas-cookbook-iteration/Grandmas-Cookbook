import React, { FC, useRef } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Backdrop, Alert} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { setUrlResult, clearUrlResult, State as ModalState } from '../../slices/modalSlice';
import { addCard, deleteCard } from '../../slices/cardSlice'
import { RootState } from '../..';

const UrlAddForm: FC<{}> = () => {
// function UrlAddForm() {
    const fieldValue = useRef('');
    const dispatch = useDispatch();
    const {urlScrape} = useSelector<RootState, ModalState>(state=>state.modal) // FIXME: what is the type here? we don't see this component being rendered
    const [open, setOpen] = React.useState(false);
    const [queryError, setQueryError] = React.useState(false);
    
    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = () => {
      setOpen(true);
    };
    // const { ingredientList, directions, title} = urlScrape
    
    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setQueryError(false)
        handleOpen();
        await fetch(`http://localhost:3000/recipe/scrapeUrl/?url=${fieldValue.current.valueOf()}`)
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error(String(res.status));
          })
        .then((data) => {
          dispatch(setUrlResult(data))
        })
        .then(() => handleClose())
        .catch(() => {
            setQueryError(true);
            handleClose()
        })
    };

    function addHandler(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setQueryError(false);
        handleOpen();
        fetch('/recipe/add', 
            {method: 'POST', 
            body: JSON.stringify(urlScrape),
            headers: {
                'Content-type': 'application/json',
            }})
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error(String(res.status));
              })
            .then(data => dispatch(addCard(data)))
            .then(() => handleClose())
            .then(() => dispatch(clearUrlResult()))
            .catch(() => {
                setQueryError(true);
                handleClose()
            })
    }


    return (
        <Box>
             {queryError ? <Alert severity="error" style={{border: 'black 5px', background: '#DDBEA9'}}>Could not complete the search</Alert> : null}
            <TextField id="urlField" label='URL' inputRef={fieldValue}/>
            <Button onClick={handleSubmit}>Submit</Button>
            {!urlScrape.ingredientList ? null : 
            <>
                <Typography variant='h5'>
                    {urlScrape.title}
                </Typography>
                <Typography variant='h6'>
                    ingredients
                </Typography>
                { !urlScrape.ingredientList ? null : urlScrape.ingredientList.map((item: String, i=0) => {
                    i += 1;
                    return <li key={`ingredient${i}`}>{item}</li> 
                } 
                )}
                <Typography variant='h6'>
                    directions
                </Typography>
                { !urlScrape.directions ? null : urlScrape.directions.map((item: String, i = 0) => {
                    i += 1;
                    return <li key={`direction${i}`}>{item}</li> 
                    }) 
                }
                <Button onClick={addHandler}>Add to my Recipes</Button>   
            </>
            }

            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default UrlAddForm;