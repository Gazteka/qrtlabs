from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres_qrt:FaMs138828654@aws-qrt-database.cglwp2aoyny8.us-east-1.rds.amazonaws.com:5432/aws_qrt_dbb"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit= False,autoflush=False,bind = engine)
Base = declarative_base()