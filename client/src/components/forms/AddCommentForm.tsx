import { Box, Button, TextField } from "@mui/material";
import PostType from "../model/PostType";
import { useState } from "react";
import { postService } from "../../config/service-config";
import { useSelectorAuth } from "../../redux/store";
import { useDispatch } from "react-redux";
import { codeActions } from "../../redux/slices/codeSlice";

type Props ={
    post: PostType
}
const AddCommentForm:React.FC<Props> = ({post})=>{
    const [comment, setComment] = useState<string>('');
    const username = useSelectorAuth();
    const dispatch = useDispatch();
    const AddCommentForm = async ()=>{
        try {
            await postService.createComment(comment, post.id, username);
            dispatch(codeActions.set({status: 'success', message: 'Comment is added'}));
            setComment('');
        } catch (e){
            dispatch(codeActions.set({status: 'error', message: typeof e === 'string' ? e : 'Error'}))
        }
    }
    return <Box>
        <TextField
        multiline
        maxRows={3}
        placeholder="Input your comment..."
        defaultValue=''
        value={comment}
        fullWidth
        onChange={event => setComment(event.currentTarget.value)}
        />
        <Button onClick={AddCommentForm}>Add comment</Button>
    </Box>
}
export default AddCommentForm;