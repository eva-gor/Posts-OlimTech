import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PostType from '../model/PostType';
import { useDispatchCode } from '../../hooks/hooks';
import { postService } from '../../config/service-config';
import CommentType from '../model/CommentType';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type Props = {
    post: PostType | CommentType,
    open: boolean,
    handleClose: () => void,
    isPost: boolean
}

const DeletePostCommentForm: React.FC<Props> = ({ post, open, handleClose, isPost }) => {
    const dispatch = useDispatchCode();
    const text ='title' in post! ? post!.title.substring(0, 50) + '...' : post!.text.substring(0, 50) + '...';
    const deleteHandler = async () => {
        let err ='';
        let ok= '';
        try {
            if (isPost){
                await postService.deletePost(post!.id);
                ok = 'Post is deleted';
            } else {
                await postService.deleteComment(post!.id);
                ok = 'Comment is deleted';
            }
        } catch (e) {
            err =typeof e === 'string' ? e : 'Deletion failed';
        }
        handleClose();
        dispatch(err, ok);
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="modal-modal-title">Do you want to delete post:</h2>
                    <p id="modal-modal-description">
                        {text}
                    </p>
                    <p>
                        {new Date(+post!.date).toDateString()}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={deleteHandler}>Yes</Button>
                        <Button variant="contained" onClick={handleClose}>No</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default DeletePostCommentForm;