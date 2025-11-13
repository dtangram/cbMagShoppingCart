import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import createDebug from 'debug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = createDebug('reactjs:logging');

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'reactjs/build')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'reactjs/build', 'index.html'));
});

app.listen(port, () => {
  log(`Listening on port ${port}`);
  console.log(`Listening on port ${port}`);
});