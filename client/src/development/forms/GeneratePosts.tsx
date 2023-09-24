import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { postService } from "../../config/service-config";
import { LoremIpsum } from "lorem-ipsum";
import { useSelectorPostsByPage } from "../../hooks/hooks";
import GetPostsResponseType from "../../components/model/GetPostsByPageType";
import { useDispatchCode } from '../../hooks/hooks';

const usernames: string[] = ['Adam', 'Eva', 'Cain', 'Abel', 'Noel'];
const PARAGRAPH_MIN = 1;
const PARAGRAPH_MAX = 14;
const COMMENTS_MAX = 4;
const sentencesPerParagraphMIN = 4;
const sentencesPerParagraphMAX = 20;
const wordsPerSentenceMIN = 4;
const wordsPerSentenceMAX = 100;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        min: sentencesPerParagraphMIN,
        max: sentencesPerParagraphMAX
    },
    wordsPerSentence: {
        min: wordsPerSentenceMIN,
        max: wordsPerSentenceMAX
    }
});

const GeneratePosts: React.FC = () => {
    const dispatch = useDispatchCode();
    const allPosts: GetPostsResponseType = useSelectorPostsByPage(1, '');
    const [quantity, setQuantity] = useState<number>(1);

    const handleGenerate = async () => {
        try {
            for (let i = 0; i < quantity; i++) {
                const title: string = lorem.generateParagraphs(Math.trunc(Math.random() * (PARAGRAPH_MAX - PARAGRAPH_MIN) + PARAGRAPH_MIN));
                const username = usernames[Math.trunc(Math.random() * usernames.length)];
                await postService.createPost(title, username)
            }
            dispatch('', `${quantity} posts were added`);
        } catch (e) {
            dispatch(typeof e === 'string' ? e : 'Error while deleting', '')
        }
    }

    const handleAddRandomCommentsLikes = () => {
        const middleIndex = Math.round((usernames.length - 2) / 2);
        try {
            allPosts.result.forEach(async post => {
                const usernamesWithoutAuthor = usernames.filter(u => u !== post.username);
                const likes: string[] = usernamesWithoutAuthor.slice(0, Math.round(middleIndex));
                const dislikes: string[] = usernamesWithoutAuthor.slice(Math.round(middleIndex) + 1);
                await postService.updatePost(post.id, post.title, likes, dislikes);
                const numComments = Math.floor(Math.random()*COMMENTS_MAX);
                for (let i = 0; i< numComments; i++){
                    await postService.createComment(lorem.generateParagraphs(1), post.id, post.username);
                }
            });
            dispatch('', 'All data was erased');
        } catch (e) {
            dispatch(typeof e === 'string' ? e : 'Error while adding random comments/likes', '')
        }
    }

    return <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <p ><Button variant="contained" onClick={handleGenerate}>Generate random posts:</Button></p>
        <p>
            <TextField
                defaultValue={1}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                placeholder="Number of posts (>0)"
                onChange={(event) => { setQuantity(+event.currentTarget.value) }}
            />
        </p>
        <Button sx={{ marginTop: '20px' }} variant="contained" onClick={handleAddRandomCommentsLikes}>Add random comments and likes</Button>
    </div>
}
export default GeneratePosts;