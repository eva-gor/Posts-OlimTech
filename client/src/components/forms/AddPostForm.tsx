import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, TextField } from '@mui/material';
import { postService } from '../../config/service-config';
import InputResult from '../model/InputResult';
import { useSelectorAuth } from '../../redux/store';
import { codeActions } from '../../redux/slices/codeSlice';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const defaultPost = { title: '', image: '' };
type Props = {
    openDialog: boolean;
    goBack: () => void
}
const AddPostForm: React.FC<Props> = ({ openDialog, goBack }) => {
    const userData = useSelectorAuth();
    const dispatch = useDispatch();

    const [post, setPost] = React.useState<{ title: string, image: string }>(defaultPost);
    const handleClose = () => {
        setPost(defaultPost);
        goBack();
    };
    const handleSave = async () => {
        let inputResult: InputResult = {
            status: 'error',
            message: "Server unavailable, repeat later on"
        }
        try {
            const response = await postService.createPost(post.title, userData);
            if (post.image){
                const postId = response.id;
                await postService.uploadPostPicture(postId, post.image);
            }
            inputResult = { status: 'success', message: 'Post is added' }
        } catch (err) {
            inputResult = { status: 'error', message: typeof err === 'string' ? err : 'Error' }
        }
        dispatch(codeActions.set(inputResult));
        handleClose();
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Add Post
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box component="form" onSubmit={handleSave} noValidate sx={{ mt: 1 }} marginLeft='10px' marginRight='10px'>
                    <TextField
                        color='secondary'
                        margin="normal"
                        required
                        fullWidth
                        name="title"
                        label="Title"
                        type="title"
                        id="title"
                        variant='standard'
                        multiline
                        onChange={event=> setPost({...post, title: event.currentTarget.value})}
                    />

                    <TextField
                        fullWidth
                        variant="standard"
                        color='secondary'
                        label="Image URL"
                        name='image'
                        value={post.image.substring(post.image.lastIndexOf('\\'))}
                        onChange={event => { const newVal = event.target.value; setPost({ ...post, image: newVal }) }}
                    />
                    {post.image && <img src={post.image} alt="No image" style={{ width: '30vw', aspectRatio: 'auto/1' }} />}

                </Box>
            </Dialog>
        </div>
    );
}
export default AddPostForm;
