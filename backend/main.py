
from fastapi import FastAPI

import model
import router
from config import engine
from fastapi.middleware.cors import CORSMiddleware

model.Base.metadata.create_all(bind = engine)
origins = ["*","localhost:3000"
]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(router.router ,tags =["book"])