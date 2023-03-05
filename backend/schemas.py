from typing import Generic, List, Optional, Sequence, TypeVar

from pydantic import BaseModel as PydanticBaseModel
from pydantic import Field
from pydantic.generics import GenericModel

T = TypeVar("T")

class BaseModel(PydanticBaseModel):
    class Config:
        arbitrary_types_allowed = True

class HistoricalSchema(BaseModel):
    

    fecha: Optional[str] = None
    open_price: Optional[int] = None
    high: Optional[int] = None
    low: Optional[int] = None
    close: Optional[int] = None
    up: Optional[int] = None
    down: Optional[int] = None
    volumen: Optional[int] = None

    class Config:
        orm_mode = True

class OrdersCreate(BaseModel):
    
    created_by: Optional[str] = None
    target_price: Optional[int] = None
    loss_price: Optional[int] = None
    deadline: Optional[str] = None
    note: Optional[str] = None
    amount: Optional[int] = None

    class Config:
        orm_mode = True
class OrdersGet(BaseModel):
    
    id: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None
    target_price: Optional[int] = None
    loss_price: Optional[int] = None
    deadline: Optional[str] = None

    class Config:
        orm_mode = True

class OrdersSearch(BaseModel):
    created_by : Optional[str] = None

class RequestHistorical(BaseModel):
    parameter: HistoricalSchema = Field(...)

class UsersSchema(BaseModel):

    email: Optional[str] = None


class UserCreate(UsersSchema):
    hash_password: str

    class Config:
        orm_mode = True

class User(UsersSchema):
    id: int

    class Config:
        orm_mode = True

class RequestUsers(BaseModel):
    parameter : UsersSchema = Field(...)



class Response(GenericModel,Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
