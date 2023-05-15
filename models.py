from database import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, BigInteger, Text, Date, TIMESTAMP
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = "products"

    idx = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(40))
    size = Column(String(255))
    color = Column(String(255))
    recommand_using_age = Column(String(60))
    recommand_using_weight = Column(String(60))
    product_weight = Column(String(60))
    precaution = Column(Text)
    as_number = Column(String(255))
    qualify_standard = Column(String(255))
    make_country = Column(String(255))
    product_date = Column(Date)
    product_material = Column(String(255))
    product_company_idx = Column(BigInteger)
    detail_description = Column(Text)
    product_category_idx = Column(BigInteger)
    upload_code = Column(String(255))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
