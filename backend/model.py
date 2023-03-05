import datetime

from passlib import hash
from sqlalchemy import VARCHAR, BigInteger, Column, DateTime, Integer, String

from config import Base


class Historical(Base):
    __tablename__ = "USDCLP_historico"
    fecha = Column(DateTime,primary_key = True)
    open_price = Column(name="open",type_=Integer)
    high = Column(Integer)
    low = Column(Integer)
    close  = Column(Integer)
    up  = Column(Integer)
    down  = Column(Integer)
    volumen  = Column(Integer)

class Users(Base):
    __tablename__  = "users"
    id = Column(Integer, primary_key = True,index = True)
    email = Column(String, unique =True,index = True)
    hash_password = Column(String)

    def verify_password(self,password:str):
        return hash.bcrypt.verify(password,self.hash_password)  



class Orders(Base):
    __tablename__  = "kompro_orders"
    id = Column(Integer, primary_key = True,index = True)
    created_by = Column(String)
    created_at = Column(DateTime ,default= datetime.datetime.today)
    target_price = Column(Integer)
    loss_price = Column(Integer)
    deadline = Column(DateTime)
    note = Column(String)
    amount =Column(Integer)

