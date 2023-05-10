from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pymysql
host = 'localhost'
username = 'root'
password = '1234'
db = 'mari_world'

connect_str = 'DRIVER={MySQL ODBC 8.0 ANSI Driver};' + f'User={username};Password={password};Server={host};Database={db};Port=3306;String Types=Unicode'

cnxn = pymysql.connect(host=host, port=3306, user=username,
                       passwd=password, db=db, charset='utf8')

# cnxn = pyodbc.connect(connect_str)
cursor = cnxn.cursor(pymysql.cursors.DictCursor)


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/search/{keyword}")
async def search(keyword: str):
    script = f"""
        SELECT
            name
        FROM
            products
        WHERE
            name LIKE '%{keyword}%'
        LIMIT 0,10
    """

    cursor.execute(script)
    rows = cursor.fetchall()

    return {
        'res': 0,
        'data': rows
    }
