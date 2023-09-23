import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, CardHeader, TextField } from '@mui/material';
import { postService } from '../../config/service-config';
import InputResult from '../model/InputResult';
import { useSelectorAuth } from '../../redux/store';
import { codeActions } from '../../redux/slices/codeSlice';
import { useDispatch } from 'react-redux';
import PostType from '../model/PostType';
import { useState } from 'react';
import DragNDrop from '../common/DragNDropModule';
import { useDispatchCode } from '../../hooks/hooks';

 
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    openDialog: boolean;
    goBack: () => void,
    postExtisted?: PostType
}

const AddUpdatePostForm: React.FC<Props> = ({ openDialog, goBack, postExtisted }) => {
    const defaultTitle = postExtisted ? postExtisted.title : '';
    const username = useSelectorAuth();
    const dispatch = useDispatchCode();
    const [imgFile, setImgFile] = useState<File>();
    const [postTitle, setPosttitle] = useState<string>(defaultTitle);
    const handleClose = () => {
        setPosttitle(defaultTitle);
        goBack();
    };
    const handleSave = async () => {
        let error='';
        let ok ='';
        try {
            if (!postTitle) throw 'Fill title';
            const response = postExtisted ? await postService.updatePost(postExtisted.id, postTitle, postExtisted.likes, postExtisted.dislikes)
                : await postService.createPost(postTitle, username);
            if (imgFile) {
                const postId = response.id;
                await postService.uploadPostPicture(postId, imgFile);
            }
            ok = postExtisted ? 'Post is updated' : 'Post is added' ;
            goBack();
        } catch (err) {
            error = typeof err === 'string' ? err : 'Error' ;
        }
        dispatch(error, ok);
    };
    const setFileFn = function (file: File) { setImgFile(file) };
    return (
        <div>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'sticky' }}>
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
                            {postExtisted ? 'Update Post' : 'Add Post'}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                {
                    postExtisted &&
                    <Box>
                        <CardHeader
                            title={`Posted by ${postExtisted.username}`}
                            subheader={new Date(+postExtisted.date).toDateString()}
                            
                        />
                    </Box>
                }
                <Box sx={{ mt: 1 }}
                    marginLeft='10px' marginRight='10px' textAlign='center'>
                    <TextField
                        multiline
                        color='secondary'
                        margin="normal"
                        required
                        fullWidth
                        name="title"
                        label="Title"
                        type="title"
                        id="title"
                        variant='standard'
                        onChange={event => setPosttitle(event.currentTarget.value)}
                        defaultValue={postTitle}
                    />
                    {!postExtisted && DragNDrop(setFileFn)}
                    {imgFile && <img src={window.URL.createObjectURL(imgFile)} alt="No image"
                        style={{ maxHeight: '50vh', maxWidth: '100vw', objectFit: "contain" }} />}
                </Box>
            </Dialog>
        </div>
    );
}
export default AddUpdatePostForm;
