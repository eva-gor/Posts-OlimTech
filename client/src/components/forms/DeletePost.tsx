import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PostType from '../model/PostType';
import { useDispatchCode } from '../../hooks/hooks';
import { postService } from '../../config/service-config';

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
    post: PostType,
    open: boolean,
    handleClose: () => void
}

const DeletePost: React.FC<Props> = ({ post, open, handleClose }) => {
    const dispatch = useDispatchCode();
    const deleteHandler = async () => {
        let err ='';
        let ok= '';
        try {
            await postService.deletePost(post.id);
            ok = 'Post is deleted';
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
                        {post.title.substring(0, 50) + '...'}
                    </p>
                    <p>
                        {new Date(+post.date).toDateString()}
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

export default DeletePost;