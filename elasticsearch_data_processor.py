from database import SessionLocal
from elasticsearch import Elasticsearch, helpers

from main import get_all_product_name

products = get_all_product_name()

docs = []
es = Elasticsearch('http://localhost:9200')
index = 'autocomplete_test_3'
num = 1
for name in products:
    doc = {
        "_index": index,
        "_id": num,
        "_source": {
                    'id': num,
                    'name': name,
                    'nori_name': name
                   }
    }
    num += 1
    docs.append(doc)

helpers.bulk(es, docs)
