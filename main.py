from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Product
from trie import Trie, nameTokenize
from numba import jit


# host = 'localhost'
# username = 'root'
# password = '1234'
# db = 'mari_world'
#
# connect_str = 'DRIVER={MySQL ODBC 8.0 ANSI Driver};' + f'User={username};Password={password};Server={host};Database={db};Port=3306;String Types=Unicode'
#
# cnxn = pymysql.connect(host=host, port=3306, user=username,
#                        passwd=password, db=db, charset='utf8')
#
# # cnxn = pyodbc.connect(connect_str)
# cursor = cnxn.cursor(pymysql.cursors.DictCursor)

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_all_product_name(db: Session = SessionLocal()):
    try:
        products = [result[0] for result in db.query(Product.name).order_by(Product.name.asc()).all()]
    finally:
        db.close()

    return products


product_names = get_all_product_name()

trie = Trie()
for name in product_names:
    trie.insert(name)

trie_jamo = Trie()
# product_names = ['안녕하세요', '(에)']
# try:
for name in product_names:
    kor_name_tokens = []
    kor_suffix = nameTokenize(name)
    for suffix in kor_suffix:
        kor_name_tokens.append(trie_jamo.convert_kor_string_with_jamo(suffix))

    trie_jamo.prefix_kor_insert(name)

    for name_token in kor_name_tokens[1:]:
        trie_jamo.suffix_insert(name_token, name)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/search/{keyword}")
async def search(keyword: str, db: Session = Depends(get_db)):
    names = [result[0] for result in db.query(Product.name)
                                        .filter(Product.name.ilike(f'%{keyword}%'))
                                        .offset(0).limit(10).all()]

    return {
        'res': 0,
        'data': names
    }


@app.get('/search_trie/{keyword}')
async def search_by_trie(keyword: str):
    auto_keywords = trie.auto_complete(keyword)
    result = [{'name': name} for name in auto_keywords['name']][:10]
    return {
        'res': 0,
        'data': result
    }


@app.get('/search_trie_jamo/{keyword}')
async def search_by_trie(keyword: str):
    auto_keywords = trie_jamo.query_kor(keyword)
    result = (auto_keywords['prefix_result'] + auto_keywords['suffix_result'])[:10]
    return {
        'res': 0,
        'data': result
    }
