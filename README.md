### Frontend:
### Setting up .env for connecting to backend

Create `.env` 
```bash

VITE_API_URL=****

```

### Run frontend
```bash
cd frontend
npm install
npm run dev
```

### Routes

 /login , /signup

Node version v22.17.0.

### Backend:
#### Setup Environment
Create `.env` 
```bash
OPENAI_API_KEY=****

TIDB_DATABASE_URL=****
```
#### Run Backend 
```bash

cd  backend	

docker  build  -t  images-name  .  --no-cache

docker  run  -p  8000:8000  --env-file  .env  images-name

```
#### API Documentation
After running backend,  access `http://127.0.0.1:8000/docs`
