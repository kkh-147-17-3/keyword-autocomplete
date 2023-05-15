from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


host = 'localhost'
username = 'root'
password = '1234'
db = 'mari_world'
SQLALCHEMY_DATABASE_URL = f'mysql+pymysql://{username}:{password}@{host}:3306/{db}'

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
