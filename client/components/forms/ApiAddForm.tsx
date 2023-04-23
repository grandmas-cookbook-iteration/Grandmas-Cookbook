import React, { useRef, FC } from 'react';
import { TextField, Button, Box, Typography, Backdrop, CircularProgress, Alert} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { setKeywordResult } from '../../slices/modalSlice';
import { addCard } from '../../slices/cardSlice'
import RecipeCard, { RecipeProps } from '../recipeCard';

function APIAddForm() {
    const keywordFieldValue = useRef('');
    const tagFieldValue = useRef('');
    const dispatch = useDispatch();
    const { keywordResults, clearKeywordResult } = useSelector(state => state.modal) // FIXME: what is the type here? we don't see this component being rendered
    const [open, setOpen] = React.useState(false);
    const [queryError, setQueryError] = React.useState(false)
    const [success, setSuccess] = React.useState(false);
    const cardArr: FC<RecipeProps>[] = [];
    
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    
    const addHandler: RecipeProps["addHandler"] = (recipe) => {
        handleOpen();
        setQueryError(true);
        return () => {
        fetch('/recipe/add', 
            {method: 'POST', 
            body: JSON.stringify(recipe),
            headers: {
                'Content-type': 'application/json',
            }})
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error(String(res.status));
              })
            .then(data => dispatch(addCard(data)))
            .then(() => handleClose())
            .catch(() => {
                setQueryError(true);
                handleClose()
            })
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        handleOpen();
        setQueryError(false)
        
        const keywords = keywordFieldValue.current.valueOf().split(' '); // FIXME: probably better to use toString() instead of valueOf()
        const tags = tagFieldValue.current.valueOf().split(' ');
        
        let tagsQuery = '';
        let keywordsQuery = '';

        if (keywords[0] === '') {
            keywordsQuery = 'null'
            keywords.shift();
        } else {
            keywordsQuery = keywords[0];
            keywords.shift();
        }
        
        if (tags[0] === '') {
            tagsQuery = 'null'
            tags.shift()
        } else {
            tagsQuery = tags[0];
            tags.shift();
        }
        
        while (keywords.length >= 1) {
            keywordsQuery += `%20${  keywords.shift()}`
        }
        
        while (tags.length >= 1) {
            tagsQuery += `%20${  tags.shift()}`
        }

        const query = 'http://localhost:3000/tasty/tagQuery/0/50/' + tagsQuery.toLowerCase() + '/' + keywordsQuery.toLowerCase()

        await fetch(query)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error(String(res.status));
            })
            .then((data) => {
                for (let i = 0; i < 5; i++) {
                    const { title } = data[i];
                    cardArr.push(<RecipeCard image='noImage' key={title} title={title} type='addForm' recipe={data[i]} addHandler={addHandler} />)
                }
                dispatch(setKeywordResult(cardArr))
            })
            .then(() => handleClose())
            .catch((err) => {
                setQueryError(true)
                handleClose()
            })
            // .then(() => dispatch(clearKeywordResult()))
    };

    return (
        <Box>
             {queryError ? <Alert severity="error" style={{border: 'black 5px', background: '#DDBEA9'}}>Could not complete the search</Alert> : null}
            <TextField id="tagsField" label='tags' inputRef={tagFieldValue}/>
            <TextField id="keywordField" label='keywords' inputRef={keywordFieldValue}/>
            <Button onClick={handleSubmit}>Submit</Button>
            {keywordResults}
           
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

export default APIAddForm;

