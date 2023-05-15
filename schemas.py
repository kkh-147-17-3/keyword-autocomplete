from pydantic import BaseModel
from pydantic.schema import datetime, date


class Product(BaseModel):
    idx: int
    name: str
    size: str
    color: str
    recommand_using_age: str
    recommand_using_weight: str
    product_weight: str
    precaution: str
    as_number: str
    qualify_standard: str
    make_country: str
    product_date: date
    product_material: str
    product_company_idx: int
    detail_description: str
    product_category_idx: int
    upload_code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

