import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const port = 5000;

const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/', (req: any, res: any) => {
    let helloWorld = 'Go study';
    res.send(helloWorld)
})

app.get('/videos', (req: any, res: any) => {
    res.status(200);
    res.send(videos)
})

app.get('/videos/:videoId', (req: any, res: any) => {
    const { videoId } = req.params
    const currentVideo = videos.filter(video => video.id === JSON.parse(videoId));
    if (currentVideo.length) {
        res.send(currentVideo);
    } else {
        res.status(404);
        res.send("This video is not exit")
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})